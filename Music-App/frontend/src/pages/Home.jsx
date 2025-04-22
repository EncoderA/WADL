import React, { useContext, useEffect } from "react";
import { SidebarContext } from "../Context/SibebarContext";
import '../utils/style.css'
import { Link } from "react-router-dom";

const Home = () => {
  const { showMenu, setShowMenu } = useContext(SidebarContext);
  useEffect(() => {
    if (showMenu) setShowMenu(false);
  }, []);

  const token = localStorage.getItem("access_token") || null;
  return (
    <div
      className="w-full min-h-screen flex justify-center items-center flex-col relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      }}
    >
      <div className="absolute w-full h-full opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-blue-600 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-700 rounded-full filter blur-3xl"></div>
      </div>
      <div className="flex flex-col justify-center items-center space-y-8 w-full h-screen px-5 max-w-4xl mx-auto z-10">
        <h1 className="text-5xl lg:text-7xl text-white font-bold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-lime-300 to-cyan-400">
            Music Stream
          </span>
        </h1>
        <p className="text-gray-200 text-2xl lg:text-4xl font-light text-center max-w-2xl">
          Listen to your favorite songs
        </p>
        <div className="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-6 mt-6">
          {token ? (
            <Link 
              to='/upload' 
              className="bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-500 hover:to-emerald-500 w-48 py-3 rounded-lg flex justify-center items-center text-gray-800 font-medium text-lg shadow-lg transform transition-all hover:scale-105"
            >
              Upload
            </Link>
          ) : (
            <Link 
              to='/login' 
              className="bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-500 hover:to-emerald-500 w-48 py-3 rounded-lg flex justify-center items-center text-gray-800 font-medium text-lg shadow-lg transform transition-all hover:scale-105"
            >
              Login
            </Link>
          )}
          <Link 
            to='/explore' 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 w-48 py-3 rounded-lg flex justify-center items-center text-white font-medium text-lg shadow-lg transform transition-all hover:scale-105"
          >
            Stream
          </Link>
        </div>
        {/* <div className="absolute bottom-8 flex flex-col items-center">
          <p className="text-gray-300 text-sm">Built for music lovers</p>
        </div> */}
      </div>
    </div>
  );
};

export default Home;