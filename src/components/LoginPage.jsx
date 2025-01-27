import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import FormImage from '../assets/images/FormImage.svg';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [locked, setLocked] = useState(false); // lockout state

  const notifysuccess = (msg) => toast.success(msg, { position: "top-center", toastId: 'success1' });
  const notifyfail = () => toast.error("Account Does Not Exist!", { position: "top-center" });

  
  const navigate = useNavigate();

  useEffect(() => {
    let login = localStorage.getItem("login");
    if(login){
        navigate("/home");
    }
    let loginStatus = localStorage.getItem("loginStatus");
    if(loginStatus){
        setError(loginStatus);
        setTimeout(function(){
            localStorage.clear();
            window.location.reload();
        }, 3000);
    }
    setTimeout(function(){
        setMsg("");
    }, 5000);
  }, [msg]);

  const handleLogin = async (e) => { 
    e.preventDefault(); 
    if (mistakeCount >= 3) { 
      setLocked(true); 
      setTimeout(() => {
        setMistakeCount(0); 
        setLocked(false); 
      }, 30000); // Lock for 30 seconds 
      setError("Too many failed attempts. Please try again in 30 seconds.");
      return;
    }

    if (email !== "" && password !== "") {
      try {
        const response = await axios.post('http://localhost/webPHP/login.php', {
          email,
          password,
        });
    
        // If login is successful
        if (response.data.success === true) {
            const loadingToast = toast.loading('Loading 🍕🥪🍔', { position: "top-center", toastId: 'loading1' });
            setError("");
            setMistakeCount(0);
            setTimeout(() => {
            localStorage.setItem("login", true);
            localStorage.setItem('email', email);
            localStorage.setItem('firstname', response.data.firstname);
            localStorage.setItem('role', response.data.role); 
            toast.dismiss(loadingToast);  
            notifysuccess(`Welcome, ${response.data.firstname}!`); // Show success toast with user's name
            navigate('/Home'); // Navigate to Home page 
          }, 2000);
        } else if (response.data.success === false) {
          notifyfail(); // Show error toast
        } else {
          setMistakeCount(mistakeCount + 1);
          setError(response.data.message); // Handle request error
        }
      }catch (error) {
          setError("Login failed: " + error.message); // Handle request error
      }
    } else {
      setError("Please enter both email and password");
    }
  };
  

  return (
    <div className="font-[sans-serif] bg-white">
      <div className="min-h-screen flex fle-col items-center justify-center py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full">
          <div className="border border-gray-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="mb-4">
                <h1 className="font-logo text-5xl pb-4 text-center">Tasty</h1>
                <h3 className="text-gray-800 text-3xl font-extrabold text-center">Welcome Back Cook!</h3>
                <p class="text-gray-500 text-sm mt-4 leading-relaxed text-center pb-6">Sign in and explore the world of delicious possibilities!</p>
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
                  <input value={password} onChange={(e) => setPassword(e.target.value)}  type={showPassword ? "text" : "password"} className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-[#2dc978]" placeholder="Enter password" />
                </div>
              </div>

              <div className="mt-2 ml-0.5">
                <label className="flex items-center text-sm text-gray-800">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="mr-2 accent-teal-600"
                  />
                  Show Password
                </label>
              </div>

              <p className='text-center'>
                {msg !== "" ? <span className='text-sm !mt-8 text-center text-[#14A44D]'>{msg}</span> : <span className='text-sm !mt-8 text-center text-[#DC4C64]'>{error}</span>}
              </p>

              <div className="!mt-8">
                <button type="submit" className="w-full shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-[#32de84] hover:bg-[#2dc978] focus:outline-none">
                  Login
                </button>
              </div>

              <p className="text-sm !mt-8 text-center text-gray-800">Don't have an account? <a href="/register" className="text-[#2dc978] font-semibold hover:underline ml-1 whitespace-nowrap">Sign up</a></p>
            </form>
          </div>
          <div className="lg:h-[400px] md:h-[300px] max-md:mt-2 ">
            <img src={FormImage} className="w-full h-full max-md:w-4/5 mx-auto block object-cover" alt="Chef Cooking" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;