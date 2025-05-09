import React, { useState } from "react";

const ComplaintFeedback = () => {
  const [complaint, setComplaint] = useState("");
  const [category, setCategory] = useState("");
  const [feedback, setFeedback] = useState("");
  const [lecturer, setLecturer] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const validateForm = (fields) => {
    for (const field in fields) {
      if (!fields[field]) {
        setMessage({ text: `${field} is required.`, type: "error" });
        return false;
      }
    }
    return true;
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm({ category, complaint })) return;

    try {
      const response = await fetch("/submitComplaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, complaint }),
      });

      if (response.ok) {
        setMessage({ text: "Complaint submitted successfully!", type: "success" });
        setCategory("");
        setComplaint("");
      } else {
        setMessage({ text: "Failed to submit complaint. Please try again.", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "An error occurred. Please try again later.", type: "error" });
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm({ lecturer, feedback })) return;

    try {
      const response = await fetch("/submitFeedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lecturer, feedback }),
      });

      if (response.ok) {
        setMessage({ text: "Feedback submitted successfully!", type: "success" });
        setLecturer("");
        setFeedback("");
      } else {
        setMessage({ text: "Failed to submit feedback. Please try again.", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "An error occurred. Please try again later.", type: "error" });
    }
  };

  return (
    <div className="complaint-feedback-container">
      <h2>Complaint and Feedback</h2>
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleComplaintSubmit}>
        <h3>Submit a Complaint</h3>
        <label>
          Category:
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Select a category</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Academics">Academics</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label>
          Complaint:
          <textarea
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            required
          ></textarea>
        </label>
        <button type="submit">Submit Complaint</button>
      </form>

      <form onSubmit={handleFeedbackSubmit}>
        <h3>Submit Feedback</h3>
        <label>
          Lecturer:
          <input
            type="text"
            value={lecturer}
            onChange={(e) => setLecturer(e.target.value)}
            required
          />
        </label>
        <label>
          Feedback:
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          ></textarea>
        </label>
        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default ComplaintFeedback;
