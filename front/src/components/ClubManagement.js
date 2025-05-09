import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ClubManagement.css';

const ClubManagement = () => {
  const [clubs, setClubs] = useState([]);
  const [newClub, setNewClub] = useState({
    name: '',
    description: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/clubs');
      console.log('Fetched clubs:', response.data);
      setClubs(response.data);
    } catch (error) {
      console.error('Error fetching clubs:', error);
      setMessage('Error fetching clubs');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting club:', newClub);
      const response = await axios.post('http://localhost:5000/api/clubs', newClub);
      console.log('Server response:', response.data);
      
      setMessage('Club created successfully!');
      setNewClub({ name: '', description: '' });
      fetchClubs(); // Refresh the clubs list
    } catch (error) {
      console.error('Error creating club:', error.response?.data || error);
      setMessage(error.response?.data?.message || 'Error creating club');
    }
  };

  return (
    <div className="club-management">
      <h2>Club Management</h2>
      
      <form onSubmit={handleSubmit} className="club-form">
        <h3>Create New Club</h3>
        {message && <div className="message">{message}</div>}
        <input
          type="text"
          placeholder="Club Name"
          value={newClub.name}
          onChange={(e) => setNewClub({...newClub, name: e.target.value})}
          required
        />
        <textarea
          placeholder="Club Description"
          value={newClub.description}
          onChange={(e) => setNewClub({...newClub, description: e.target.value})}
          required
        />
        <button type="submit">Create Club</button>
      </form>

      <div className="clubs-list">
        <h3>Existing Clubs</h3>
        <div className="clubs-grid">
          {clubs.map((club) => (
            <div key={club._id} className="club-card">
              <h4>{club.name}</h4>
              <p>{club.description}</p>
              <small>Created: {new Date(club.createdAt).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClubManagement;