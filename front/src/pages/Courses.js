import React, { useState } from "react";
import "./Courses.css";

const Courses = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);

  const handleEnroll = (e) => {
    e.preventDefault();
    if (selectedCourse) {
      console.log("Enrolled in course:", selectedCourse);
      setEnrollmentSuccess(true);
      setSelectedCourse("");
    }
  };

  return (
    <div className="courses-container">
      <h2>Course Enrollment</h2>
      <form onSubmit={handleEnroll}>
        <label>Select a Course:</label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          required
        >
          <option value="">-- Select Course --</option>
          <option value="Machine Learning">Machine Learning</option>
          <option value="Data Base Management">Data Base Management</option>
          <option value="Data Structures">Data Structures</option>
          <option value="Operating Systems">Operating Systems</option>
        </select>

        <button type="submit">Enroll</button>

        {enrollmentSuccess && (
          <p className="success-message">Successfully enrolled in the course!</p>
        )}
      </form>
    </div>
  );
};

export default Courses;
