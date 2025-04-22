import React, { useRef, useState, useEffect, useContext } from "react";
import stereo from "./assets/stereo.jpg";
import { SongContext } from "./Context/SongContext";
import { BsFillPlayCircleFill } from "react-icons/bs";
import { BiSkipNextCircle, BiSkipPreviousCircle } from "react-icons/bi";
import { HiPause } from "react-icons/hi";
import { QueueContext } from "./Context/QueueContex";

const MusicPlayer = () => {
  // References
  const audioRef = useRef(null);
  const progressBar = useRef(null);
  const animationRef = useRef(null);

  // Contexts
  const { song, audio, __URL__ } = useContext(SongContext);
  const { queue } = useContext(QueueContext);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  // When the component mounts, setup audio event listeners
  useEffect(() => {
    const audioElement = audioRef.current;
    
    const handleLoadedData = () => {
      const seconds = Math.floor(audioElement.duration);
      setDuration(seconds);
      if (progressBar.current) {
        progressBar.current.max = seconds;
      }
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
      if (progressBar.current) {
        progressBar.current.value = audioElement.currentTime;
        changePlayerCurrentTime();
      }
    };
    
    const handleEnded = () => {
      // When song ends, play the next one if available
      nextSong();
    };
    
    // Add event listeners
    audioElement.addEventListener("loadeddata", handleLoadedData);
    audioElement.addEventListener("timeupdate", handleTimeUpdate);
    audioElement.addEventListener("ended", handleEnded);
    
    // Cleanup function
    return () => {
      audioElement.removeEventListener("loadeddata", handleLoadedData);
      audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      audioElement.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Update player state when song changes
  useEffect(() => {
    if (song && song.songUrl) {
      // If we have a new song, update our audio element
      audioRef.current.src = `${__URL__}/api/v1/stream/${song.songUrl}`;
      audioRef.current.load();
      
      // If we should auto-play
      if (song.isPlaying) {
        audioRef.current.play().catch(err => console.error("Error playing audio:", err));
        setIsPlaying(true);
      }
    }
  }, [song?.songUrl]);

  // Sync isPlaying state with song context
  useEffect(() => {
    setIsPlaying(song?.isPlaying || false);
  }, [song?.isPlaying]);

  const togglePlayPause = () => {
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);
    
    // Update context state
    if (song && song.setIsPlaying) {
      song.setIsPlaying(newIsPlaying);
    }
    
    if (newIsPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  const calculateTime = (secs) => {
    if (!secs || isNaN(secs)) return "00:00";
    
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const changeRange = () => {
    if (audioRef.current && progressBar.current) {
      audioRef.current.currentTime = progressBar.current.value;
      changePlayerCurrentTime();
    }
  };

  const changePlayerCurrentTime = () => {
    if (progressBar.current && duration) {
      progressBar.current.style.setProperty(
        "--seek-before-width",
        `${(progressBar.current.value / duration) * 100}%`
      );
      setCurrentTime(progressBar.current.value);
    }
  };

  // Get the queue array
  const getQueueSongs = () => {
    // Start with current song if available
    const songs = [];
    
    if (song && song.songUrl) {
      songs.push({
        url: song.songUrl,
        name: song.songName || "Unknown Song",
        artist: song.songArtist || "Unknown Artist"
      });
    }
    
    // Add queue songs if available
    if (queue && queue.length > 0) {
      queue.forEach(queueSong => {
        songs.push({
          url: queueSong.songSrc,
          name: queueSong.title || "Unknown Song",
          artist: queueSong.artistName || "Unknown Artist"
        });
      });
    }
    
    return songs;
  };

  // Next Song
  const nextSong = () => {
    // Get all available songs
    const songs = getQueueSongs();
    
    // If no songs or only one song, don't do anything
    if (songs.length <= 1) return;
    
    // Calculate next song index (loop back to beginning if at end)
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    
    // Get next song data
    const nextSongData = songs[nextIndex];
    
    // Update context if available
    if (song) {
      if (song.setSongName) song.setSongName(nextSongData.name);
      if (song.setArtistName) song.setArtistName(nextSongData.artist);
      if (song.setSongUrl) song.setSongUrl(nextSongData.url);
      if (song.setIsPlaying) song.setIsPlaying(true);
    }
    
    // Update audio source and play
    audioRef.current.src = `${__URL__}/api/v1/stream/${nextSongData.url}`;
    audioRef.current.load();
    audioRef.current.play().catch(err => console.error("Error playing next song:", err));
    setIsPlaying(true);
  };

  // Previous Song
  const previousSong = () => {
    // Get all available songs
    const songs = getQueueSongs();
    
    // If no songs or only one song, don't do anything
    if (songs.length <= 1) return;
    
    // Calculate previous song index (go to last song if at beginning)
    const prevIndex = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
    setCurrentSongIndex(prevIndex);
    
    // Get previous song data
    const prevSongData = songs[prevIndex];
    
    // Update context if available
    if (song) {
      if (song.setSongName) song.setSongName(prevSongData.name);
      if (song.setArtistName) song.setArtistName(prevSongData.artist);
      if (song.setSongUrl) song.setSongUrl(prevSongData.url);
      if (song.setIsPlaying) song.setIsPlaying(true);
    }
    
    // Update audio source and play
    audioRef.current.src = `${__URL__}/api/v1/stream/${prevSongData.url}`;
    audioRef.current.load();
    audioRef.current.play().catch(err => console.error("Error playing previous song:", err));
    setIsPlaying(true);
  };

  return (
    <div className="fixed bg-gray-900/95 backdrop-blur-lg bottom-0 right-0 left-0 px-5 py-3 flex justify-between items-center shadow-lg border-t border-gray-800/50">
      <div className="flex items-center space-x-4">
        {/* Image */}
        <img 
          src={song.songImage || stereo} 
          alt={song.songName || "Music"} 
          className="rounded-lg w-12 h-12 object-cover shadow-md" 
        />
        
        {/* Song Name and Artist Name */}
        <div className="flex flex-col">
          <h3 className="text-white font-medium truncate max-w-[120px] lg:max-w-xs">
            {song.songName || "No song selected"}
          </h3>
          <p className="text-gray-400 text-sm truncate">
            {song.songArtist || "Artist"}
          </p>
        </div>
      </div>

      {/* Audio tag */}
      <audio ref={audioRef} preload="metadata" />

      {/* Controls and Progress */}
      <div className="flex flex-col items-center space-y-2 flex-1 max-w-xl mx-8">
     
        <div className="flex justify-center items-center space-x-4">
          {/* backward */}
          <button 
            onClick={previousSong} 
            className="text-gray-300 hover:text-lime-400 transition-colors"
          >
            <BiSkipPreviousCircle size={34} />
          </button>

          <button 
            onClick={togglePlayPause}
            className="bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-500 hover:to-emerald-500 text-gray-900 p-2 rounded-full flex items-center justify-center transition-transform hover:scale-110"
          >
            {isPlaying ? (
              <HiPause size={24} />
            ) : (
              <BsFillPlayCircleFill size={24} />
            )}
          </button>

          <button 
            onClick={nextSong}
            className="text-gray-300 hover:text-lime-400 transition-colors"
          >
            <BiSkipNextCircle size={34} />
          </button>
        </div>
        
        <div className="hidden lg:flex items-center space-x-3 w-full">
          <span className="text-xs text-gray-400 min-w-[40px] text-right">
            {calculateTime(currentTime)}
          </span>
          
          <div className="w-full relative">
            <input
              type="range"
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-lime-400"
              value={currentTime}
              min="0"
              max={duration || 100}
              ref={progressBar}
              onChange={changeRange}
            />
          </div>
          
          <span className="text-xs text-gray-400 min-w-[40px]">
            {duration && !isNaN(duration) ? calculateTime(duration) : "--:--"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;