import React, { useState } from "react";
import emailjs from '@emailjs/browser';

const VerificationEmail = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const sendVerificationEmail = (e) => {
    e.preventDefault();

    // EmailJS Config
    const serviceId = "service_udjofmv";
    const templateId = "template_m13t88y";
    const publicKey = "ReRhPIMd5D_JWMuP7";

    
    emailjs
      .send(
        serviceId,
        templateId,
        { user_email: email, verification_link: verificationLink },
        publicKey
      )
      .then(
        (response) => {
          setMessage("Verification email sent successfully!");
          console.log("Email sent successfully", response);
        },
        (error) => {
          setMessage("Failed to send verification email.");
          console.error("Error sending email", error);
        }
      );
  };

  return (
    <div>
      <h1>Send Verification Email</h1>
      <form onSubmit={sendVerificationEmail}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Email</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default VerificationEmail;
