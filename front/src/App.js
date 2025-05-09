import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import Announcements from "./pages/Announcements";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Clubs from "./pages/Clubs";
import ClubDetails from "./pages/ClubDetails";
import Complaint from "./pages/Complaint";
import AdminComplaints from "./pages/AdminComplaints"; // Added the AdminComplaints import
import Feedback from "./pages/Feedback";
import Slotbooking from "./pages/Slotbooking";
import Courses from "./pages/Courses";
import ComplaintFeedback from "./pages/complaintFeedback";
import AdminDashboard from "./pages/AdminDashboard";
import AdminClubs from "./pages/AdminClubs";
import NewClubForm from "./pages/NewClubForm";
import AdminCourses from "./pages/AdminCourses";
import AddCourseForm from "./pages/AddCourseForm";
import NewUserForm from "./pages/NewUserForm";
import FoodMenu from "./pages/FoodMenu"; // Add the new FoodMenu component

// Protected route component
const ProtectedRoute = ({ element, requiredRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Redirect to appropriate dashboard if role doesn't match
    return <Navigate to={`/${role}-dashboard`} replace />;
  }

  return element;
};

// Route accessible to both Admin and Student but not Teacher
const ClubsAccessRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (role === "teacher") {
    // Teachers don't have access to clubs
    return <Navigate to="/teacher-dashboard" replace />;
  }

  return element;
};

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Only redirect from root path
    if (!token) {
      navigate("/login");
    } else if (role && window.location.pathname === "/") {
      navigate(`/${role}-dashboard`);
    }
  }, [navigate]);

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Dashboards */}
      <Route
        path="/student-dashboard"
        element={<ProtectedRoute element={<StudentDashboard />} requiredRole="student" />}
      />
      <Route
        path="/teacher-dashboard"
        element={<ProtectedRoute element={<TeacherDashboard />} requiredRole="teacher" />}
      />
      <Route
        path="/admin-dashboard"
        element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />}
      />

      {/* Common Pages */}
      <Route path="/announcements" element={<ProtectedRoute element={<Announcements />} />} />
      <Route path="/search" element={<ProtectedRoute element={<Search />} />} />
      <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
      <Route path="/complaint" element={<ProtectedRoute element={<Complaint />} />} />
      <Route path="/feedback" element={<ProtectedRoute element={<Feedback />} />} />
      <Route path="/slotbooking" element={<ProtectedRoute element={<Slotbooking />} />} />
      <Route path="/courses" element={<ProtectedRoute element={<Courses />} />} />
      <Route path="/complaint-feedback" element={<ProtectedRoute element={<ComplaintFeedback />} />} />
      <Route path="/food-menu" element={<ProtectedRoute element={<FoodMenu />} />} />

      {/* Club Routes - Accessible to both Admin and Student */}
      <Route path="/clubs" element={<ClubsAccessRoute element={<Clubs />} />} />
      <Route path="/clubs/:clubId" element={<ClubsAccessRoute element={<ClubDetails />} />} />

      {/* Admin-only Routes */}
      <Route
        path="/admin-clubs"
        element={<ProtectedRoute element={<AdminClubs />} requiredRole="admin" />}
      />
      <Route
        path="/admin-clubs/new"
        element={<ProtectedRoute element={<NewClubForm />} requiredRole="admin" />}
      />
      <Route
        path="/admin-courses"
        element={<ProtectedRoute element={<AdminCourses />} requiredRole="admin" />}
      />
      <Route
        path="/admin-courses/add"
        element={<ProtectedRoute element={<AddCourseForm />} requiredRole="admin" />}
      />
      <Route
        path="/admin-create-user"
        element={<ProtectedRoute element={<NewUserForm />} requiredRole="admin" />}
      />
      <Route
        path="/admin-complaints"
        element={<ProtectedRoute element={<AdminComplaints />} requiredRole="admin" />}
      />

      {/* Redirect root or unknown paths */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
