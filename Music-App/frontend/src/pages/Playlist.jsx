import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FetchContext } from "../Context/FetchContext";
import { SongContext } from "../Context/SongContext";
import PlaylilstSong from "../components/PlaylilstSong";
import { MdDeleteForever, MdPlaylistPlay } from "react-icons/md";

const Playlist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playList, setPlayList] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetchPlaylist } = useContext(FetchContext);
  const { __URL__ } = useContext(SongContext);
  
  const headers = {
    "Content-Type": "application/json",
    "X-Auth-Token": localStorage.getItem("access_token"),
  };

  const deletePlaylist = async () => {
    setLoading(true);
    try {
      const { status } = await axios.delete(
        `${__URL__}/api/v1/playlist/delete/${id}`,
        { headers }
      );
      if (status === 200) {
        setLoading(false);
        navigate("/playlists");
      }
    } catch (error) {
      console.error("Failed to delete playlist:", error);
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      deletePlaylist();
    }
  };

  const getPlaylist = async () => {
    try {
      const { data } = await axios.get(
        `${__URL__}/api/v1/playlist/${id}`,
        { headers }
      );
      setPlayList(data["playlist"]);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch playlist:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPlaylist();
  }, [fetchPlaylist]);

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{
        background: "linear-gradient(135deg, #1a1035 0%, #341b55 50%, #45277a 100%)",
      }}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400"></div>
          <p className="mt-4 text-white">Loading playlist...</p>
        </div>
      ) : playList ? (
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-800/50 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center">
                <div className="bg-purple-600/30 p-4 rounded-xl mr-4">
                  <MdPlaylistPlay size={40} className="text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lime-300 to-cyan-400">
                    {playList.playlistName}
                  </h2>
                  <p className="text-gray-300 mt-1">
                    {playList.songs.length} {playList.songs.length === 1 ? 'Song' : 'Songs'}
                  </p>
                </div>
              </div>
              <button 
                onClick={handleDelete}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 p-2.5 rounded-lg transition-all flex items-center"
              >
                <MdDeleteForever size={24} />
                <span className="ml-2">Delete Playlist</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {playList.songs.length === 0 ? (
              <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl shadow-lg p-10 text-center border border-gray-800/50">
                <p className="text-gray-300 text-lg">This playlist is empty</p>
                <button 
                  onClick={() => navigate('/explore')}
                  className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all"
                >
                  Browse Songs
                </button>
              </div>
            ) : (
              playList.songs.map((song, index) => (
                <PlaylilstSong
                  key={index}
                  title={song.title}
                  artistName={song.artistName}
                  songSrc={song.songSrc}
                  playlistId={id}
                  index={index + 1}
                />
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto bg-gray-900/60 backdrop-blur-sm rounded-xl shadow-lg p-10 text-center border border-gray-800/50">
          <p className="text-red-400 text-lg">Playlist not found</p>
          <button 
            onClick={() => navigate('/playlists')}
            className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all"
          >
            Back to Playlists
          </button>
        </div>
      )}
    </div>
  );
};

export default Playlist;