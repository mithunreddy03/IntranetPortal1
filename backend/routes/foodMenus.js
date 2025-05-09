const express = require("express");
const router = express.Router();
const FoodMenu = require("../models/foodMenu");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure storage for menu PDFs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/menus");
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "menu-" + uniqueSuffix + ext);
  },
});

// File filter to accept only PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Get all food menus
router.get("/", async (req, res) => {
  try {
    const menus = await FoodMenu.find().sort({ startDate: -1 });
    res.status(200).json(menus);
  } catch (error) {
    console.error("Error fetching food menus:", error.message, error.stack);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Create new food menu (admin only)
router.post("/", authMiddleware, upload.single("menuFile"), async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Only admins can create food menus." });
    }

    const { startDate, endDate } = req.body;

    if (!startDate || !endDate || !req.file) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Create relative path for storage
    const menuFilePath = `uploads/menus/${req.file.filename}`;

    const newMenu = new FoodMenu({
      startDate,
      endDate,
      menuFile: menuFilePath,
      createdBy: req.user.id
    });

    const savedMenu = await newMenu.save();
    res.status(201).json(savedMenu);
  } catch (error) {
    console.error("Error creating food menu:", error.message, error.stack);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Update food menu by ID (admin only)
router.put("/:id", authMiddleware, upload.single("menuFile"), async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Only admins can update food menus." });
    }

    const { id } = req.params;
    const { startDate, endDate } = req.body;

    const menu = await FoodMenu.findById(id);
    if (!menu) {
      return res.status(404).json({ message: "Food menu not found" });
    }

    // Update fields
    menu.startDate = startDate || menu.startDate;
    menu.endDate = endDate || menu.endDate;

    // Update file if provided
    if (req.file) {
      // Delete old file
      if (menu.menuFile) {
        const oldFilePath = path.join(__dirname, "..", menu.menuFile);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      
      // Set new file path
      menu.menuFile = `uploads/menus/${req.file.filename}`;
    }

    const updatedMenu = await menu.save();
    res.status(200).json(updatedMenu);
  } catch (error) {
    console.error("Error updating food menu:", error.message, error.stack);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Delete food menu by ID (admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Only admins can delete food menus." });
    }

    const { id } = req.params;

    const menu = await FoodMenu.findById(id);
    if (!menu) {
      return res.status(404).json({ message: "Food menu not found" });
    }

    // Delete file from storage
    if (menu.menuFile) {
      const filePath = path.join(__dirname, "..", menu.menuFile);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await FoodMenu.findByIdAndDelete(id);
    res.status(200).json({ message: "Food menu deleted successfully" });
  } catch (error) {
    console.error("Error deleting food menu:", error.message, error.stack);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Get food menu by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await FoodMenu.findById(id);
    
    if (!menu) {
      return res.status(404).json({ message: "Food menu not found" });
    }

    res.status(200).json(menu);
  } catch (error) {
    console.error("Error fetching food menu:", error.message, error.stack);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
