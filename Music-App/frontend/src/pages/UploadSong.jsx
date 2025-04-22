import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { SidebarContext } from "../Context/SibebarContext";
import { useNavigate } from "react-router-dom";
import { SongContext } from "../Context/SongContext";
import { FiUpload } from "react-icons/fi";
import { MdAudioFile } from "react-icons/md";

const UploadSong = () => {
  const navigate = useNavigate();
  const { showMenu, setShowMenu } = useContext(SidebarContext);
  const { __URL__ } = useContext(SongContext);
  
  useEffect(() => {
    if (showMenu) setShowMenu(false);
  }, []);

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("No file selected");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("album", album);
    formData.append("description", description);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
        "x-auth-token": localStorage.getItem("access_token"),
      },
    };
    
    try {
      const result = await axios.post(
        `${__URL__}/api/v1/song/upload`,
        formData,
        config
      );

      if (result.status === 201) {
        navigate("/explore");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-5 lg:px-0"
      style={{
        background: "linear-gradient(135deg, #1a1035 0%, #341b55 50%, #45277a 100%)",
      }}>
      <div className="max-w-3xl mx-auto bg-gray-900/60 backdrop-blur-sm rounded-xl shadow-2xl p-6 lg:p-10 border border-gray-800/50">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center mb-4 p-3 rounded-full bg-purple-500/20">
            <FiUpload className="text-3xl text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white lg:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-lime-300 to-cyan-400">Upload Song</h1>
          <p className="text-gray-300 mt-2">Share your music with the world</p>
        </div>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-6"
        >
          <div className="space-y-5">
            {/* Title Input */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-300 mb-1 block" htmlFor="title">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                placeholder="Enter the song title"
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Artist Input */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-300 mb-1 block" htmlFor="artist">
                Artist
              </label>
              <input
                type="text"
                name="artist"
                id="artist"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                placeholder="Enter artist name"
                onChange={(e) => setArtist(e.target.value)}
                required
              />
            </div>

            {/* Album Input */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-300 mb-1 block" htmlFor="album">
                Album
              </label>
              <input
                type="text"
                name="album"
                id="album"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                placeholder="Enter album name"
                onChange={(e) => setAlbum(e.target.value)}
                required
              />
            </div>

            {/* Description Input */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-300 mb-1 block" htmlFor="description">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows="3"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                placeholder="Enter a description for your song"
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* File Input */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-300 mb-1 block" htmlFor="audioFile">
                Audio File
              </label>
              <div className="flex flex-col">
                <label className="cursor-pointer bg-gray-800/70 border border-gray-700 rounded-lg p-5 text-center hover:bg-gray-800 transition-colors">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <MdAudioFile className="text-3xl text-purple-400" />
                    <span className="text-sm font-medium text-gray-300">
                      {file ? 'Change file' : 'Select audio file'}
                    </span>
                    <span className="text-xs text-gray-500">{fileName}</span>
                  </div>
                  <input
                    onChange={handleFileChange}
                    type="file"
                    name="file"
                    id="audioFile"
                    accept="audio/*"
                    className="hidden"
                    required
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              className={`px-8 py-3 rounded-lg font-medium text-center flex items-center justify-center space-x-2 transition-all ${
                localStorage.getItem("access_token")
                  ? "bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-500 hover:to-emerald-500 text-gray-900"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
              type="submit"
              disabled={!localStorage.getItem("access_token") || isUploading}
            >
              {isUploading ? (
                <span>Uploading...</span>
              ) : (
                <>
                  <FiUpload />
                  <span>Upload Song</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadSong;