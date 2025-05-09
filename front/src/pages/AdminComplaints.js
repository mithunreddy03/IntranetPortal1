import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import "./complaintFeedback.css";
import "./AdminComplaints.css";

const AdminComplaints = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Verify admin authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!token || role !== "admin") {
      navigate("/login");
    }
  }, [navigate]);
  
  // Fetch complaints when a category is selected
  useEffect(() => {
    if (selectedCategory) {
      fetchComplaintsByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchComplaintsByCategory = async (category) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      console.log(`Fetching ${category} complaints with token: ${token.substring(0, 15)}...`);

      const response = await axios.get(
        `http://localhost:5000/api/complaints/category/${category}`,
        {
          headers: {
            'Authorization': token
          }
        }
      );

      console.log(`Received ${response.data.length} complaints for ${category}:`, response.data);
      setComplaints(response.data);
      
    } catch (error) {
      console.error(`Error fetching ${category} complaints:`, error);
      
      // Enhanced error reporting
      let errorMsg = `Failed to load ${category} complaints. Please try again later.`;
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        errorMsg = error.response.data.message || errorMsg;
        
        // If it's a token issue, redirect to login
        if (error.response.status === 401) {
          alert("Your session has expired. Please log in again.");
          navigate('/login');
          return;
        }
      }
      
      setError(errorMsg);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      console.log(`Updating complaint ${id} status to ${newStatus}`);
      
      await axios.patch(
        `http://localhost:5000/api/complaints/${id}/status`,
        { status: newStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        }
      );

      console.log("Status update successful");
      
      // Update status locally without fetching again
      setComplaints(complaints.map(complaint => 
        complaint._id === id ? { ...complaint, status: newStatus } : complaint
      ));
      
    } catch (error) {
      console.error("Error updating complaint status:", error);
      
      let errorMsg = "Failed to update status. Please try again.";
      if (error.response && error.response.data) {
        errorMsg = error.response.data.message || errorMsg;
      }
      
      alert(errorMsg);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to refresh data
  const refreshData = () => {
    if (selectedCategory) {
      fetchComplaintsByCategory(selectedCategory);
    }
  };

  return (
    <div className="admin-complaints-container">
      <div className="admin-complaints-header">
        <button 
          className="back-button"
          onClick={() => navigate("/admin-dashboard")}
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1>Complaint Management</h1>
      </div>

      <div className="category-selection">
        <h2>Select Category</h2>
        <div className="category-buttons">
          <button 
            className={`category-button hostel ${selectedCategory === 'Hostel' ? 'active' : ''}`}
            onClick={() => handleCategorySelect('Hostel')}
          >
            Hostel
          </button>
          <button 
            className={`category-button management ${selectedCategory === 'Management' ? 'active' : ''}`}
            onClick={() => handleCategorySelect('Management')}
          >
            Management
          </button>
          <button 
            className={`category-button food ${selectedCategory === 'Food' ? 'active' : ''}`}
            onClick={() => handleCategorySelect('Food')}
          >
            Food
          </button>
        </div>
      </div>

      {selectedCategory ? (
        <div className="complaints-section">
          <div className="complaints-header">
            <h2>{selectedCategory} Complaints</h2>
            <button 
              className="refresh-button" 
              onClick={refreshData}
              disabled={loading}
            >
              Refresh
            </button>
          </div>
          
          {loading ? (
            <div className="loading-spinner">
              <FaSpinner className="spinner" />
              <p>Loading complaints...</p>
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : complaints.length === 0 ? (
            <div className="no-complaints-message">
              <p>No complaints found in this category.</p>
            </div>
          ) : (
            <div className="complaints-table-container">
              <table className="complaints-table">
                <thead>
                  <tr>
                    <th>Complaint #</th>
                    <th>Student Name</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint._id} className={`status-${complaint.status.toLowerCase().replace(' ', '-')}`}>
                      <td>{complaint.complaintNumber}</td>
                      <td>{complaint.studentName}</td>
                      <td className="complaint-description">{complaint.description}</td>
                      <td>{formatDate(complaint.createdAt)}</td>
                      <td className="status-cell">
                        <span className={`status-badge ${complaint.status.toLowerCase().replace(' ', '-')}`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <select 
                          value={complaint.status}
                          onChange={(e) => handleStatusUpdate(complaint._id, e.target.value)}
                          className="status-select"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="no-category-selected">
          <p>Please select a category to view complaints.</p>
        </div>
      )}
    </div>
  );
};

export default AdminComplaints;