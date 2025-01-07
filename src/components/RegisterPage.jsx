import React, { useState } from 'react';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import SignUpImage from '../assets/images/formimageReg.svg';

const RegisterPage = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationInput, setVerificationInput] = useState(""); // New state for user input
  const [message, setMessage] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false); // Flag to indicate if the code has been sent

  const notifysuccess = () => toast.success("You Can Now Login!");
  const notifyfail = () => toast.error("Oh No! Something went wrong");

  const navigate = useNavigate();

  const serviceId = "service_udjofmv";
  const templateId = "template_m13t88y";
  const publicKey = "ReRhPIMd5D_JWMuP7";
  
  const generateVerificationCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit code
    return code;
  };

  const resendVerificationCode = async () => {
    // Generate and resend verification code
    const generatedCode = generateVerificationCode();
    setVerificationCode(generatedCode);
    
    // Send the verification code to the email
    try {
      await emailjs.send(
        serviceId,
        templateId,
        { name: firstname, message: generatedCode, to_email: email },
        publicKey
      );
      setMessage("Verification email resent successfully!");
    } catch (error) {
      setMessage("Failed to resend verification email.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validate form inputs
    if (firstname === "" || lastname === "" || email === "" || password === "" || cpassword === "") {
      setError("Please Input All Required Fields");
    } else if (password !== cpassword) {
      setError("Whoops! Password Does Not Match");
    } else if (password.length < 8) {
      setError("Password Should be Atleast 8 Characters");
    } else if (isCodeSent && verificationInput !== verificationCode.toString()) { // Verify the code
      setError("Incorrect Verification Code");
      return;
    } else {
      try {
        // Check if email already exists
        const emailCheckResponse = await axios.post('http://localhost/webPHP/checkEmail.php', { email });
        if (!emailCheckResponse.data.success) {
          setError("Email already exists");
          return;
        }
      } catch (error) {
        setError("Email validation failed: " + error.message);
        return;
      }

      setError(""); // Clear any previous errors

      if (!isCodeSent) {
        // Generate and send a verification code if it's not sent already
        const generatedCode = generateVerificationCode();
        setVerificationCode(generatedCode);
        setIsCodeSent(true); // Set the flag to true after sending the code

        // Send verification code via email
        try {
          emailjs
            .send(
              serviceId,
              templateId,
              { name: firstname, message: generatedCode, to_email: email },
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
        } catch (error) {
          setError("Error sending verification email: " + error.message);
          return;
        }
      } else {
        try {
          // Send POST request to the backend to register user
          const response = await axios.post('http://localhost/webPHP/signUp.php', {
            firstname,
            lastname,
            email,
            password,
            verification_code: verificationCode,
          });

          // Handle response from the backend
          if (response.data.success) {
            notifysuccess(); // Show success toast
            navigate('/Login'); // Navigate to Login page
          } else {
            notifyfail(); // Show error toast
            setError(response.data.message); // Set error message
          }
        } catch (error) {
          setError("Sign Up failed: " + error.message); // Handle request error
        }
      }

    }
  };

  return (
    <div className="font-[sans-serif] bg-white">
      <div className="min-h-screen flex fle-col items-center justify-center py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full">
          <div className="border border-gray-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="mb-4">
                <h1 className="font-logo text-5xl pb-4 text-center">Tasty</h1>
                <h3 className="text-gray-800 text-2xl font-extrabold text-center">Sign Up</h3>
              </div>

              <div className="grid gap-3 mb-6 md:grid-cols-2">
                <div>
                  <label className="text-gray-800 text-sm mb-1 block">First name <span className="text-red-500">*</span></label>
                  <div className="relative flex items-center">
                    <input name="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} type="text" className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-[#2dc978]" placeholder="Enter first name" />
                  </div>
                </div>

                <div>
                  <label className="text-gray-800 text-sm mb-1 block">Last name <span className="text-red-500">*</span></label>
                  <div className="relative flex items-center">
                    <input name="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} type="text" className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-[#2dc978]" placeholder="Enter last name" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-1 block">Email <span className="text-red-500">*</span></label>
                <div className="relative flex items-center">
                  <input name="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-[#2dc978]" placeholder="Enter email" />
                </div>
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-1 block">Password <span className="text-red-500">*</span></label>
                <div className="relative flex items-center ">
                  <input name="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-[#2dc978]" placeholder="Enter password" />
                </div>
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-1 block">Confirm Password <span className="text-red-500">*</span></label>
                <div className="relative flex items-center ">
                  <input name="password" value={cpassword} onChange={(e) => setCpassword(e.target.value)} type="password" className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-[#2dc978]" placeholder="Confirm password" />
                </div>
              </div>

              {isCodeSent && (
                <div>
                  <label className="text-gray-800 text-sm mb-1 block">Verification Code <span className="text-red-500">*</span></label>
                  <div className="relative flex items-center">
                    <input
                      name="verification_code"
                      value={verificationInput}
                      onChange={(e) => setVerificationInput(e.target.value)}
                      type="text"
                      className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-[#2dc978]"
                      placeholder="Enter verification code"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={resendVerificationCode}
                    className="text-sm mt-2 text-[#2dc978] font-semibold hover:underline"
                  >
                    Resend Code
                  </button>
                </div>
              )}

              <p className='text-center'>
                {msg !== "" ? <span className='text-sm !mt-8 text-center text-[#14A44D]'>{msg}</span> : <span className='text-sm !mt-8 text-center text-[#DC4C64]'>{error}</span>}
              </p>

              <div className="!mt-8">
                <button type="submit" className="w-full shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-[#32de84] hover:bg-[#2dc978] focus:outline-none">
                  Sign Up
                </button>
              </div>

              <p className="text-sm !mt-8 text-center text-gray-800">Already have an account? <a href="/login" className="text-[#2dc978] font-semibold hover:underline ml-1 whitespace-nowrap">Sign in</a></p>
            </form>
          </div>
          <div className="lg:h-[400px] md:h-[300px] max-md:mt-2 ">
            <img src={SignUpImage} className="w-full h-full max-md:w-4/5 mx-auto block object-cover" alt="Chef Cooking" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
