import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LuThumbsUp, LuThumbsDown, LuShare2 } from 'react-icons/lu';
import { useWatchVideo } from '../../hooks/Video/useWatchVideo.js';
import VideoCard from '../VideoCard/VideoCard.jsx';

export default function WatchVideo() {
    const { videoId } = useParams();
    
    // Unpack our state from the custom hook
    const { video, recommendedVideos, loading, error } = useWatchVideo(videoId);
    
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    // 🌟 THE NEW SKELETON LOADER
    if (loading) {
        return (
            <div className="bg-black min-h-screen pt-20 px-4 sm:px-6 lg:px-10 xl:px-16 font-roboto">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 w-full max-w-[1700px] mx-auto justify-between animate-pulse">
                    
                    {/* LEFT COLUMN SKELETON */}
                    <div className="flex-1 min-w-0 max-w-[1280px]">
                        {/* Video Player */}
                        <div className="w-full rounded-xl bg-zinc-900 aspect-video"></div>
                        {/* Title */}
                        <div className="h-8 bg-zinc-900 rounded w-3/4 mt-6"></div>
                        
                        {/* Action Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-6 gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-zinc-900"></div>
                                <div className="flex flex-col gap-2">
                                    <div className="h-4 bg-zinc-900 rounded w-32"></div>
                                    <div className="h-3 bg-zinc-900 rounded w-24"></div>
                                </div>
                                <div className="w-24 h-10 md:h-11 rounded-full bg-zinc-900 ml-2"></div>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-32 h-10 rounded-full bg-zinc-900"></div>
                                <div className="w-24 h-10 rounded-full bg-zinc-900"></div>
                            </div>
                        </div>
                        
                        {/* Description Box */}
                        <div className="mt-6 bg-zinc-900 rounded-xl h-24 w-full"></div>
                    </div>

                    {/* RIGHT COLUMN SKELETON (Up Next) */}
                    <div className="w-full lg:w-[350px] xl:w-[400px] shrink-0 flex flex-col gap-4 pb-12">
                        <div className="h-6 bg-zinc-900 rounded w-24 mb-2"></div>
                        <div className="flex flex-col gap-3">
                            {/* Render 6 horizontal skeleton cards */}
                            {Array(6).fill(0).map((_, i) => (
                                <div key={i} className="flex flex-row gap-3">
                                    <div className="w-40 aspect-video rounded-xl bg-zinc-900 shrink-0"></div>
                                    <div className="flex flex-col gap-2 w-full mt-1">
                                        <div className="h-4 bg-zinc-900 rounded w-full"></div>
                                        <div className="h-4 bg-zinc-900 rounded w-2/3"></div>
                                        <div className="h-3 bg-zinc-900 rounded w-1/2 mt-2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !video) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white pt-20">
                <p className="text-xl text-red-500 mb-4">{error || "Video not found"}</p>
                <Link to="/" className="text-purple-400 hover:text-purple-300 underline">Return Home</Link>
            </div>
        );
    }

    // Robust owner extraction with fallback avatars
    const ownerData = Array.isArray(video.ownerDetails) ? video.ownerDetails[0] : 
                      video.ownerDetails || 
                      (typeof video.owner === 'object' ? video.owner : null) || 
                      {};

    const avatarUrl = ownerData?.avatar || `https://ui-avatars.com/api/?name=${ownerData?.username || 'User'}&background=random`;
    const channelName = ownerData?.fullName || ownerData?.username || "Unknown Channel";
    const channelUsername = ownerData?.username || "unknown";

    return (
        <div className="bg-black min-h-screen pt-20 px-4 sm:px-6 lg:px-10 xl:px-16 font-roboto">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 w-full max-w-[1700px] mx-auto justify-between">
                
                {/* LEFT COLUMN: Main Video & Details */}
                <div className="flex-1 min-w-0 max-w-[1280px]">
                    <div className="relative w-full rounded-xl overflow-hidden bg-zinc-900 aspect-video">
                        <video 
                            src={video.videoFile} 
                            poster={video.thumbnail}
                            controls 
                            autoPlay 
                            className="w-full h-full object-contain"
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    <h1 className="text-xl md:text-2xl font-bold text-white mt-4 line-clamp-2">
                        {video.title}
                    </h1>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-4">
                        {/* Channel Info */}
                        <div className="flex items-center gap-4">
                            <Link to={`/channel/${channelUsername}`}>
                                <img 
                                    src={avatarUrl} 
                                    alt={channelUsername}
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover bg-zinc-800"
                                />
                            </Link>
                            <div>
                                <Link to={`/channel/${channelUsername}`}>
                                    <h3 className="text-white font-bold text-sm md:text-base hover:text-pink-500 transition-colors">
                                        {channelName}
                                    </h3>
                                </Link>
                                <p className="text-zinc-400 text-xs md:text-sm">1.2K subscribers</p>
                            </div>
                            <button className="ml-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 px-4 py-2 rounded-full transition-all text-white font-bold text-sm shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                                Subscribe
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
                            <div className="flex bg-zinc-900 rounded-full items-center text-white text-sm font-medium">
                                <button className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-800 rounded-l-full transition-colors border-r border-zinc-700">
                                    <LuThumbsUp size={18} /> {video.likes || 0}
                                </button>
                                <button className="flex items-center px-4 py-2 hover:bg-zinc-800 rounded-r-full transition-colors">
                                    <LuThumbsDown size={18} />
                                </button>
                            </div>
                            <button className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-full font-medium transition-colors text-sm whitespace-nowrap">
                                <LuShare2 size={18} /> Share
                            </button>
                        </div>
                    </div>

                    {/* Description Box */}
                    <div 
                        className={`mt-6 bg-zinc-900 hover:bg-zinc-800 transition-colors rounded-xl p-4 cursor-pointer text-sm ${!isDescriptionExpanded ? 'line-clamp-3' : ''}`}
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    >
                        <div className="font-bold text-white mb-2">
                            {video.views || 0} views • {new Date(video.createdAt).toLocaleDateString()}
                        </div>
                        <p className={`text-zinc-300 whitespace-pre-wrap ${!isDescriptionExpanded ? 'line-clamp-3' : ''}`}>
                            {video.description || "No description provided."}
                        </p>
                    </div>
                </div>

                {/* RIGHT COLUMN: Recommended Videos */}
                <div className="w-full lg:w-[350px] xl:w-[400px] shrink-0 flex flex-col gap-4 pb-12">
                    <h3 className="text-white font-bold text-lg mb-2">Up Next</h3>
                    <div className="flex flex-col gap-3">
                        {recommendedVideos?.map((recVideo) => (
                            <VideoCard 
                                key={recVideo._id} 
                                video={recVideo} 
                                hideAvatar={true} 
                                layout="horizontal"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}