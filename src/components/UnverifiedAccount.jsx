import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const UnverifiedAccount = () => {
  const [email, setEmail] = useState(''); // State to hold user's email
  const [generatedCode, setGeneratedCode] = useState(''); // State to hold generated verification code

  const serviceId = "service_udjofmv";
  const templateId = "template_m13t88y";
  const publicKey = "ReRhPIMd5D_JWMuP7";

  // Function to handle the Resend Code button click
  const handleResendCode = () => {
    // Generate a random 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000);
    setGeneratedCode(code); // Set the generated code in the state

    // Assuming you have a variable `firstname`, which you can set accordingly
    const firstname = 'John'; // Replace with actual logic to fetch the first name if needed

    // Send the verification code email using emailjs
    emailjs.send(
      serviceId,
      templateId,
      { name: firstname, email: email, message: code }, // Send email, code, and name to the template
      publicKey
    )
    .then((response) => {
      console.log('Verification code sent successfully:', response);
    })
    .catch((error) => {
      console.error('Error sending verification code:', error);
    });
  };

  return (
    <div className="grid gap-3 mb-4">
      <div>
        <label className="text-gray-800 text-sm mb-1 block text-center">
          Verification Code <span className="text-red-500">*</span>
        </label>
        <div className="relative flex items-center">
          <input
            name="verification"
            type="text"
            className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-[#2dc978]"
            placeholder="Enter Verification Code"
          />
        </div>
      </div>

      <div className="flex justify-center !mt-6">
        <button
          type="button"
          className="w-50 shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-[#1a8b51] hover:bg-[#1a7546] focus:outline-none"
          onClick={handleResendCode} // Trigger the resend code function
        >
          Resend Code
        </button>
      </div>
    </div>
  );
};

export default UnverifiedAccount;
