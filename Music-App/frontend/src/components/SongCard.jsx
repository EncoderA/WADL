// This component is used to display the song card in the home page and the playlist page. The song card is used to display the song name, artist name, and the options to play, add to queue, add to playlist, and delete the song. The song card is also used to play the song when the user clicks on the song card.

//Importing libraries
import React from "react";
import { useContext, useState } from "react";
import axios from "axios";
import { decodeToken } from "react-jwt";
import { useNavigate } from "react-router-dom";

//Importing context
import { SongContext } from "../Context/SongContext";
import { FetchContext } from "../Context/FetchContext";
import { QueueContext } from "../Context/QueueContex";

//Importing icons
import { SlOptionsVertical } from "react-icons/sl";
import { MdDeleteOutline, MdOutlinePlaylistAdd, MdQueuePlayNext } from 'react-icons/md'
import { BsPlayFill } from 'react-icons/bs';
import musicbg from "../assets/musicbg.jpg";


const SongCard = ({ title, artistName, songSrc, userId, songId, file }) => {

  // Using context
  const { song, audio, __URL__ } = useContext(SongContext);
  const { setFetchSong } = useContext(FetchContext);
  const { dispatchQueue, dispatchList } = useContext(QueueContext)
  const navigate = useNavigate(); // Used to navigate to the playlist page

  const token = localStorage.getItem("access_token");
  let decoded;
  if (token) { decoded = decodeToken(token) };

  const [showOptions, setShowOptions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Display the options
  const displayOptions = () => {
    setShowOptions((prev) => !prev);
  };

  // Play the song when the user clicks on the song card
  const handlePlay = () => {
    song.setSongName(title);
    song.setArtistName(artistName);
    song.setSongUrl(`${__URL__}/api/v1/stream/${songSrc}`);
    audio.src = `${__URL__}/api/v1/stream/${songSrc}`;
    audio.load();
    audio.play();
    song.setIsPlaying(true)
  };

  const headers = {
    "x-auth-token": localStorage.getItem("access_token"),
  };
  // Delete the song
  const deleteSong = async () => {
    try {
      const { status } = await axios.delete(
        `${__URL__}/api/v1/song/delete/${songId}?file=${file}`,
        {
          headers,
        }
      );
      if (status === 200) setFetchSong(prev => !prev);
    } catch (error) {
      console.error("Error deleting song:", error);
    }
  };
  
  const handleDelete = () => {
    confirm("Are you sure you want to delete this song?") && 
    deleteSong();
  };

  // Add the song to the playlist
  const handleAddToPlaylist = () => {
    dispatchList({ type: 'ADD_SONG', payload: { title, artistName, songSrc } })
    navigate("/playlists");
  };

  //Play the song next
  const handlePlayNext = () => {
    dispatchQueue({ type: 'ADD_TO_QUEUE', payload: { title, artistName, songSrc } })
  };

  return (
    <div 
      className="relative flex items-center bg-gray-800/80 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700/50 hover:bg-gray-700/80 transition-all duration-200 p-2 lg:p-3 mx-auto w-full max-w-3xl mb-3 shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        onClick={handlePlay} 
        className="flex items-center space-x-4 cursor-pointer flex-1"
      >
        <div className="relative min-w-[60px] w-16 h-16 rounded-md overflow-hidden">
          <img src={musicbg} alt={title} className="w-full h-full object-cover" />
          {isHovered && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <BsPlayFill size={30} className="text-lime-400" />
            </div>
          )}
        </div>
        
        <div className="flex flex-col">
          <div className="text-white font-medium truncate">{title}</div>
          <div className="text-gray-400 text-sm truncate">{artistName}</div>
        </div>
      </div>

      {/* Desktop Options */}
      <div className="hidden lg:flex items-center space-x-4 px-4">
        <button 
          onClick={handleAddToPlaylist} 
          className="text-gray-300 hover:text-lime-400 transition-colors p-1.5 hover:bg-gray-700/50 rounded-full"
          title="Add to playlist"
        >
          <MdOutlinePlaylistAdd size={24} />
        </button>
        
        <button 
          onClick={handlePlayNext}
          className="text-gray-300 hover:text-lime-400 transition-colors p-1.5 hover:bg-gray-700/50 rounded-full"
          title="Play next"
        >
          <MdQueuePlayNext size={20} />
        </button>
        
        {decoded && decoded.id === userId && (
          <button 
            onClick={handleDelete} 
            className="text-gray-300 hover:text-rose-400 transition-colors p-1.5 hover:bg-gray-700/50 rounded-full"
            title="Delete song"
          >
            <MdDeleteOutline size={20} />
          </button>
        )}
      </div>

      {/* Mobile Options */}
      <div className="block lg:hidden">
        <button
          onClick={displayOptions}
          className="p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-full transition-colors"
        >
          <SlOptionsVertical size={16} />
        </button>
        
        {showOptions && (
          <div className="absolute right-0 top-full mt-1 z-10 w-40 bg-gray-900/95 backdrop-blur-sm rounded-md shadow-lg border border-gray-700/50 overflow-hidden">
            <div className="py-1">
              <button 
                onClick={handleAddToPlaylist} 
                className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
              >
                <MdOutlinePlaylistAdd size={18} />
                <span>Add to playlist</span>
              </button>
              
              <button 
                onClick={handlePlayNext} 
                className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
              >
                <MdQueuePlayNext size={18} />
                <span>Play next</span>
              </button>
              
              {decoded && decoded.id === userId && (
                <button 
                  onClick={handleDelete} 
                  className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-gray-800 transition-colors"
                >
                  <MdDeleteOutline size={18} />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongCard;