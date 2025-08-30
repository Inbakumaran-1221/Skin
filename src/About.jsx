import React from "react";

export default function About() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #06112bff, #284fbaff, #3064d3ff)",
        fontFamily: "Segoe UI, sans-serif",
        paddingTop: "5rem",
        color: "white",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "#2c99c1ff" }}>
        About Us
      </h1>
      <p style={{ fontSize: "1.1rem", maxWidth: "700px", margin: "2rem auto" }}>
        Skin Disease is said to be the 4th most common disease globally, affecting millions of people.
        Also, most of the population lacks access to proper dermatological care and resources.
        So we created a solution to bridge this gap by providing an AI-powered tool.
        <br /><br />
        SkinAnalyz is an AI-powered tool designed to analyze skin images and
        detect possible skin conditions. Our mission is to assist users in
        getting early insights and professional recommendations using advanced
        deep learning models. This app is built to support dermatological
        awareness and help people take better care of their skin.
        Our AI model is trained on a diverse dataset of skin conditions, 
        ensuring accurate and reliable predictions.
        <br /><br />
        Join us in our mission and share SkinAnalyz with friends and family to promote greater skin health awareness.
        <br /><br />
        <strong>Disclaimer:</strong> This tool is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
      </p>
    </div>
  );
}
