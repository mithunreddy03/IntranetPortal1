import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaBell, FaSearch, FaUser, FaPlus } from "react-icons/fa";
import axios from "axios";
import "./Clubs.css";

const Clubs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const isAdmin = userRole === "admin";

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/clubs");
      setClubs(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching clubs:", err);
      setError("Failed to fetch clubs. Please try again later.");
      setLoading(false);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleNavigation = (link) => {
    try {
      navigate(link);
      setSidebarOpen(false); // Close sidebar after navigation
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <div className="clubs-page-container" style={{ display: "flex" }}>
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="nav-container">
          <div className="nav-header">
            <img
              src="/more.png"
              alt="Close Sidebar"
              onClick={toggleSidebar}
              style={{ cursor: "pointer" }}
            />
            <img
              src="/mahindra-university-logo.png"
              alt="Mahindra University Logo"
            />
          </div>
          <button className="nav-item" onClick={() => handleNavigation(`/${userRole}-dashboard`)}>
            <FaHome className="icon" />
            <span>Home</span>
          </button>
          <button className="nav-item" onClick={() => handleNavigation("/announcements")}>
            <FaBell className="icon" />
            <span>Announcements</span>
          </button>
          <button className="nav-item" onClick={() => handleNavigation("/search")}>
            <FaSearch className="icon" />
            <span>Search</span>
          </button>
          <button className="nav-item" onClick={() => handleNavigation("/profile")}>
            <FaUser className="icon" />
            <span>Profile</span>
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="clubs-container">
        {!sidebarOpen && (
          <div className="top-bar">
            <img
              src="/more.png"
              alt="Open Sidebar"
              className="menu-icon"
              onClick={toggleSidebar}
            />
          </div>
        )}

        <div className="header-section">
          <h2>Clubs</h2>
          <p>{userRole === "admin" ? "Admin View" : "Student View"}</p>
        </div>

        {/* Admin-only Create Club button */}
        {isAdmin && (
          <div className="admin-actions">
            <button 
              className="create-club-button"
              onClick={() => navigate("/admin-clubs/new")}
            >
              <FaPlus /> Create New Club
            </button>
          </div>
        )}

        <h3 className="clubs-title">Explore Our Clubs</h3>

        {loading ? (
          <div className="loading-indicator">Loading clubs...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="clubs-grid">
            {clubs.map((club) => (              <div
                className="club-card"
                key={club._id}
              >
                <img 
                  src={club.image && club.image !== 'default-club.jpg' 
                    ? `http://localhost:5000/${club.image}` 
                    : "/yoga.jpg"} // Fallback image
                  alt={club.name} 
                  className="club-image" 
                />
                <div className="club-info">
                  <div>
                    <span className="club-name">{club.name}</span>
                    <span className="club-category">{club.category}</span>
                  </div>
                  <button 
                    className="view-details-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click event
                      handleNavigation(`/clubs/${club._id}`);
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

export default Clubs;
