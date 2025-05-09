import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import axios from "axios";
import "./style.css";
import "./AdminClubs.css";

const AdminClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch clubs data when component mounts
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        
        if (!token || role !== "admin") {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/clubs");
        setClubs(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching clubs:", err);
        setError("Failed to load clubs. Please try again later.");
        setLoading(false);
      }
    };

    fetchClubs();
  }, [navigate]);

  const handleCreateClub = () => {
    navigate("/admin-clubs/new");
  };

  const handleViewClubDetails = (clubId) => {
    navigate(`/clubs/${clubId}`);
  };

  return (
    <div className="admin-clubs-container">
      <div className="header-nav">
        <button 
          onClick={() => navigate("/admin-dashboard")} 
          className="back-button"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h3 className="user-role">Logged in as Admin</h3>
      </div>
      
      <h1 className="page-title">Club Management</h1>

      <div className="content-container">
        {/* Create New Club button positioned at top-right */}
        <div className="action-buttons">
          <button
            className="create-club-button"
            onClick={handleCreateClub}
          >
            <FaPlus /> Create New Club
          </button>
        </div>

        {/* Club grid display */}
        {loading ? (
          <div className="loading-indicator">Loading clubs...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : clubs.length === 0 ? (
          <div className="no-clubs-message">
            No clubs found. Click the "Create New Club" button to add one.
          </div>
        ) : (
          <div className="clubs-grid">
            {clubs.map((club) => (              <div key={club._id} className="club-card">
                <div className="club-image-container">
                  <img 
                    src={club.image 
                      ? `http://localhost:5000/${club.image}` 
                      : "/yoga.jpg"} // Default fallback image
                    alt={club.name}
                    className="club-image"
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = "/yoga.jpg"; // Fallback image on error
                    }}
                  />
                </div>
                <div className="club-content">
                  <h2 className="club-name">{club.name}</h2>
                  <button 
                    className="view-details-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click event
                      handleViewClubDetails(club._id);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminClubs;