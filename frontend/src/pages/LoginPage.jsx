
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        setMessage("Login successful!");
        navigate("/form");
      } else {
        setMessage(data.msg || "Login failed.");
      }
    } catch (error) {
      setMessage("Server error");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "20px auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label><br />
          <input type="text" name="username" value={form.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label><br />
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default LoginPage;
