import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import About from "./about";

function Home() {
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [warning, setWarning] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setWarning("");
    }
  };

  const uploadImage = async () => {
    const file = document.getElementById("imageInput").files[0];
    if (!file) {
      setWarning("⚠ Please upload an image before predicting!");
      setResult("");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(
        `Prediction: ${data.class_name}
        \n\nConfidence: ${(data.confidence * 100).toFixed(
          2
        )}%
        \n\nDescription: ${data.description || "N/A"}\n\nTreatment: ${
          data.treatment || "N/A"
        }\n\nRecommendation: ${data.recommendation || "N/A"}`
      );
    } catch (err) {
      setResult("❌ Error: " + err.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #06112bff, #284fbaff, #3064d3ff)",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          width: "100%",
          padding: "1rem 2rem",
          position: "fixed",
          top: 0,
          left: 0,
          background: "transparent",
          color: "#FFFFFF",
          zIndex: 100,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left: Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "2rem", fontWeight: "700", color: "#22D3EE" }}>
            SkinAlyze
          </span>
        </div>

        {/* Right: Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Link
            to="/about"
            style={{
              color: "#E5E7EB",
              textDecoration: "none",
              fontSize: "1rem",
              fontWeight: "500",
              transition: "color 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.color = "#22D3EE")}
            onMouseOut={(e) => (e.target.style.color = "#E5E7EB")}
          >
            About Us
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          paddingTop: "4rem",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "2.5rem",
            borderRadius: "16px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
            textAlign: "center",
            width: "420px",
          }}
        >
          <h2 style={{ fontWeight: "600", marginBottom: "1rem", fontSize: "1.3rem", fontFamily: "Jost" }}>
            AI-Powered Skin Disease Analyzer
          </h2>
          <p style={{ fontSize: "0.95rem", color: "#475569", marginBottom: "1.5rem" }}>
            Upload a skin image to get instant predictions and professional recommendations.
          </p>

          {/* File Input */}
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            onChange={handleFileChange}
            style={{
              display: "block",
              margin: "0 auto 1rem",
              padding: "0.4rem",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          />

          {/* Button */}
          <button
            onClick={uploadImage}
            style={{
              padding: "0.6rem 1.2rem",
              background: "linear-gradient(to right, #2563eb, #1d4ed8)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.opacity = "0.9")}
            onMouseOut={(e) => (e.target.style.opacity = "1")}
          >
            Predict
          </button>

          {/* Warning */}
          {warning && (
            <p style={{ color: "red", marginTop: "1rem", fontWeight: "500" }}>
              {warning}
            </p>
          )}

          {/* Image Preview */}
          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{
                maxWidth: "100%",
                margin: "1.5rem auto",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
          )}

          {/* Results */}
          {result && (
            <pre
              style={{
                textAlign: "left",
                marginTop: "1.5rem",
                background: "#f9fafb",
                padding: "1rem",
                borderRadius: "10px",
                fontSize: "0.9rem",
                lineHeight: "1.4rem",
                whiteSpace: "pre-wrap",
                boxShadow: "inset 0 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              {result.split('\n').map((line, idx) => {
                // Add inline style for larger font size
                const bolded = line.replace(
                  /^(Prediction:|Confidence:|Description:|Treatment:|Recommendation:)/,
                  (match) => `<strong style="font-size:1.15em;">${match}</strong>`
                );
                return (
                  <span
                    key={idx}
                    dangerouslySetInnerHTML={{ __html: bolded }}
                  />
                );
              }).reduce((prev, curr) => [prev, <br key={Math.random()} />, curr])}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}
