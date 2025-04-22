import React, { useState, useContext } from "react";
import axios from "axios";  
import { SongContext } from "../Context/SongContext";
import playlist from "../assets/playlist.jpg";
import { CgPlayListAdd } from "react-icons/cg";
import { Link } from "react-router-dom";
import { FetchContext } from "../Context/FetchContext";
import { QueueContext } from "../Context/QueueContex";
import { MdPlaylistPlay } from "react-icons/md";

const PlaylistCard = ({ playlistName, playlistId, noSongs }) => {
    const { setFetchPlaylist } = useContext(FetchContext)
    const { song, songList, setSongList, __URL__ } = useContext(SongContext)
    const { list, dispatchList } = useContext(QueueContext)

    const [loading, setLoading] = useState(false)
    const [isHovered, setIsHovered] = useState(false);

    // Adding song to playlist
    const addSongToPlaylist = async () => {
      if(list.length === 0) return alert("Please select a song");
      setLoading(true)
      const headers = {
          "Content-Type": "application/json",
          "X-Auth-Token": localStorage.getItem("access_token"),
      };
      try {
        const { data, status } = await axios.post(
          `${__URL__}/api/v1/playlist/add/${playlistId}`, 
          list, 
          { headers }
        );
        if(status === 200){
            alert("Song added to playlist")
            setFetchPlaylist(prev => !prev)
            dispatchList({type:"REMOVE_SONG", payload:list[0]['title']})
        }
      } catch (error) {
        console.error("Error adding song to playlist:", error);
        alert("Failed to add song to playlist");
      } finally {
        setLoading(false)
      }
    }

  return (
    <div 
      className="bg-gray-800/70 backdrop-blur-sm rounded-lg p-4 mb-4 border border-gray-700/50 shadow-md hover:bg-gray-700/70 transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <Link 
          to={`/playlist/${playlistId}`} 
          className="flex items-center space-x-4 flex-1"
        >
          <div className="relative min-w-[60px] w-14 h-14 lg:w-16 lg:h-16 rounded-lg overflow-hidden">
            <img 
              src={playlist} 
              alt={playlistName} 
              className="w-full h-full object-cover"
            />
            {isHovered && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <MdPlaylistPlay size={30} className="text-lime-400" />
              </div>
            )}
          </div>
          
          <div className="flex flex-col">
            <p className="text-white font-medium text-lg truncate max-w-[180px] lg:max-w-xs">
              {playlistName}
            </p>
            <p className="text-gray-400 text-sm">
              {noSongs} {noSongs === 1 ? 'song' : 'songs'}
            </p>
          </div>
        </Link>
        
        <button 
          onClick={addSongToPlaylist}
          disabled={loading || list.length === 0}
          className={`p-2 rounded-full ${
            list.length === 0 
              ? 'text-gray-500 cursor-not-allowed' 
              : 'text-lime-400 hover:bg-gray-700/90 hover:scale-110 transition-all'
          }`}
          title="Add song to this playlist"
        >
          <CgPlayListAdd size={30} />
        </button>
      </div>
    </div>
  );
};

export default PlaylistCard;