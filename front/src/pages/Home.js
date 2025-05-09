import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBell,
  FaSearch,
  FaUser,
  FaClipboardList,
  FaChartBar,
  FaCalendarAlt,
} from "react-icons/fa";
import "../pages/style.css";

const Home = () => {
  const navigate = useNavigate();
  const gridItems = [
    { name: "Clubs", img: "icons8-user-groups-48.png", path: "/clubs" },
    { name: "Courses", img: "icons8-courses-64.png", path: "/courses" },
    { name: "Slot Booking", img: "/icons8-ticket-purchase-48.png", path: "/slotbooking" },
    { name: "Mail", img: "/icons8-mail-48.png", path: "/mail" },
    { name: "Complaint", img: "icons8-complaint-100.png", path: "/complaint" },
    { name: "Hostel", img: "icons8-hostel-64.png", path: "/hostel" },
    { name: "Feedback", img: "icons8-feedback-60.png", path: "/feedback" },
    { name: "Food Menu", img: "/icons8-application-32.png", path: "/food-menu" },
  ];

  return (
    <div className="home-main-container">
      {/* Sidebar */}
      <div className="nav-container">
        <div className="logo">
          <img src="/mahindra-university-logo.png" alt="Mahindra University Logo" />
        </div>
        <button className="nav-item" onClick={() => navigate("/")}>
          <FaHome className="icon" />
          <span>Home</span>
        </button>
        <button className="nav-item" onClick={() => navigate("/announcements")}>
          <FaBell className="icon" />
          <span>Announcements</span>
        </button>
        <button className="nav-item" onClick={() => navigate("/search")}>
          <FaSearch className="icon" />
          <span>Search</span>
        </button>
        <button className="nav-item" onClick={() => navigate("/profile")}>
          <FaUser className="icon" />
          <span>Profile</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="main-container">
        <div className="header">
          <div className="user-info">
            <h2>Tejas</h2>
            <p>Artificial Intelligence B.Tech</p>
          </div>
        </div>

        {/* Black Box */}
        <div className="black-box">
          <div className="black-box-item">
            <FaClipboardList className="black-box-icon" />
            <span>Attendance</span>
          </div>
          <div className="black-box-item">
            <FaChartBar className="black-box-icon" />
            <span>Statistics</span>
          </div>
          <div className="black-box-item">
            <FaCalendarAlt className="black-box-icon" />
            <span>Scheduler</span>
          </div>
        </div>

        {/* Grid Container */}
        <div className="grid-container">
          {gridItems.map((item, index) => (
            <div
              className="grid-item"
              key={index}
              onClick={() => navigate(item.path)}
              style={{ cursor: "pointer" }}
            >
              <img src={item.img} alt={item.name} className="grid-icon" />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
