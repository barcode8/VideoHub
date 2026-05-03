import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar.jsx';
import VideoCard from '../VideoCard/VideoCard.jsx';
import { VideoSkeleton } from '../Skeleton/VideoSkeleton.jsx';
import { useUserProfile } from '../../hooks/User/useUserProfile.js';

export default function UserProfile() {
    const { username } = useParams();
    
    // Destructure all our states from the custom hook
    const { 
        loading, 
        error, 
        channel, 
        isSubscribed, 
        videoLoading, 
        videoError, 
        channelVideos 
    } = useUserProfile(username);

    return (
        <div className="flex h-screen bg-[#0f0f0f] text-white overflow-hidden">
            {/* Sidebar fixed to the left */}
            <Sidebar />

            {/* Main Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto pb-10">
                
                {/* 1. OVERALL PROFILE ERROR */}
                {error && (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-red-500 text-lg font-medium bg-red-500/10 px-6 py-3 rounded-lg">
                            {error}
                        </p>
                    </div>
                )}

                {/* 2. PROFILE SKELETON (While fetching channel data) */}
                {loading && (
                    <div className="w-full animate-pulse">
                        <div className="w-full h-48 md:h-72 bg-zinc-800"></div>
                        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6 flex gap-6">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-zinc-800 shrink-0"></div>
                            <div className="flex-1 mt-4">
                                <div className="h-8 bg-zinc-800 rounded w-1/3 mb-3"></div>
                                <div className="h-4 bg-zinc-800 rounded w-1/4"></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. LOADED PROFILE DATA */}
                {!loading && !error && channel && (
                    <div className="w-full">
                        {/* Cover Image */}
                        <div className="w-full h-48 md:h-72 bg-zinc-800 relative">
                            {channel.coverImage ? (
                                <img 
                                    src={channel.coverImage} 
                                    alt="Cover" 
                                    className="w-full h-full object-cover" 
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-500">
                                    No Cover Image
                                </div>
                            )}
                        </div>

                        {/* Profile Info Header */}
                        <div className="max-w-7xl mx-auto px-4 md:px-8">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mt-6">
                                <img 
                                    src={channel.avatar || 'https://via.placeholder.com/150'} 
                                    alt={channel.fullName} 
                                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-[#0f0f0f] object-cover bg-zinc-900 shrink-0" 
                                />
                                
                                <div className="flex-1 text-center sm:text-left mt-2 sm:mt-4">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                                        {channel.fullName}
                                    </h1>
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1.5 text-zinc-400 font-medium text-sm sm:text-base">
                                        <span>@{channel.username}</span>
                                        <span className="hidden sm:inline">•</span>
                                        <span>{channel.subscribersCount || 0} subscribers</span>
                                        <span className="hidden sm:inline">•</span>
                                        <span>{channel.channelsSubscribedToCount || 0} subscribed</span>
                                    </div>
                                </div>

                                {/* Subscribe Button */}
                                <div className="mt-4 sm:mt-6 shrink-0">
                                    <button
                                        className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md ${
                                            isSubscribed 
                                                ? "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700" 
                                                : "bg-white hover:bg-zinc-200 text-black"
                                        }`}
                                    >
                                        {isSubscribed ? "Subscribed" : "Subscribe"}
                                    </button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="mt-8 border-b border-zinc-800">
                                <nav className="flex gap-8 px-2">
                                    <button className="pb-3 border-b-2 border-white text-white font-medium px-1">
                                        Videos
                                    </button>
                                    <button className="pb-3 border-b-2 border-transparent text-zinc-400 hover:text-white font-medium px-1 transition-colors">
                                        Playlists
                                    </button>
                                </nav>
                            </div>

                            {/* 4. VIDEO GRID SECTION */}
                            <div className="mt-6">
                                
                                {/* Video Error State */}
                                {videoError && (
                                    <div className="py-10 text-center text-red-400 bg-red-500/10 rounded-xl">
                                        {videoError}
                                    </div>
                                )}

                                {/* Video Loading Skeletons */}
                                {videoLoading && !videoError && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
                                        {Array(6).fill(0).map((_, i) => (
                                            <VideoSkeleton key={i} />
                                        ))}
                                    </div>
                                )}

                                {/* Loaded Videos */}
                                {!videoLoading && !videoError && channelVideos && (
                                    <>
                                        {channelVideos.length > 0 ? (
                                            /* Exactly 3 columns on large screens */
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
                                                {channelVideos.map((video) => (
                                                    <VideoCard 
                                                        key={video._id} 
                                                        video={video} 
                                                        hideAvatar={true} // Optional: Cleaner since we are already on their channel
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            /* Empty State */
                                            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                                                <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-lg font-medium text-zinc-400">This channel has no videos.</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}