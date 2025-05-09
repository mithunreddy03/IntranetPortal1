import React, { useState } from "react";
import "./Slotbooking.css";

const lecturers = ["Dr. Rahul", "Dr. Mahipal", "Dr. Manoj"];
const timeSlots = [
  "9:00 AM - 10:00 AM",
  "11:00 AM - 12:00 PM",
  "2:00 PM - 3:00 PM",
];

const SlotBooking = () => {
  const [selectedLecturer, setSelectedLecturer] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [purpose, setPurpose] = useState("");
  const [success, setSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleBooking = (e) => {
    e.preventDefault();

    if (!selectedLecturer || !selectedDate || !selectedTimeSlot || !purpose) {
      alert("Please fill all the fields.");
      return;
    }

    // Simulate form submission
    console.log("Slot Booked:", {
      selectedLecturer,
      selectedDate,
      selectedTimeSlot,
      purpose,
    });

    setSuccess(true);
    setSelectedLecturer("");
    setSelectedDate("");
    setSelectedTimeSlot("");
    setPurpose("");

    // Reset success message after a delay
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Add logic here to filter faculty based on searchTerm
    // For example: filterFaculty(e.target.value);
  };

  return (
    <div className="slot-booking-container">
      <h2>Book a Lecture Slot</h2>
      
      {/* Search Bar */}
      <div className="search-bar" style={{ marginBottom: '20px' }}> {/* Added some margin */}
        <input
          type="text"
          placeholder="Search Faculty Name..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ padding: '10px', width: '300px' }} // Added some basic styling
        />
      </div>

      <form onSubmit={handleBooking} className="booking-form">
        <div className="section">
          <label>Select Lecturer:</label>
          <div className="options">
            {lecturers.map((lec) => (
              <div
                key={lec}
                className={`option-card ${
                  selectedLecturer === lec ? "selected" : ""
                }`}
                onClick={() => setSelectedLecturer(lec)}
              >
                {lec}
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <label>Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
          />
        </div>

        <div className="section">
          <label>Select Time Slot:</label>
          <div className="options">
            {timeSlots.map((slot) => (
              <div
                key={slot}
                className={`option-card ${
                  selectedTimeSlot === slot ? "selected" : ""
                }`}
                onClick={() => setSelectedTimeSlot(slot)}
              >
                {slot}
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <label>Purpose:</label>
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Why do you want to meet?"
            rows="4"
            required
          />
        </div>

        <button type="submit">Confirm Booking</button>

        {success && (
          <p className="success-message">Lecture slot booked successfully!</p>
        )}
      </form>
    </div>
  );
};

export default SlotBooking;
