import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Feedback.css";

const Feedback = () => {
  // State management
  const [teacherList, setTeacherList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [feedbackContent, setFeedbackContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: ""
  });

  // Navigation and user role
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch appropriate data based on user role
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, token, userRole]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // For students, fetch list of teachers
      if (userRole === "student") {
        const response = await axios.get("http://localhost:5000/api/feedback/teachers", {
          headers: { Authorization: token }
        });
        setTeacherList(response.data);
      } 
      // For teachers, fetch their feedback
      else if (userRole === "teacher") {
        const response = await axios.get("http://localhost:5000/api/feedback/teacher", {
          headers: { Authorization: token }
        });
        setFeedbackList(response.data);
      } 
      // For admins, fetch all teachers, students, and feedback
      else if (userRole === "admin") {
        const [teachersRes, studentsRes, feedbackRes] = await Promise.all([
          axios.get("http://localhost:5000/api/feedback/teachers", {
            headers: { Authorization: token }
          }),
          axios.get("http://localhost:5000/api/feedback/students", {
            headers: { Authorization: token }
          }),
          axios.get("http://localhost:5000/api/feedback/admin", {
            headers: { Authorization: token }
          })
        ]);
        
        setTeacherList(teachersRes.data);
        setStudentList(studentsRes.data);
        setFeedbackList(feedbackRes.data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  // Handle student submitting feedback
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    
    if (!selectedTeacher || !feedbackContent) {
      setError("Please fill in all required fields");
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/feedback",
        {
          teacherId: selectedTeacher,
          content: feedbackContent,
          isAnonymous
        },
        { headers: { Authorization: token } }
      );
      
      setSuccess("Feedback submitted successfully!");
      setFeedbackContent("");
      setSelectedTeacher("");
      setIsAnonymous(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Error submitting feedback");
    } finally {
      setLoading(false);
    }
  };

  // Handle admin filtering feedback
  const handleFilterFeedback = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      // Build query parameters
      const params = {};
      if (selectedTeacher) params.teacherId = selectedTeacher;
      if (selectedStudent) params.studentId = selectedStudent;
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;
      
      const response = await axios.get("http://localhost:5000/api/feedback/admin", {
        params,
        headers: { Authorization: token }
      });
      
      setFeedbackList(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error filtering feedback");
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Render based on user role
  const renderContent = () => {
    // Student view - Submit feedback form
    if (userRole === "student") {
      return (
        <div className="feedback-form-container">
          <h2>Submit Feedback for Teacher</h2>
          
          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmitFeedback} className="feedback-form">
            <div className="form-group">
              <label>Select Teacher:</label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                required
              >
                <option value="">-- Select a Teacher --</option>
                {teacherList.map(teacher => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Your Feedback:</label>
              <textarea
                value={feedbackContent}
                onChange={(e) => setFeedbackContent(e.target.value)}
                placeholder="Please provide your constructive feedback here..."
                rows="6"
                required
              />
            </div>
            
            <div className="form-group-checkbox">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              <label htmlFor="anonymous">Submit Anonymously</label>
            </div>
            
            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        </div>
      );
    }
    
    // Teacher view - View feedback received
    else if (userRole === "teacher") {
      return (
        <div className="feedback-list-container">
          <h2>Feedback Received</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          {loading ? (
            <div className="loading">Loading feedback...</div>
          ) : feedbackList.length === 0 ? (
            <div className="no-feedback">You haven't received any feedback yet.</div>
          ) : (
            <div className="feedback-list">
              {feedbackList.map(feedback => (
                <div key={feedback._id} className="feedback-card">
                  <div className="feedback-header">
                    <div className="feedback-from">From: {feedback.studentId?.name}</div>
                    <div className="feedback-date">{formatDate(feedback.createdAt)}</div>
                  </div>
                  <div className="feedback-content">{feedback.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    // Admin view - Advanced filtering and viewing all feedback
    else if (userRole === "admin") {
      return (
        <div className="admin-feedback-container">
          <h2>All Feedback</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          {/* Filter Form */}
          <div className="filter-container">
            <h3>Filter Feedback</h3>
            <form onSubmit={handleFilterFeedback} className="filter-form">
              <div className="filter-row">
                <div className="form-group">
                  <label>Teacher:</label>
                  <select
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                  >
                    <option value="">All Teachers</option>
                    {teacherList.map(teacher => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Student:</label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                  >
                    <option value="">All Students</option>
                    {studentList.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="filter-row">
                <div className="form-group">
                  <label>From Date:</label>
                  <input
                    type="date"
                    name="startDate"
                    value={dateRange.startDate}
                    onChange={handleDateChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>To Date:</label>
                  <input
                    type="date"
                    name="endDate"
                    value={dateRange.endDate}
                    onChange={handleDateChange}
                  />
                </div>
              </div>
              
              <button type="submit" disabled={loading}>
                {loading ? "Filtering..." : "Apply Filters"}
              </button>
            </form>
          </div>
          
          {/* Feedback List */}
          {loading ? (
            <div className="loading">Loading feedback...</div>
          ) : feedbackList.length === 0 ? (
            <div className="no-feedback">No feedback found matching your criteria.</div>
          ) : (
            <div className="feedback-list">
              {feedbackList.map(feedback => (
                <div key={feedback._id} className="feedback-card admin-view">
                  <div className="feedback-header">
                    <div className="feedback-details">
                      <div><strong>From:</strong> {feedback.studentId?.name}</div>
                      <div><strong>To:</strong> {feedback.teacherId?.name}</div>
                    </div>
                    <div className="feedback-date">{formatDate(feedback.createdAt)}</div>
                  </div>
                  <div className="feedback-content">{feedback.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    // Fallback for unknown role
    return (
      <div>
        <h2>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  };

  return (
    <div className="feedback-page">
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(`/${userRole}-dashboard`)}>
          &larr; Back to Dashboard
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default Feedback;