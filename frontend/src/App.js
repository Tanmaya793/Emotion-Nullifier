import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import FormPage from "./pages/FormPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterPage />} />  
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/form" element={<FormPage />} />   
      </Routes>
    </Router>
  );
}

export default App;
