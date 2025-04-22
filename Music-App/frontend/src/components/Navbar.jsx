import React, { useContext } from "react";
import { SidebarContext } from "../Context/SibebarContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { ImMusic } from "react-icons/im";
import { TfiWrite } from "react-icons/tfi";
import { CgPlayList } from "react-icons/cg";
import { GiMusicSpell } from 'react-icons/gi';
import { BiWindowClose } from "react-icons/bi";
import { FiMenu } from "react-icons/fi";
import "../utils/style.css";

const Navbar = () => {
  const sideBar = useContext(SidebarContext);
  const location = useLocation();
  const toggleMenu = () => {
    sideBar.setShowMenu(!sideBar.showMenu);
  };
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path ? "text-lime-400" : "text-gray-300 hover:text-white";
  };

  return (
    <header className="z-50 w-full sticky backdrop-blur-lg bg-gray-900 text-white top-0 flex flex-col justify-between items-center py-2 lg:py-3 px-4 lg:px-10 font-space shadow-md border-b border-gray-800 h-16 lg:h-18">
      <nav className="mx-auto w-full flex justify-between items-center">
        <Link to={'/'} className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-1.5 rounded-md">
            <GiMusicSpell size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lime-400 to-cyan-400">
            Music Stream
          </span>
        </Link>
        
        <button
          onClick={toggleMenu}
          className="lg:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors duration-200"
          aria-label="Toggle Menu"
        >
          <FiMenu size={22} />
        </button>

        {/* ------------Mobile Nav------------ */}
        <div
          className={`lg:hidden text-lg flex flex-col bg-gray-900/95 backdrop-blur-lg w-72 fixed z-50 top-0 p-6 h-screen items-start justify-start space-y-7 pt-20 transition-all duration-300 ease-in-out shadow-2xl border-l border-gray-800 ${sideBar.showMenu ? "right-0" : "-right-72"
            }`}
        >
          <Link 
            to="/" 
            className="flex items-center space-x-3 hover:translate-x-1 transition-all duration-200"
            onClick={toggleMenu}
          >
            <GoHome className="text-lime-400" />
            <span className="font-medium">Home</span>
          </Link>
          
          <Link
            to="/explore"
            className="flex items-center space-x-3 hover:translate-x-1 transition-all duration-200"
            onClick={toggleMenu}
          >
            <ImMusic className="text-lime-400" />
            <span className="font-medium">Songs</span>
          </Link>
          
          <Link
            to="/upload"
            className="flex items-center space-x-3 hover:translate-x-1 transition-all duration-200"
            onClick={toggleMenu}
          >
            <TfiWrite className="text-lime-400" />
            <span className="font-medium">Upload</span>
          </Link>
          
          <Link
            to="/playlists"
            className="flex items-center space-x-3 hover:translate-x-1 transition-all duration-200"
            onClick={toggleMenu}
          >
            <CgPlayList className="text-lime-400" />
            <span className="font-medium">Playlist</span>
          </Link>

          <div className="pt-5 w-full border-t border-gray-800">
            {token ? (
              <button
                onClick={() => {
                  logOut();
                  toggleMenu();
                }}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 py-2 rounded-md shadow-lg text-white font-medium hover:from-rose-600 hover:to-pink-700 transition-all"
              >
                Log Out
              </button>
            ) : (
              <div className="flex flex-col space-y-3 w-full">
                <Link
                  to={"/login"}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 py-2 rounded-md shadow-lg text-white font-medium text-center hover:from-indigo-600 hover:to-purple-700 transition-all"
                  onClick={toggleMenu}
                >
                  Log In
                </Link>
                <Link
                  to={"/register"}
                  className="w-full bg-gradient-to-r from-lime-400 to-emerald-400 py-2 rounded-md shadow-lg text-gray-800 font-medium text-center hover:from-lime-500 hover:to-emerald-500 transition-all"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          
          <button
            onClick={toggleMenu}
            className="absolute top-5 right-5 p-2 bg-gray-800/50 rounded-md hover:bg-gray-700/50 transition-all"
          >
            <BiWindowClose size={20} />
          </button>
        </div>


        {/* -------Desktop Nav---------- */}
        <div className="hidden lg:flex items-center space-x-8 text-base">
          <Link
            to="/"
            className={`flex items-center space-x-1 font-medium ${isActive("/")} transition-colors duration-200 hover:scale-105`}
          >
            <GoHome />
            <span>Home</span>
          </Link>
          
          <Link
            to="/explore"
            className={`flex items-center space-x-1 font-medium ${isActive("/explore")} transition-colors duration-200 hover:scale-105`}
          >
            <ImMusic />
            <span>Songs</span>
          </Link>
          
          <Link
            to="/upload"
            className={`flex items-center space-x-1 font-medium ${isActive("/upload")} transition-colors duration-200 hover:scale-105`}
          >
            <TfiWrite />
            <span>Upload</span>
          </Link>
          
          <Link
            to="/playlists"
            className={`flex items-center space-x-1 font-medium ${isActive("/playlists")} transition-colors duration-200 hover:scale-105`}
          >
            <CgPlayList />
            <span>Playlists</span>
          </Link>

          {token ? (
            <button
              onClick={logOut}
              className="bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-1.5 rounded-md shadow-md text-white font-medium text-sm hover:shadow-lg hover:from-rose-600 hover:to-pink-700 transform transition-all"
            >
              Log Out
            </button>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to={"/login"}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-1.5 rounded-md shadow-md text-white font-medium text-sm hover:shadow-lg hover:from-indigo-600 hover:to-purple-700 transform transition-all"
              >
                Log In
              </Link>
              <Link
                to={"/register"}
                className="bg-gradient-to-r from-lime-400 to-emerald-400 px-6 py-1.5 rounded-md shadow-md text-gray-800 font-medium text-sm hover:shadow-lg hover:from-lime-500 hover:to-emerald-500 transform transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;