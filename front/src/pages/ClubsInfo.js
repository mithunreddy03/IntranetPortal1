import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ClubsInfo.css";

const ClubsInfo = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/clubs");
        setClubs(response.data);
      } catch (err) {
        setError("Failed to fetch clubs data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  return (
    <div className="clubs-info-container">
      <h1>Clubs Information</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <div className="clubs-list">
          {clubs.map((club) => (
            <div key={club._id} className="club-card">
              <h2>{club.name}</h2>
              <p>{club.description}</p>
              <p><strong>Category:</strong> {club.category || "N/A"}</p>
              <p><strong>Date:</strong> {new Date(club.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClubsInfo;