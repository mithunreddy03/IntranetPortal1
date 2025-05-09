import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaFilePdf, FaSpinner } from "react-icons/fa";
import "./FoodMenu.css";

const FoodMenu = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("create"); // "create" or "edit"
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    menuFile: null
  });
  const [currentMenuId, setCurrentMenuId] = useState(null);
  
  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState(null);
  
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const isAdmin = userRole === "admin";

  // Fetch menus when component mounts
  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/food-menus");
      setMenus(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching food menus:", err);
      setError("Failed to load food menus. Please try again later.");
      setLoading(false);
    }
  };

  const handleBackNavigation = () => {
    const role = localStorage.getItem("role");
    if (role) {
      navigate(`/${role}-dashboard`);
    } else {
      navigate("/login");
    }
  };

  const handleCreateMenu = () => {
    setFormMode("create");
    setFormData({
      startDate: "",
      endDate: "",
      menuFile: null
    });
    setShowForm(true);
  };

  const handleEditMenu = (menu) => {
    setFormMode("edit");
    setFormData({
      startDate: new Date(menu.startDate).toISOString().split('T')[0],
      endDate: new Date(menu.endDate).toISOString().split('T')[0],
      menuFile: null // Can't populate the file input with existing file
    });
    setCurrentMenuId(menu._id);
    setShowForm(true);
  };

  const handleDeleteClick = (menu) => {
    setMenuToDelete(menu);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/food-menus/${menuToDelete._id}`, {
        headers: {
          Authorization: token
        }
      });

      setMenus(menus.filter(m => m._id !== menuToDelete._id));
      setShowDeleteConfirm(false);
      setMenuToDelete(null);
      setSuccessMessage("Food menu deleted successfully");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error deleting food menu:", err);
      setError(err.response?.data?.message || "Error deleting food menu");
    }
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      menuFile: e.target.files[0]
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.startDate || !formData.endDate) {
      setError("Please provide both start and end dates");
      return;
    }
    
    if (formMode === "create" && !formData.menuFile) {
      setError("Please select a menu PDF file");
      return;
    }
    
    const formDataToSend = new FormData();
    formDataToSend.append("startDate", formData.startDate);
    formDataToSend.append("endDate", formData.endDate);
    
    if (formData.menuFile) {
      formDataToSend.append("menuFile", formData.menuFile);
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      let response;
      if (formMode === "create") {
        response = await axios.post(
          "http://localhost:5000/api/food-menus",
          formDataToSend,
          {
            headers: {
              Authorization: token,
              "Content-Type": "multipart/form-data"
            }
          }
        );
        
        setMenus([...menus, response.data]);
        setSuccessMessage("Food menu created successfully");
      } else {
        response = await axios.put(
          `http://localhost:5000/api/food-menus/${currentMenuId}`,
          formDataToSend,
          {
            headers: {
              Authorization: token,
              "Content-Type": "multipart/form-data"
            }
          }
        );
        
        setMenus(menus.map(m => m._id === currentMenuId ? response.data : m));
        setSuccessMessage("Food menu updated successfully");
      }
      
      // Clear form and hide it
      setShowForm(false);
      setFormData({
        startDate: "",
        endDate: "",
        menuFile: null
      });
      setCurrentMenuId(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error saving food menu:", err);
      setError(err.response?.data?.message || "Error saving food menu");
    } finally {
      setLoading(false);
    }
  };

  const handleViewMenu = (menuFile) => {
    window.open(`http://localhost:5000/${menuFile}`, "_blank");
  };

  // Format date for display
  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    const end = new Date(endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${start} - ${end}`;
  };

  return (
    <div className="food-menu-container">
      <div className="food-menu-header">
        <button className="back-button" onClick={handleBackNavigation}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1>Food Menu</h1>
        
        {isAdmin && (
          <button 
            className="create-menu-btn" 
            onClick={handleCreateMenu}
          >
            <FaPlus /> Add Menu
          </button>
        )}
      </div>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Menu list */}
      {loading && !menus.length ? (
        <div className="loading-spinner">
          <FaSpinner className="fa-spin" /> Loading food menus...
        </div>
      ) : menus.length === 0 ? (
        <div className="empty-state">
          <p>No food menus available at this time.</p>
          {isAdmin && (
            <button className="create-empty-btn" onClick={handleCreateMenu}>
              <FaPlus /> Add First Menu
            </button>
          )}
        </div>
      ) : (
        <div className="menu-list">
          {menus.map((menu) => (
            <div key={menu._id} className="menu-card">
              <div className="menu-header">
                <h3 className="menu-dates">Week of {formatDateRange(menu.startDate, menu.endDate)}</h3>
                {isAdmin && (
                  <div className="menu-actions">
                    <button 
                      className="edit-btn" 
                      onClick={() => handleEditMenu(menu)}
                      title="Edit Menu"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDeleteClick(menu)}
                      title="Delete Menu"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
              <div className="menu-content">
                <button 
                  className="view-menu-btn"
                  onClick={() => handleViewMenu(menu.menuFile)}
                >
                  <FaFilePdf /> See Menu
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Menu Form */}
      {showForm && (
        <div className="form-overlay">
          <div className="menu-form">
            <div className="form-header">
              <h2>{formMode === "create" ? "Add New Menu" : "Edit Menu"}</h2>
              <button 
                className="close-form-btn"
                onClick={() => setShowForm(false)}
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="startDate">Start Date:</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="endDate">End Date:</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="menuFile">Menu PDF:</label>
                <input
                  type="file"
                  id="menuFile"
                  name="menuFile"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required={formMode === "create"}
                />
                {formMode === "edit" && (
                  <p className="file-note">
                    * Leave empty to keep the current PDF file
                  </p>
                )}
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? "Saving..." : (formMode === "create" ? "Add Menu" : "Update Menu")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="form-overlay">
          <div className="confirmation-modal">
            <h3>Delete Food Menu</h3>
            <p>Are you sure you want to delete this food menu?</p>
            <div className="confirmation-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="delete-confirm-btn"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodMenu;
