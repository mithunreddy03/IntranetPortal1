import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./complaintFeedback.css";

const Complaint = () => {
  const [category, setCategory] = useState("Management");
  const [complaint, setComplaint] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!complaint.trim()) {
      setMessage({ type: "error", text: "Please enter your complaint details" });
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage(null);
      
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      console.log("Submitting complaint with token:", token.substring(0, 15) + "...");
      
      const response = await axios.post(
        "http://localhost:5000/api/complaints",
        { 
          category, 
          description: complaint 
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        }
      );

      console.log("Complaint submission successful:", response.data);
      
      setMessage({
        type: "success",
        text: `Complaint submitted successfully! Your complaint number is: ${response.data.complaintNumber}`
      });
      
      // Reset form
      setComplaint("");
      
    } catch (error) {
      console.error("Error submitting complaint:", error);
      
      // Enhanced error reporting
      let errorMsg = "Error submitting complaint. Please try again.";
      
      if (error.response) {
        console.error("Error response:", error.response.data);
        errorMsg = error.response.data.message || errorMsg;
        
        // If it's a token issue, redirect to login
        if (error.response.status === 401) {
          alert("Your session has expired. Please log in again.");
          navigate('/login');
          return;
        }
      }
      
      setMessage({
        type: "error",
        text: errorMsg
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="complaint-feedback-container">
      <h2>Submit a Complaint</h2>
      
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <label htmlFor="category">Category:</label>
        <select 
          id="category"
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          disabled={isSubmitting}
        >
          <option value="Management">Management</option>
          <option value="Hostel">Hostel</option>
          <option value="Food">Food</option>
        </select>
        
        <label htmlFor="complaint">Complaint Details:</label>
        <textarea
          id="complaint"
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          placeholder="Please provide details of your complaint..."
          rows="6"
          disabled={isSubmitting}
          required
        />
        
        <button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
};

export default Complaint;