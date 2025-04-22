import React, { useState, useEffect, useRef, useContext } from "react";
import stereo from "../assets/stereo.jpg";
import { SongContext } from "../Context/SongContext";

import { CiPlay1, CiPause1 } from "react-icons/ci";
import { FiSkipBack, FiSkipForward } from "react-icons/fi";

const AudioPlayer = () => {
  const { song, audio } = useContext(SongContext);
 
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const progressBar = useRef();
 
  useEffect(() => {
    const setupAudio = () => {
      if (audio.duration) {
        setDuration(audio.duration);
        if (progressBar.current) {
          progressBar.current.max = audio.duration;
        }
      }
    };

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      if (progressBar.current && audio.duration) {
        progressBar.current.value = audio.currentTime;
      }
    };

    audio.addEventListener("loadedmetadata", setupAudio);
    audio.addEventListener("timeupdate", updateTime);
    
    // Run once in case audio is already loaded
    setupAudio();

    return () => {
      audio.removeEventListener("loadedmetadata", setupAudio);
      audio.removeEventListener("timeupdate", updateTime);
    };
  }, [audio]);

  // Handle progress change
  const handleProgressChange = (e) => {
    const newTime = e.target.value;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (song.songUrl === "") return;
    if (audio.paused) audio.play();
    else audio.pause();
    song.setIsPlaying(!song.isPlaying);
  };

  // Calculate time
  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  return (
    <div
      className="fixed flex justify-between items-center bottom-0 right-0 left-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white px-2 lg:px-2  py-3 shadow-xl border-t border-gray-800/50"
    >
      {/* Song Info */}
      <div className="flex space-x-3 lg:space-x-2 items-center">
        <img src={song.songImage || stereo} alt={song.songName || "Music"} className="rounded-lg w-12 h-12 object-cover shadow-lg" />
        <div>
          <h3 className="text-base font-medium text-white truncate max-w-[120px] lg:max-w-xs">
            {song.songName || "No song selected"}
          </h3>
          <p className="text-xs text-gray-300 truncate">
            {song.songArtist || "Artist"}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col -space-x-8 items-center space-y-1">
        <div className="flex items-center space-x-5 lg:space-x-6">
          <button className="text-gray-300 hover:text-lime-400 transition-colors text-xl">
            <FiSkipBack />
          </button>
          <button 
            onClick={togglePlayPause}
            className="bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-500 hover:to-emerald-500 text-gray-900 p-2 rounded-full flex items-center justify-center transition-transform hover:scale-110"
          >
            {song.isPlaying ? <CiPause1 size={24} /> : <CiPlay1 size={24} />}
          </button>
          <button className="text-gray-300 hover:text-lime-400 transition-colors text-xl">
            <FiSkipForward />
          </button>
        </div>
        
        {/* Progress Bar - always visible but adapts for smaller screens */}
        <div className="hidden lg:flex items-center space-x-3 w-80">
          <span className="text-xs text-gray-400 font-medium min-w-[40px]">
            {calculateTime(parseInt(currentTime))}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            ref={progressBar}
            onChange={handleProgressChange}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-lime-400"
            step="any"
          />
          <span className="text-xs text-gray-400 font-medium min-w-[40px]">
            {calculateTime(parseInt(duration))}
          </span>
        </div>
      </div>

      {/* Volume Control - visible only on large screens */}
      <div className="hidden lg:flex items-center space-x-3">
        <span className="text-xs font-medium text-gray-400">
          {calculateTime(parseInt(currentTime))}/{calculateTime(parseInt(duration))}
        </span>
      </div>
    </div>
  );
};

export default AudioPlayer;