import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaBullhorn,
  FaPlus,
  FaEdit,
  FaTrash,
  FaExclamationCircle,
  FaSpinner,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaArrowLeft
} from "react-icons/fa";
import "./Announcements.css";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("create"); // "create" or "edit"
  const [currentAnnouncement, setCurrentAnnouncement] = useState({
    title: "",
    content: "",
    important: false
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const isAdmin = userRole === "admin";

  // Fetch announcements when component mounts
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/announcements", {
        headers: {
          Authorization: token
        }
      });

      setAnnouncements(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError("Failed to load announcements. Please try again later.");
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = () => {
    setFormMode("create");
    setCurrentAnnouncement({
      title: "",
      content: "",
      important: false
    });
    setShowForm(true);
  };

  const handleEditAnnouncement = (announcement) => {
    setFormMode("edit");
    setCurrentAnnouncement({
      id: announcement._id,
      title: announcement.title,
      content: announcement.content,
      important: announcement.important || false
    });
    setShowForm(true);
  };

  const handleDeleteClick = (announcement) => {
    setAnnouncementToDelete(announcement);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/announcements/${announcementToDelete._id}`, {
        headers: {
          Authorization: token
        }
      });

      setAnnouncements(announcements.filter(a => a._id !== announcementToDelete._id));
      setShowDeleteConfirm(false);
      setAnnouncementToDelete(null);
      setSuccessMessage("Announcement deleted successfully");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error("Error deleting announcement:", err);
      setError("Failed to delete announcement. Please try again.");
      setShowDeleteConfirm(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      let response;
      
      if (formMode === "create") {
        response = await axios.post(
          "http://localhost:5000/api/announcements",
          currentAnnouncement,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json"
            }
          }
        );
        
        setAnnouncements([response.data.announcement, ...announcements]);
        setSuccessMessage("Announcement created successfully");
      } else {
        // Edit mode
        response = await axios.put(
          `http://localhost:5000/api/announcements/${currentAnnouncement.id}`,
          {
            title: currentAnnouncement.title,
            content: currentAnnouncement.content,
            important: currentAnnouncement.important
          },
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json"
            }
          }
        );
        
        setAnnouncements(
          announcements.map(a => 
            a._id === currentAnnouncement.id ? response.data.announcement : a
          )
        );
        setSuccessMessage("Announcement updated successfully");
      }
      
      // Clear form and hide it
      setShowForm(false);
      setCurrentAnnouncement({
        title: "",
        content: "",
        important: false
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error("Error saving announcement:", err);
      setError(err.response?.data?.message || "An error occurred while saving the announcement");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setCurrentAnnouncement({
      ...currentAnnouncement,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  const handleBackNavigation = () => {
    const role = localStorage.getItem("role");
    if (role) {
      navigate(`/${role}-dashboard`);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="announcements-container">
      <button className="back-button" onClick={handleBackNavigation}>
        <FaArrowLeft /> Back to Dashboard
      </button>

      <div className="announcements-header">
        <h1 className="announcements-title">
          <FaBullhorn className="announcements-icon" /> Announcements
        </h1>
        {isAdmin && (
          <div className="announcements-actions">
            <button 
              className="create-announcement-btn" 
              onClick={handleCreateAnnouncement}
            >
              <FaPlus className="create-announcement-btn-icon" /> Create Announcement
            </button>
          </div>
        )}
      </div>

      {successMessage && (
        <div className="alert alert-success">
          <FaCheck className="alert-icon" /> {successMessage}
        </div>
      )}

      {error && (
        <div className="error-message">
          <FaExclamationCircle className="error-icon" /> {error}
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">
          <FaSpinner className="fa-spin" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="announcement-empty">
          <FaBullhorn className="announcement-empty-icon" />
          <p>No announcements available at this time.</p>
        </div>
      ) : (
        <div className="announcements-list">
          {announcements.map((announcement) => (
            <div key={announcement._id} className="announcement-card">
              <div className="announcement-header">
                <h2 className="announcement-title">
                  {announcement.title}
                  {announcement.important && (
                    <span className="important-badge">
                      <FaExclamationCircle className="important-badge-icon" /> Important
                    </span>
                  )}
                </h2>
                {isAdmin && (
                  <div className="announcement-actions">
                    <button 
                      className="edit-btn" 
                      onClick={() => handleEditAnnouncement(announcement)}
                      title="Edit Announcement"
                    >
                      <FaEdit className="edit-icon" />
                    </button>
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDeleteClick(announcement)}
                      title="Delete Announcement"
                    >
                      <FaTrash className="delete-icon" />
                    </button>
                  </div>
                )}
              </div>
              <div className="announcement-meta">
                <span className="announcement-creator">Posted by {announcement.creatorName}</span>
                <span className="announcement-date">{formatDate(announcement.createdAt)}</span>
              </div>
              <div className="announcement-content">{announcement.content}</div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Announcement Form */}
      {showForm && (
        <div className="form-overlay">
          <div className="announcement-form">
            <div className="form-header">
              <h2 className="form-title">
                {formMode === "create" ? "Create New Announcement" : "Edit Announcement"}
              </h2>
              <button 
                className="close-form-btn" 
                onClick={() => setShowForm(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-control"
                  value={currentAnnouncement.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="content" className="form-label">Content</label>
                <textarea
                  id="content"
                  name="content"
                  className="form-control"
                  value={currentAnnouncement.content}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <div className="form-checkbox">
                <input
                  type="checkbox"
                  id="important"
                  name="important"
                  className="checkbox-input"
                  checked={currentAnnouncement.important}
                  onChange={handleInputChange}
                />
                <label htmlFor="important">Mark as Important</label>
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
                >
                  {formMode === "create" ? "Create" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="form-overlay">
          <div className="confirm-dialog">
            <h3 className="confirm-title">
              <FaExclamationTriangle className="confirm-icon" /> Delete Announcement
            </h3>
            <p className="confirm-message">
              Are you sure you want to delete this announcement? This action cannot be undone.
            </p>
            <div className="confirm-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="submit-btn"
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

export default Announcements;
