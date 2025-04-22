import React, { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { AiOutlineLogin } from 'react-icons/ai';
import { FiMail, FiLock } from 'react-icons/fi';
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  let __URL__ ;
  if ( document.domain === "localhost" ) {
    __URL__ = "http://localhost:1337";
  } else {
    __URL__ = "https://music-player-app-backend-yq0c.onrender.com";
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${__URL__}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs)
      });
      
      const data = await res.json();

      if(data.status === "success"){
        localStorage.setItem("access_token", data.token);
        // alert("Login Successful");
        toast.success("Login Successful")
        navigate('/');
      } else {
        // alert(data.message || "Something went wrong");
        toast.error(data.message || "Something went wrong")
      }
    } catch (error) {
      console.error("Login failed:", error);
      // alert("Login failed. Please try again.");
      toast.error("Login failed. Please try again.")
    } finally {
      setLoading(false);
    }
  }

  return (
    <div 
      className="w-full min-h-screen flex justify-center items-center py-10 px-4"
      style={{
        background: "linear-gradient(135deg, #1a1035 0%, #341b55 50%, #45277a 100%)",
      }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-lime-300 to-cyan-400">
            Music Stream
          </h1>
          <p className="text-gray-300 mt-2">Sign in to your account</p>
        </div>
        
        <form
          className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-8 shadow-2xl border border-gray-800/50"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Login
          </h2>
          
          <div className="space-y-5">
            <div className="relative">
              <label htmlFor="email" className="text-sm font-medium text-gray-300 mb-1 block">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <FiMail />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full bg-gray-800/50 text-white border border-gray-700 rounded-lg py-3 px-10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder:text-gray-500"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="relative">
              <label htmlFor="password" className="text-sm font-medium text-gray-300 mb-1 block">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <FiLock />
                </span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full bg-gray-800/50 text-white border border-gray-700 rounded-lg py-3 px-10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder:text-gray-500"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 shadow-lg transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>
                  <span>Sign In</span>
                  <AiOutlineLogin size={20} />
                </>
              )}
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-lime-400 hover:text-lime-500 transition-colors">
                Register
              </Link>
            </p>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;