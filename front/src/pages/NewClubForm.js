import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import "./NewClubForm.css";

const NewClubForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
    founderName: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please select an image file (JPEG, PNG, etc.)");
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size should be less than 2MB");
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(""); // Clear any existing errors
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.description || !formData.category) {
      setError("Name, description, and category are required fields.");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      setMessage("");
      
      // Create FormData object for submitting multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("founderName", formData.founderName);
      
      // Only append image if one was selected
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }
      
      // Send the request with proper headers for multipart/form-data
      const response = await axios.post(
        "http://localhost:5000/api/clubs", 
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setMessage("Club created successfully!");
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "",
        date: new Date().toISOString().split('T')[0],
        founderName: "",
      });
      setImageFile(null);
      setImagePreview(null);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate("/admin-clubs");
      }, 1500);
    } catch (error) {
      console.error("Error creating club:", error);
      setError(error.response?.data?.message || "Error creating club. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-club-form-container">
      <div className="form-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <h2 className="form-title">Create a New Club</h2>
      </div>

      {error && (
        <div className="message error">
          {error}
        </div>
      )}
      
      {message && (
        <div className="message success">
          {message}
        </div>
      )}

      <form className="new-club-form" onSubmit={handleSubmit}>
        <label className="form-label">Club Name:</label>
        <input
          type="text"
          className="form-input"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter club name"
          disabled={loading}
          required
        />

        <label className="form-label">Description:</label>
        <textarea
          className="form-textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter club description"
          disabled={loading}
          required
        ></textarea>

        <label className="form-label">Category:</label>
        <select
          className="form-select"
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled={loading}
          required
        >
          <option value="">Select category</option>
          <option value="Sports">Sports</option>
          <option value="Arts">Arts</option>
          <option value="Technology">Technology</option>
          <option value="Academic">Academic</option>
          <option value="Social">Social</option>
          <option value="Other">Other</option>
        </select>

        <label className="form-label">Founding Date:</label>
        <input
          type="date"
          className="form-input"
          name="date"
          value={formData.date}
          onChange={handleChange}
          disabled={loading}
          required
        />

        <label className="form-label">Founder Name:</label>
        <input
          type="text"
          className="form-input"
          name="founderName"
          value={formData.founderName}
          onChange={handleChange}
          placeholder="Enter founder name"
          disabled={loading}
        />
        
        <label className="form-label">Club Image: <span className="optional-text">(Max 2MB, JPEG/PNG)</span></label>
        <input
          type="file"
          accept="image/*"
          className="form-input"
          onChange={handleImageChange}
          disabled={loading}
        />

        {imagePreview && (
          <div className="image-preview-container">
            <img src={imagePreview} alt="Preview" className="image-preview" />
          </div>
        )}

        <button 
          type="submit" 
          className="form-button"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Club"}
        </button>
      </form>
    </div>
  );
};

export default NewClubForm;
