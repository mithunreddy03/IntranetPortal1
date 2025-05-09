import React, { useState } from "react";
import axios from "axios"; // Import axios for API requests
import "./NewClubForm.css";

const NewCourseForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    credits: "",
    semester: "",
    batch: "",
    branch: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        credits: Number(formData.credits), // Convert credits to number
      };
  
      const response = await axios.post("http://localhost:5000/api/courses", dataToSend);
      alert("Course created successfully!");
      setFormData({ name: "", credits: "", semester: "", batch: "", branch: "" });
    } catch (error) {
      console.error("Error creating course:", error.response?.data || error);
      alert(error.response?.data?.message || "Error creating course");
    }
  };
  

  return (
    <div className="new-club-form-container">
      <h2 className="form-title">Add New Course</h2>
      <form className="new-club-form" onSubmit={handleSubmit}>
        <label className="form-label">Course Name:</label>
        <input
          type="text"
          className="form-input"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label className="form-label">Credits:</label>
        <input
          type="number"
          className="form-input"
          name="credits"
          value={formData.credits}
          onChange={handleChange}
          required
        />

        <label className="form-label">Semester:</label>
        <input
          type="text"
          className="form-input"
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          required
        />

        <label className="form-label">Batch:</label>
        <input
          type="text"
          className="form-input"
          name="batch"
          value={formData.batch}
          onChange={handleChange}
          required
        />

        <label className="form-label">Branch:</label>
        <input
          type="text"
          className="form-input"
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          required
        />

        <button type="submit" className="form-button">
          Add Course
        </button>
      </form>
    </div>
  );
};

export default NewCourseForm;