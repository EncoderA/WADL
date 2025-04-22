import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import SongCard from "../components/SongCard";
import { SidebarContext } from "../Context/SibebarContext";
import { FetchContext } from "../Context/FetchContext";
import { SongContext } from "../Context/SongContext";
import { QueueContext } from "../Context/QueueContex";

const Songs = () => {
  const { showMenu, setShowMenu } = useContext(SidebarContext);
  const {fetchSong} = useContext(FetchContext)
  const {queue,list} = useContext(QueueContext)
  const {__URL__} = useContext(SongContext)
  
  const [loading, setLoading] = useState(false);
  const [songs, setSongs] = useState(null);

  useEffect(() => {
    if (showMenu) setShowMenu(false);
    const fetchSongs = async () => {
      const { data } = await axios.get(`${__URL__}/api/v1/songs`);
      setSongs(data["songs"]);
    };
    setLoading(true);
    fetchSongs();

    setLoading(false);
  }, [fetchSong]);
 
  const closeMenu = () => {
    setShowMenu(false); 
  };

  return (
    <div onClick={closeMenu} style={{
        background: "linear-gradient(135deg, #1a1035 0%, #341b55 50%, #45277a 100%)",
      }} className=" p-5 space-y-2 min-h-screen">
      {loading && songs == null ? (
        <div>loading...</div>
      ) : !loading && songs != null ? (
        songs.map((song,index) => {
          return (
            <SongCard
              key={song._id}
              title={song.title}
              artistName={song.artist}
              songSrc={song.song}
              userId={song.uploadedBy}
              songId = {song._id}
              file = {song.file}
            />
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400"></div>
          <p className="mt-4 text-white">Loading Songs...</p>
        </div>
      )}
    </div>
  );
};

export default Songs;
