import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./NewClubForm.css"; // Reuse the same CSS

const AddCourseForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    courseId: "",
    courseName: "",
    courseCode: "",
    instructor: "",
    credits: "",
    description: "",
    branch: "",
    batch: "",
    semester: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (!formData.courseId) return "Course ID is required";
    if (!formData.courseName) return "Course Name is required";
    if (!formData.courseCode) return "Course Code is required";
    if (!formData.instructor) return "Instructor name is required";
    if (!formData.credits) return "Credits are required";
    if (!formData.branch) return "Branch is required";
    if (!formData.batch) return "Batch is required";
    if (!formData.semester) return "Semester is required";
    
    // Validate that credits and semester are numbers
    if (isNaN(Number(formData.credits))) return "Credits must be a number";
    if (isNaN(Number(formData.semester))) return "Semester must be a number";
    
    return null; // No validation error
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Form validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      // Format the data - ensure numeric fields are numbers
      const dataToSend = {
        ...formData,
        credits: Number(formData.credits),
        semester: Number(formData.semester)
      };

      const response = await axios.post("http://localhost:5000/api/courses", dataToSend);
      setMessage("Course created successfully!");
      setFormData({
        courseId: "",
        courseName: "",
        courseCode: "",
        instructor: "",
        credits: "",
        description: "",
        branch: "",
        batch: "",
        semester: ""
      });
      
      // Redirect after a delay
      setTimeout(() => {
        navigate("/admin-courses/view");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Error creating course");
      console.error("Error creating course:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-club-form-container">
      <div className="form-header">
        <button className="back-button" onClick={() => navigate("/admin-courses")}>
          <FaArrowLeft /> Back to Course Management
        </button>
        <h2 className="form-title">Add New Course</h2>
      </div>
      
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      
      <form className="new-club-form" onSubmit={handleSubmit}>
        <label className="form-label">Course ID:</label>
        <input
          type="text"
          className="form-input"
          name="courseId"
          value={formData.courseId}
          onChange={handleChange}
          placeholder="Enter unique course ID (e.g., CSE2023001)"
          disabled={loading}
          required
        />

        <label className="form-label">Course Name:</label>
        <input
          type="text"
          className="form-input"
          name="courseName"
          value={formData.courseName}
          onChange={handleChange}
          placeholder="Enter full course name"
          disabled={loading}
          required
        />

        <label className="form-label">Course Code:</label>
        <input
          type="text"
          className="form-input"
          name="courseCode"
          value={formData.courseCode}
          onChange={handleChange}
          placeholder="Enter course code (e.g., CS101)"
          disabled={loading}
          required
        />

        <label className="form-label">Instructor:</label>
        <input
          type="text"
          className="form-input"
          name="instructor"
          value={formData.instructor}
          onChange={handleChange}
          placeholder="Enter instructor's full name"
          disabled={loading}
          required
        />

        <label className="form-label">Credits:</label>
        <input
          type="number"
          className="form-input"
          name="credits"
          value={formData.credits}
          onChange={handleChange}
          placeholder="Enter credits (e.g., 3)"
          min="1"
          disabled={loading}
          required
        />

        <label className="form-label">Branch:</label>
        <select
          className="form-select"
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          disabled={loading}
          required
        >
          <option value="">Select branch</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Artificial Intelligence">Artificial Intelligence</option>
          <option value="Electronics">Electronics</option>
          <option value="Mechanical">Mechanical</option>
          <option value="Civil">Civil</option>
          <option value="Electrical">Electrical</option>
        </select>

        <label className="form-label">Batch:</label>
        <input
          type="text"
          className="form-input"
          name="batch"
          value={formData.batch}
          onChange={handleChange}
          placeholder="Enter batch (e.g., 2022-2026)"
          disabled={loading}
          required
        />

        <label className="form-label">Semester:</label>
        <select
          className="form-select"
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          disabled={loading}
          required
        >
          <option value="">Select semester</option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
          <option value="3">Semester 3</option>
          <option value="4">Semester 4</option>
          <option value="5">Semester 5</option>
          <option value="6">Semester 6</option>
          <option value="7">Semester 7</option>
          <option value="8">Semester 8</option>
        </select>

        <label className="form-label">Description:</label>
        <textarea
          className="form-textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter course description"
          disabled={loading}
          rows="4"
        ></textarea>

        <button 
          type="submit" 
          className="form-button"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
};

export default AddCourseForm;