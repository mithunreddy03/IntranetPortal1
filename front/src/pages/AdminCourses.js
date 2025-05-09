import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlusCircle, FaList } from "react-icons/fa";
import "./style.css";

const AdminCourses = () => {
  const navigate = useNavigate();

  return (
    <div
      className="admin-clubs-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f3ec78, #af4261)",
        color: "#333",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
      }}
    >
      <div className="header-nav" style={{
        width: "100%", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "20px", 
        padding: "10px 20px"
      }}>
        <button 
          onClick={() => navigate("/admin-dashboard")} 
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 15px",
            background: "rgba(255, 255, 255, 0.2)",
            border: "none",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer"
          }}
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h3 style={{ color: "white" }}>Logged in as Admin</h3>
      </div>
      
      <h1
        style={{
          fontSize: "3rem",
          marginBottom: "40px",
          color: "#fff",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
        }}
      >
        Course Management
      </h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          className="add-course-button"
          style={{
            width: "250px",
            height: "200px",
            fontSize: "1.2rem",
            borderRadius: "12px",
            background: "linear-gradient(45deg, #6a11cb, #2575fc)",
            color: "white",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.boxShadow = "0 12px 20px rgba(0, 0, 0, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 8px 15px rgba(0, 0, 0, 0.2)";
          }}
          onClick={() => navigate("/admin-courses/add")}
        >
          <FaPlusCircle size={40} />
          <span>Add New Course</span>
        </button>

        <button
          className="view-courses-button"
          style={{
            width: "250px",
            height: "200px",
            fontSize: "1.2rem",
            borderRadius: "12px",
            background: "linear-gradient(45deg, #ff512f, #dd2476)",
            color: "white",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.boxShadow = "0 12px 20px rgba(0, 0, 0, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 8px 15px rgba(0, 0, 0, 0.2)";
          }}
          onClick={() => navigate("/admin-courses/view")}
        >
          <FaList size={40} />
          <span>View All Courses</span>
        </button>
      </div>
    </div>
  );
};

export default AdminCourses;