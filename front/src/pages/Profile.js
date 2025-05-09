import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaCheck, FaTimes } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if passwords match and meet requirements
  const passwordsMatch = newPassword === confirmPassword;
  const passwordLongEnough = newPassword.length >= 6;
  const formIsValid = passwordsMatch && passwordLongEnough && newPassword.length > 0;

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!formIsValid) {
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You must be logged in to change your password');
        navigate('/login');
        return;
      }
      
      const response = await axios.put(
        'http://localhost:5000/api/users/change-password', 
        { newPassword },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        }
      );
      
      setSuccess(response.data.message);
      setNewPassword('');
      setConfirmPassword('');
      
      // Hide form after successful password change
      setTimeout(() => {
        setShowPasswordForm(false);
        setSuccess('');
      }, 3000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while changing password');
      console.error('Password change error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1><FaUser className="profile-icon" /> User Profile</h1>
        <p>Manage your account settings</p>
      </div>
      
      {!showPasswordForm ? (
        <div className="profile-card">
          <div className="profile-option">
            <h2><FaLock className="option-icon" /> Security</h2>
            <p>Update your password to keep your account secure</p>
            <button 
              className="change-password-btn" 
              onClick={() => setShowPasswordForm(true)}
            >
              Change Password
            </button>
          </div>
        </div>
      ) : (
        <div className="password-form-container">
          <h2>Change Your Password</h2>
          
          {error && (
            <div className="error-message">
              <FaTimes className="message-icon" /> {error}
            </div>
          )}
          
          {success && (
            <div className="success-message">
              <FaCheck className="message-icon" /> {success}
            </div>
          )}
          
          <form onSubmit={handleChangePassword} className="password-form">
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={6}
              />
              {newPassword && !passwordLongEnough && (
                <p className="validation-message">Password must be at least 6 characters</p>
              )}
            </div>
            
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
              {confirmPassword && !passwordsMatch && (
                <p className="validation-message">Passwords do not match</p>
              )}
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setShowPasswordForm(false);
                  setNewPassword('');
                  setConfirmPassword('');
                  setError('');
                }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={!formIsValid || loading}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
