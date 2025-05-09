import React, { useState } from "react";
import axios from "axios";
import "./NewClubForm.css"; // Reuse the same CSS for styling

const NewUserForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
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

  // Basic password validation
  const validatePassword = (password) => {
    return password.length >= 6; // Minimum 6 characters
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.role) {
      setError("All fields are required");
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (!validatePassword(formData.password)) {
      setError("Password must be at least 6 characters long");
      return;
    }
      setLoading(true);
    try {
      // Log the data being sent to confirm values
      console.log("Creating user with data:", {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        category: formData.role,
      });
      
      await axios.post("http://localhost:5000/api/users/register", {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        category: formData.role,
      });
      
      setMessage("User created successfully!");
      setFormData({ fullName: "", email: "", password: "", role: "" });
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Error creating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-club-form-container">
      <div className="form-header">
        <h2 className="form-title">Create New User</h2>
      </div>
      
      {message && (
        <div className="message success">
          {message}
        </div>
      )}
      
      {error && (
        <div className="message error">
          {error}
        </div>      )}
      
      <form className="new-club-form" onSubmit={handleSubmit}>
        <label className="form-label">Full Name:</label>
        <input
          type="text"
          className="form-input"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter full name"
          disabled={loading}
          required
        />
        
        <label className="form-label">Email Address:</label>
        <input
          type="email"
          className="form-input"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email address"
          disabled={loading}
          required
        />

        <label className="form-label">Password:</label>
        <input
          type="password"
          className="form-input"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password (min. 6 characters)"
          disabled={loading}
          required
        />

        <label className="form-label">Role:</label>
        <select
          className="form-select"
          name="role"
          value={formData.role}
          onChange={handleChange}
          disabled={loading}
          required
        >
          <option value="">Select role</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>

        <button 
          type="submit" 
          className="form-button"
          disabled={loading}
        >
          {loading ? "Creating..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default NewUserForm;