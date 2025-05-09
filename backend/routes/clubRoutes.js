const { name, category, description, founderName, creationDate } = req.body;

if (!name || !category || !description || !founderName || !creationDate) {
  return res.status(400).json({ message: "All fields are required." });
}

try {
  const newClub = new Club({
    name,
    category,
    description,
    founderName,
    creationDate,
  });
  await newClub.save();
  res.status(201).json({ message: "Club created successfully." });
} catch (error) {
  console.error("Error creating club:", error);
  res.status(500).json({ message: "Server error." });
}
