import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";

const StudentClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [clubEvents, setClubEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/clubs");
        setClubs(response.data);
        
        // For each club, fetch its events
        const eventsPromises = response.data.map(club => 
          axios.get(`http://localhost:5000/api/events?clubId=${club._id}`)
        );
        
        const eventsResults = await Promise.all(eventsPromises);
        
        // Create an object mapping club IDs to their events
        const clubEventsMap = {};
        response.data.forEach((club, index) => {
          clubEventsMap[club._id] = eventsResults[index].data;
        });
        
        setClubEvents(clubEventsMap);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching clubs and events:", err);
        setError("Failed to fetch clubs. Please try again later.");
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const handleClubClick = (clubId) => {
    navigate(`/clubs/${clubId}`);
  };

  return (
    <div className="student-clubs-container" style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Student Clubs</h1>
      
      {loading ? (
        <div style={{ textAlign: "center" }}>Loading clubs and events...</div>
      ) : error ? (
        <div style={{ textAlign: "center", color: "red" }}>{error}</div>
      ) : (
        <div className="clubs-grid" style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
          {clubs.map((club) => (
            <div 
              key={club._id} 
              className="club-card" 
              style={{ 
                width: "300px", 
                textAlign: "center", 
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                borderRadius: "8px",
                overflow: "hidden",
                cursor: "pointer"
              }}
              onClick={() => handleClubClick(club._id)}
            >
              <img
                src={club.image ? `http://localhost:5000/${club.image}` : "/yoga.jpg"}
                alt={club.name}
                style={{ width: "100%", height: "150px", objectFit: "cover" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/yoga.jpg";
                }}
              />
              <h3 style={{ marginTop: "10px" }}>{club.name}</h3>
              
              {/* Display upcoming events for this club */}
              <div style={{ padding: "0 10px 10px" }}>
                <h4 style={{ marginBottom: "5px" }}>Upcoming Events</h4>
                {clubEvents[club._id] && clubEvents[club._id].length > 0 ? (
                  <ul style={{ listStyleType: "none", padding: 0, textAlign: "left" }}>
                    {clubEvents[club._id].slice(0, 2).map(event => (
                      <li key={event._id} style={{ margin: "5px 0", fontSize: "0.9rem" }}>
                        <strong>{event.eventName}</strong> - {new Date(event.eventDate).toLocaleDateString()}
                      </li>
                    ))}
                    {clubEvents[club._id].length > 2 && (
                      <li style={{ fontStyle: "italic", fontSize: "0.8rem" }}>
                        + {clubEvents[club._id].length - 2} more events
                      </li>
                    )}
                  </ul>
                ) : (
                  <p style={{ fontStyle: "italic", color: "#777" }}>No upcoming events</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentClubs;