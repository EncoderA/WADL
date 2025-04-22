import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import PlaylistCard from "../components/PlaylistCard";

//Importing Context
import { SidebarContext } from "../Context/SibebarContext";
import { FetchContext } from "../Context/FetchContext";
import { SongContext } from "../Context/SongContext";
import { QueueContext } from "../Context/QueueContex";
import { toast } from "sonner";

import { FiPlus } from "react-icons/fi";
import { MdClose, MdPlaylistAdd } from "react-icons/md";

const CreatePlaylist = () => {
  const { fetchPlaylist, setFetchPlaylist } = useContext(FetchContext);
  const { showMenu, setShowMenu } = useContext(SidebarContext);
  const { __URL__ } = useContext(SongContext);
  const { list } = useContext(QueueContext);
  
  const [createPlaylist, setCreatePlaylist] = useState(false);
  const [playlists, setPlaylists] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playlistName, setPlaylistName] = useState("");

  // Open Create playlist card
  const createCardOpen = () => {
    setCreatePlaylist(true);
  };

  //Close create playlist card
  const createCardClose = () => {
    setCreatePlaylist(false);
    setPlaylistName("");
  };

  let token = localStorage.getItem("access_token") || null;
  const headers = {
    "Content-Type": "application/json",
    "X-Auth-Token": localStorage.getItem("access_token"),
  };

  // Create a playlist
  const handleCreatePlaylist = async () => {
    if(!token) return alert("Please login to create a playlist");
    if (playlistName.trim() === "") return alert("Please enter a playlist name");
    
    setLoading(true);
    try {
      const { data, status } = await axios.post(
        `${__URL__}/api/v1/playlist/create`,
        { playlistName },
        { headers }
      );
      if(status === 200){
        // alert("Playlist created successfully");
        toast.success("Playlist created successfully")
        setCreatePlaylist(false);
        setPlaylistName("");
        setFetchPlaylist(prev => !prev);
        fetchPlaylists();
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
      // alert("Failed to create playlist");
      toast.error("Failed to create playlist")
    } finally {
      setLoading(false);
    }
  };

  // fetching playlists
  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${__URL__}/api/v1/playlist`, {
        headers,
      });
      setPlaylists(data["playlists"]);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showMenu) setShowMenu(false);
    fetchPlaylists();
  }, [fetchPlaylist]);

  return (
    <div 
      className="min-h-screen px-4 py-8 pb-32"
      style={{
        background: "linear-gradient(135deg, #1a1035 0%, #341b55 50%, #45277a 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-lime-300 to-cyan-400">
          Your Playlists
        </h1>

        {/* Playlists Container */}
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400"></div>
              <p className="mt-4 text-white">Loading playlists...</p>
            </div>
          ) : playlists && playlists.length > 0 ? (
            playlists.map((playlist) => (
              <PlaylistCard
                key={playlist._id}
                playlistName={playlist.playlistName}
                playlistId={playlist._id}
                noSongs={playlist.songs.length}
              />
            ))
          ) : (
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg p-10 text-center border border-gray-800/50 shadow-lg">
              <MdPlaylistAdd size={48} className="mx-auto text-gray-500 mb-3" />
              <p className="text-gray-300 text-lg">No playlists found</p>
              <p className="text-gray-400 mt-2">Create your first playlist to start organizing your music</p>
              <button
                onClick={createCardOpen}
                className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all"
              >
                Create Playlist
              </button>
            </div>
          )}
        </div>

        {/* Create playlist floating button */}
        <button
          onClick={createCardOpen}
          className="fixed bottom-24 right-6 bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-500 hover:to-emerald-500 text-gray-900 font-medium rounded-full p-4 shadow-lg flex items-center space-x-2 transition-all hover:scale-105 z-10"
        >
          <FiPlus size={24} />
          <span className="pr-2">Create Playlist</span>
        </button>
      </div>

      {/* Create Playlist Modal */}
      {createPlaylist && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
            <button
              onClick={createCardClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1.5 hover:bg-gray-800/50 rounded-full transition-colors"
              aria-label="Close"
            >
              <MdClose size={20} />
            </button>
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white">Create Playlist</h3>
              <p className="text-gray-400 text-sm mt-1">Enter a name for your new playlist</p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="playlistName" className="text-sm font-medium text-gray-300 mb-1 block">
                Playlist Name
              </label>
              <input
                type="text"
                id="playlistName"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                placeholder="My Awesome Playlist"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                autoFocus
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={createCardClose}
                className="px-5 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePlaylist}
                disabled={loading || playlistName.trim() === ""}
                className={`px-5 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 ${
                  loading || playlistName.trim() === "" 
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed" 
                    : "bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-500 hover:to-emerald-500 text-gray-900"
                }`}
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePlaylist;