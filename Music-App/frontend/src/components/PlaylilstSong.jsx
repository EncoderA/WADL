import React from "react";
import { useContext, useState } from "react";
import axios from 'axios';
import { SongContext } from "../Context/SongContext";
import { decodeToken } from "react-jwt";
import musicbg from "../assets/musicbg.jpg";
import { useNavigate } from "react-router-dom";
import { CgRemoveR } from 'react-icons/cg';
import { BsPlayFill } from 'react-icons/bs';
import { FetchContext } from "../Context/FetchContext";

const PlaylilstSong = ({ title, artistName, songSrc, playlistId, index }) => {
  const { song, audio, __URL__ } = useContext(SongContext);
  const { setFetchPlaylist } = useContext(FetchContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const decoded = decodeToken(token);
  const [isHovered, setIsHovered] = useState(false);
 
  // Play the song when the user clicks on the song card
  const handlePlay = () => {
    audio.pause();
    audio.src = `${__URL__}/api/v1/stream/${songSrc}`;
    song.songName = title;
    song.songArtist = artistName;
    song.songUrl = songSrc;
    audio.load();
    audio.play();
    song.setIsPlaying(true);
  };

  const headers = {
    "Content-Type": "application/json",
    "x-auth-token": localStorage.getItem("access_token"),
  };

  const removeSong = async () => {
    try {
      const { status } = await axios.delete(
        `${__URL__}/api/v1/playlist/remove/${playlistId}?song=${title}`,
        { headers }
      );
      
      if(status === 200){
        alert('Song removed from the playlist');
        setFetchPlaylist(prev => !prev);
      }
    } catch (error) {
      console.error("Error removing song:", error);
      alert("Failed to remove song");
    }
  };

  // remove the song from playlist
  const handleRemove = () => {
    if (window.confirm('Are you sure you want to remove this song from the playlist?')) {
      removeSong();
    }
  };

  return (
    <div 
      className="flex relative bg-gray-800/80 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700/50 hover:bg-gray-700/80 transition-all duration-200 p-2 lg:p-3 mx-auto w-full max-w-4xl mb-3 shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center w-full justify-between">
        <div className="flex items-center space-x-4 cursor-pointer" onClick={handlePlay}>
          <div className="flex items-center">
            {index && (
              <span className="text-gray-400 w-6 text-center mr-2">{index}</span>
            )}
            <div className="relative min-w-[60px] w-16 h-16 rounded-md overflow-hidden">
              <img src={musicbg} alt={title} className="w-full h-full object-cover" />
              {isHovered && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <BsPlayFill size={30} className="text-lime-400" />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="text-white font-medium truncate max-w-[180px] lg:max-w-xs">{title}</div>
            <div className="text-gray-400 text-sm truncate">{artistName}</div>
          </div>
        </div>

        <button
          onClick={handleRemove}
          className="text-gray-400 hover:text-rose-400 transition-colors p-2 rounded-full hover:bg-gray-700/70"
          title="Remove from playlist"
        >
          <CgRemoveR size={20} />
        </button>
      </div>
    </div>
  );
};

export default PlaylilstSong;