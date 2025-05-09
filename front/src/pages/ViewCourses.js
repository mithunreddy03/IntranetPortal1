import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./NewClubForm.css"; // Base styling
import "./ViewCourses.css"; // Table-specific styling

const ViewCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/courses");
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching courses: " + (error.response?.data?.message || error.message));
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on search term
  const filteredCourses = courses.filter(course => 
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="new-club-form-container">
      <div className="form-header">
        <button className="back-button" onClick={() => navigate("/admin-courses")}>
          <FaArrowLeft /> Back to Course Management
        </button>
        <h2 className="form-title">Course List</h2>
      </div>

      {/* Search bar */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search courses by name, code, instructor or branch..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-message">Loading courses...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : courses.length === 0 ? (
        <div className="info-message">No courses found. Add a course to get started.</div>
      ) : filteredCourses.length === 0 ? (
        <div className="info-message">No courses match your search term.</div>
      ) : (
        <div className="courses-list">
          <table className="data-table">
            <thead>
              <tr>
                <th>Course ID</th>
                <th>Course Name</th>
                <th>Course Code</th>
                <th>Instructor</th>
                <th>Credits</th>
                <th>Branch</th>
                <th>Batch</th>
                <th>Semester</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course._id}>
                  <td>{course.courseId}</td>
                  <td>{course.courseName}</td>
                  <td>{course.courseCode}</td>
                  <td>{course.instructor}</td>
                  <td>{course.credits}</td>
                  <td>{course.branch}</td>
                  <td>{course.batch}</td>
                  <td>{course.semester}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewCourses;