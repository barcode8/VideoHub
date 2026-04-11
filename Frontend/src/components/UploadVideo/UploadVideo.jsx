import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function UploadVideo() {
    const [dragActive, setDragActive] = useState(false);
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [draftId, setDraftId] = useState("draft_12345"); // We will populate this via API later

    // Handle drag and drop for the video file
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setVideoFile(e.dataTransfer.files[0]);
            // TODO: Here is where we will trigger the 'initVideoUpload' API call to get the real draftId
        }
    };

    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-4 flex justify-center font-roboto w-full">
            <motion.div
                className="bg-zinc-900 w-full max-w-6xl rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden relative z-10"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/80 sticky top-0 z-20">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Upload Video</h1>
                        <p className="text-zinc-400 text-sm mt-1">Your video will remain private until you hit publish.</p>
                    </div>
                </div>

                <form className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                        
                        {/* LEFT COLUMN: Details (Takes up 3/5 of the space) */}
                        <div className="lg:col-span-3 space-y-8">
                            
                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="text-zinc-200 block mb-2 text-sm font-medium">
                                    Title <span className="text-purple-500">*</span>
                                </label>
                                <motion.textarea
                                    id="title"
                                    rows="2"
                                    placeholder="Add a title that describes your video"
                                    className="w-full bg-zinc-800 text-white placeholder-zinc-500 rounded-xl px-4 py-3 outline-none border border-zinc-700 focus:border-purple-600 focus:shadow-[0_0_15px_rgba(147,51,234,0.15)] transition-all duration-300 resize-none text-lg font-medium"
                                    whileFocus={{ scale: 1.005 }}
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="text-zinc-200 block mb-2 text-sm font-medium">
                                    Description <span className="text-purple-500">*</span>
                                </label>
                                <motion.textarea
                                    id="description"
                                    rows="8"
                                    placeholder="Tell viewers about your video"
                                    className="w-full bg-zinc-800 text-white placeholder-zinc-500 rounded-xl px-4 py-3 outline-none border border-zinc-700 focus:border-purple-600 focus:shadow-[0_0_15px_rgba(147,51,234,0.15)] transition-all duration-300 resize-none custom-scrollbar"
                                    whileFocus={{ scale: 1.005 }}
                                    required
                                />
                            </div>

                            {/* Thumbnail - MASSIVE UPGRADE */}
                            <div>
                                <label className="text-zinc-200 block mb-2 text-sm font-medium">
                                    Thumbnail <span className="text-purple-500">*</span>
                                </label>
                                <p className="text-zinc-500 text-xs mb-4">
                                    Select or upload a picture that shows what's in your video. 
                                </p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Custom Upload Box */}
                                    <div className="relative w-full aspect-video rounded-xl border-2 border-dashed border-zinc-700 hover:border-purple-500 bg-zinc-800/50 flex flex-col items-center justify-center cursor-pointer transition-colors group overflow-hidden shadow-inner">
                                        {thumbnailFile ? (
                                            <img 
                                                src={URL.createObjectURL(thumbnailFile)} 
                                                alt="Thumbnail preview" 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center p-6 text-center">
                                                <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                    <svg className="w-6 h-6 text-zinc-400 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm font-medium text-zinc-300 group-hover:text-purple-300">Upload custom thumbnail</span>
                                                <span className="text-xs text-zinc-500 mt-1">1280x720 recommended</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => setThumbnailFile(e.target.files[0])}
                                        />
                                    </div>

                                    {/* Auto-Generated Placeholder (Will integrate with Cloudinary logic later) */}
                                    <div className="w-full aspect-video rounded-xl border border-zinc-800 bg-zinc-800/30 flex flex-col items-center justify-center opacity-70">
                                        <svg className="w-8 h-8 text-zinc-600 mb-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-zinc-500 text-xs text-center px-4">Auto-generating from video...</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Media & Status (Takes up 2/5 of the space) */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* YouTube-style Video Preview Box */}
                            <div className="bg-zinc-800/50 rounded-xl border border-zinc-700 overflow-hidden sticky top-32">
                                <AnimatePresence mode="wait">
                                    {!videoFile ? (
                                        <motion.div
                                            key="upload-prompt"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className={`aspect-video p-6 flex flex-col items-center justify-center text-center transition-colors ${
                                                dragActive ? "bg-purple-500/10 border-2 border-purple-500" : ""
                                            }`}
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                        >
                                            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                                                <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                            </div>
                                            <p className="text-sm text-zinc-300 font-medium mb-1">Drag and drop video here</p>
                                            <p className="text-xs text-zinc-500 mb-6">MP4, WebM, or OGG</p>
                                            <div className="relative w-full px-8">
                                                <button type="button" className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold px-4 py-3 rounded-xl transition-colors">
                                                    Select File
                                                </button>
                                                <input
                                                    type="file"
                                                    accept="video/*"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    onChange={(e) => {
                                                        if (e.target.files[0]) {
                                                            setVideoFile(e.target.files[0]);
                                                            // TODO: Trigger initVideoUpload API here
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="video-preview"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="aspect-video bg-black flex items-center justify-center relative group"
                                        >
                                            <svg className="w-16 h-16 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                            
                                            {/* Dummy Progress Bar */}
                                            <div className="absolute bottom-0 inset-x-0 h-1.5 bg-zinc-800">
                                                <motion.div 
                                                    className="h-full bg-purple-500" 
                                                    initial={{ width: "0%" }}
                                                    animate={{ width: "100%" }}
                                                    transition={{ duration: 15, ease: "linear" }}
                                                />
                                            </div>

                                            <button 
                                                type="button"
                                                onClick={() => setVideoFile(null)}
                                                className="absolute top-3 right-3 p-2 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Video Status Panel */}
                                <div className="p-5 bg-zinc-800/80 border-t border-zinc-700 space-y-4">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Video Link</span>
                                        <div className="flex items-center justify-between bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-700">
                                            <a href="#" className="text-sm text-purple-400 hover:text-purple-300 truncate font-medium">
                                                {videoFile ? `videohub.com/watch?v=${draftId}` : "Upload to generate link..."}
                                            </a>
                                            {videoFile && (
                                                <button type="button" className="text-zinc-400 hover:text-white p-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Filename</span>
                                        <div className="text-sm text-zinc-200 truncate">
                                            {videoFile ? videoFile.name : "--"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-12 pt-6 border-t border-zinc-800 flex items-center justify-between">
                        <Link to="/" className="text-sm text-zinc-400 hover:text-white transition-colors font-bold uppercase tracking-wider">
                            Cancel
                        </Link>
                        
                        <motion.button
                            type="submit"
                            disabled={!videoFile}
                            className={`bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold px-10 py-3 rounded-xl flex justify-center items-center gap-2 ${!videoFile ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[0_0_20px_rgba(147,51,234,0.4)]'}`}
                            whileHover={videoFile ? { scale: 1.02 } : {}}
                            whileTap={videoFile ? { scale: 0.98 } : {}}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Publish Video
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}