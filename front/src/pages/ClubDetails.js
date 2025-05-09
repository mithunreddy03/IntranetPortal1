import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaArrowLeft, FaCalendarPlus, FaCheck, FaTimes, FaPlus, FaSave } from "react-icons/fa";
import "./ClubDetails.css";

const ClubDetails = () => {
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditingClub, setIsEditingClub] = useState(false);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [editClubData, setEditClubData] = useState({});
  const [newEvent, setNewEvent] = useState({
    eventName: "",
    eventDate: new Date().toISOString().split('T')[0],
    eventDescription: "",
    venue: "",
    organizer: "",
    contactEmail: "",
  });

  const { clubId } = useParams();
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const isAdmin = userRole === "admin";
    useEffect(() => {
    fetchClubDetails();
    fetchClubEvents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubId]);

  const fetchClubDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/clubs/${clubId}`);
      setClub(response.data);
      setEditClubData({ ...response.data });
    } catch (err) {
      console.error("Error fetching club details:", err);
      setError("Failed to load club details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  const fetchClubEvents = async () => {
    try {
      // Fetch events for this club from the backend API
      const response = await axios.get(`http://localhost:5000/api/events?clubId=${clubId}`);
      setEvents(response.data);
    } catch (err) {
      console.error("Error fetching club events:", err);
      // Not setting error state to avoid blocking the entire page if events fail to load
      // Use empty array if fetch fails
      setEvents([]);
    }
  };

  const handleClubEditChange = (e) => {
    const { name, value } = e.target;
    setEditClubData({
      ...editClubData,
      [name]: value
    });
  };

  const handleClubImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEditClubData({
        ...editClubData,
        newImage: e.target.files[0],
        imagePreview: URL.createObjectURL(e.target.files[0])
      });
    }
  };

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value
    });
  };

  const handleSubmitClubEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create a FormData object for handling file uploads
      const formData = new FormData();
      
      // Append text fields
      Object.keys(editClubData).forEach(key => {
        if (key !== 'newImage' && key !== 'imagePreview' && key !== '_id' && key !== '__v') {
          formData.append(key, editClubData[key]);
        }
      });
      
      // Append image if a new one was selected
      if (editClubData.newImage) {
        formData.append('image', editClubData.newImage);
      }

      await axios.put(
        `http://localhost:5000/api/clubs/${clubId}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      // Update the local club state with edited data
      setClub({
        ...club,
        ...editClubData,
        image: editClubData.imagePreview ? editClubData.image : club.image
      });
      
      setIsEditingClub(false);
      setSuccessMessage("Club information updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      
      // Refresh club data
      fetchClubDetails();
    } catch (err) {
      console.error("Error updating club:", err);
      setError("Failed to update club information. Please try again.");
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setError("");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Send event data to the backend API
      const response = await axios.post("http://localhost:5000/api/events", {
        ...newEvent,
        clubId: clubId
      });

      // Add the new event from the server response to local state
      const newEventWithId = response.data.event;
      
      // Update the events array with the new event
      setEvents([...events, newEventWithId]);
      setShowAddEventForm(false);
      setSuccessMessage("Event added successfully!");
      
      // Reset form
      setNewEvent({
        eventName: "",
        eventDate: new Date().toISOString().split('T')[0],
        eventDescription: "",
        venue: "",
        organizer: "",
        contactEmail: ""
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error creating event:", err);
      setError("Failed to create event. Please try again.");
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setError("");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  const toggleEditClub = () => {
    setIsEditingClub(!isEditingClub);
    if (!isEditingClub) {
      // When entering edit mode, initialize form data with current club data
      setEditClubData({ ...club });
    }
  };

  const toggleAddEventForm = () => {
    setShowAddEventForm(!showAddEventForm);
  };

  const cancelEditClub = () => {
    setIsEditingClub(false);
    setEditClubData({ ...club });
  };

  if (loading && !club) {
    return (
      <div className="club-details-container">
        <div className="loading-indicator">Loading club details...</div>
      </div>
    );
  }

  if (error && !club) {
    return (
      <div className="club-details-container">
        <button className="back-button" onClick={handleBackClick}>
          <FaArrowLeft /> Back
        </button>
        <div className="error-message">{error || "Club not found"}</div>
      </div>
    );
  }

  return (
    <div className="club-details-container">
      {/* Header Section */}
      <div className="club-header">
        <button className="back-button" onClick={handleBackClick}>
          <FaArrowLeft /> Back
        </button>
        
        {!isEditingClub && <h1>{club.name}</h1>}
        
        {isAdmin && !isEditingClub && (
          <button 
            className="edit-button"
            onClick={toggleEditClub}
          >
            <FaEdit /> Edit Club
          </button>
        )}
      </div>

      {/* Display success/error messages */}
      {successMessage && (
        <div className="success-message">
          <FaCheck /> {successMessage}
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <FaTimes /> {error}
        </div>
      )}
      
      {/* Edit Club Form */}
      {isEditingClub ? (
        <form className="edit-club-form" onSubmit={handleSubmitClubEdit}>
          <h2>Edit Club Information</h2>
          
          <div className="form-group">
            <label htmlFor="clubName">Club Name</label>
            <input 
              type="text"
              id="clubName"
              name="name"
              value={editClubData.name || ''}
              onChange={handleClubEditChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={editClubData.category || ''}
              onChange={handleClubEditChange}
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
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea 
              id="description"
              name="description"
              value={editClubData.description || ''}
              onChange={handleClubEditChange}
              rows="6"
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="founderName">Founder Name</label>
            <input 
              type="text"
              id="founderName"
              name="founderName"
              value={editClubData.founderName || ''}
              onChange={handleClubEditChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="date">Founding Date</label>
            <input 
              type="date"
              id="date"
              name="date"
              value={editClubData.date ? new Date(editClubData.date).toISOString().split('T')[0] : ''}
              onChange={handleClubEditChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="clubImage">Club Image</label>
            <input 
              type="file"
              id="clubImage"
              accept="image/*"
              onChange={handleClubImageChange}
            />
            {(editClubData.imagePreview || (editClubData.image && !editClubData.imagePreview)) && (
              <div className="image-preview">
                <img 
                  src={editClubData.imagePreview || `http://localhost:5000/${editClubData.image}`} 
                  alt="Club preview" 
                />
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={cancelEditClub}>
              <FaTimes /> Cancel
            </button>
            <button type="submit" className="save-button" disabled={loading}>
              <FaSave /> {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <>
          {/* Club Details Display */}
          {club.image && club.image !== 'default-club.jpg' && (
            <div className="club-image-banner">
              <img 
                src={`http://localhost:5000/${club.image}`}
                alt={club.name}
                className="club-hero-image"
              />
            </div>
          )}
          
          <div className="club-content-card">
            <div className="club-meta">
              <span className="club-category">
                <strong>Category:</strong> {club.category || "General"}
              </span>
              {club.founderName && (
                <span className="club-founder">
                  <strong>Founded by:</strong> {club.founderName}
                </span>
              )}
              {club.date && (
                <span className="club-date">
                  <strong>Founded:</strong> {new Date(club.date).toLocaleDateString()}
                </span>
              )}
            </div>
            
            <div className="club-description-section">
              <h2>About this Club</h2>
              <p className="club-description">{club.description}</p>
            </div>
          </div>
        </>
      )}

      {/* Events Section */}
      <section className="club-events-section">
        <div className="section-header">
          <h2>Upcoming Events</h2>
          {isAdmin && !showAddEventForm && (
            <button className="add-event-button" onClick={toggleAddEventForm}>
              <FaCalendarPlus /> Add Event
            </button>
          )}
        </div>
        
        {/* Add Event Form */}
        {showAddEventForm && (
          <form className="add-event-form" onSubmit={handleSubmitEvent}>
            <h3>Create New Event</h3>
            
            <div className="form-group">
              <label htmlFor="eventName">Event Name</label>
              <input 
                type="text"
                id="eventName"
                name="eventName"
                value={newEvent.eventName}
                onChange={handleEventChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="eventDate">Event Date</label>
              <input 
                type="date"
                id="eventDate"
                name="eventDate"
                value={newEvent.eventDate}
                onChange={handleEventChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="venue">Venue</label>
              <input 
                type="text"
                id="venue"
                name="venue"
                value={newEvent.venue}
                onChange={handleEventChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="eventDescription">Event Description</label>
              <textarea 
                id="eventDescription"
                name="eventDescription"
                value={newEvent.eventDescription}
                onChange={handleEventChange}
                rows="4"
                required
              ></textarea>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="organizer">Organizer</label>
                <input 
                  type="text"
                  id="organizer"
                  name="organizer"
                  value={newEvent.organizer}
                  onChange={handleEventChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="contactEmail">Contact Email</label>
                <input 
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={newEvent.contactEmail}
                  onChange={handleEventChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={toggleAddEventForm}>
                <FaTimes /> Cancel
              </button>
              <button type="submit" className="save-button" disabled={loading}>
                <FaPlus /> {loading ? "Adding..." : "Add Event"}
              </button>
            </div>
          </form>
        )}
        
        {/* Events List */}        {events.length > 0 ? (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event._id || event.id} className="event-card">
                <div className="event-header">
                  <h3 className="event-name">{event.eventName}</h3>
                  <span className="event-date">
                    {new Date(event.eventDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="event-details">
                  <p className="event-description">{event.eventDescription}</p>
                  <div className="event-meta">
                    <span className="event-venue"><strong>Venue:</strong> {event.venue}</span>
                    <span className="event-organizer"><strong>By:</strong> {event.organizer}</span>
                    {event.contactEmail && (
                      <span className="event-contact">
                        <strong>Contact:</strong> {event.contactEmail}
                      </span>
                    )}
                  </div>
                  <button className="register-button">Register</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-events-message">
            <p>No upcoming events scheduled for this club.</p>
            {isAdmin && !showAddEventForm && (
              <button className="add-first-event-button" onClick={toggleAddEventForm}>
                <FaCalendarPlus /> Schedule First Event
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ClubDetails;