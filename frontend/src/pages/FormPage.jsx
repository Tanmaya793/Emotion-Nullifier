
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const moods = ["stressed", "sad", "angry", "happy", "bored"];
const options = [
  "Music",
  "Movies",
  "Talking to someone",
  "Sleep",
  "Walk",
  "Games",
  "Meditation",
  "Others"
];

const FormPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() =>
    moods.reduce((acc, mood) => ({ ...acc, [mood]: "" }), {})
  );

  const handleRadioChange = (mood, value) => {
    setFormData((prev) => ({
      ...prev,
      [mood]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in first.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Preferences saved successfully!");
      } else {
        alert(data.msg || "Failed to save preferences.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Server error. Please try again later.");
    }
  };


  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>User Mood Interest Form</h2>
      <form onSubmit={handleSubmit}>
        {moods.map((mood) => (
          <div key={mood} style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "6px" }}>
              What do you prefer when you're {mood}?
            </label>
            <div>
              {options.map((option) => (
                <label key={option} style={{ marginRight: "12px" }}>
                  <input
                    type="radio"
                    name={mood}
                    value={option}
                    checked={formData[mood] === option}
                    onChange={() => handleRadioChange(mood, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}

        <button type="submit" style={{ padding: "8px 16px" }}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormPage;
