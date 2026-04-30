import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LuPencil, LuTrash2, LuEyeOff, LuEye } from 'react-icons/lu';
import { VideoSkeleton } from '../Skeleton/VideoSkeleton.jsx';
import { formatDuration } from '../../utils/formatTime.js';
import Sidebar from '../Sidebar/Sidebar.jsx';
import { useTogglePublish } from '../../hooks/Video/useTogglePublish.js';
import { useDeleteVideo } from '../../hooks/Video/useDeleteVideo.js';

export default function MyChannel() {
    const { user } = useAuth();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { togglePublish, isToggling } = useTogglePublish();
    
    // 2. Initialize the delete hook
    const { deleteVideo, loading: isDeleting, error: deleteError } = useDeleteVideo();

    useEffect(() => {
        const fetchMyVideos = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/v1/videos?userId=${user?._id}`,
                    { withCredentials: true }
                );
                if (response.data?.success) {
                    setVideos(response.data.data.docs || []);
                }
            } catch (error) {
                console.error("Error fetching channel videos:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchMyVideos();
        }
    }, [user]);

    const handleToggleVisibility = async (video) => {
        const currentState = video.isPublished ? 'Public' : 'Hidden';
        const oppositeState = video.isPublished ? 'Hidden' : 'Public';
        
        if (window.confirm(`Your video is currently ${currentState}, would you like to make it ${oppositeState}?`)) {
            const newStatus = await togglePublish(video._id);
            if (newStatus !== null) {
                setVideos(videos.map(v => v._id === video._id ? { ...v, isPublished: newStatus } : v));
            }
        }
    };

    // Delete handler
    const handleDeleteVideo = async (videoId) => {
        if (window.confirm("Are you sure you want to delete this video? This action cannot be undone.")) {
            const data = await deleteVideo(videoId);
            if (data) {
                // Remove the deleted video from the UI instantly
                setVideos(videos.filter(v => v._id !== videoId));
            }
        }
    };

    if (!user) return null;

    return (
        <div className="flex bg-black min-h-screen pt-20 font-roboto">
            <Sidebar />

            <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] text-white">
                {/* Banner Section */}
                <div className="w-full h-48 md:h-64 lg:h-80 bg-zinc-900 relative">
                    {user?.coverImage ? (
                        <img
                            src={user.coverImage}
                            alt="Channel Banner"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-purple-900/30 to-pink-900/30" />
                    )}
                </div>

                {/* Profile Info Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    <div className="bg-[#09090b] border border-zinc-800 rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center md:items-end gap-6 mb-12 shadow-xl shadow-purple-500/5">
                        <img
                            src={user?.avatar || 'https://via.placeholder.com/150'}
                            alt="Channel Avatar"
                            className="w-24 h-24 md:w-36 md:h-36 rounded-full border-4 border-zinc-800 object-cover bg-zinc-900"
                        />
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-white mb-1">{user?.fullName || user?.username}</h1>
                            <div className="flex items-center justify-center md:justify-start gap-4 text-[#a1a1aa] text-sm font-medium">
                                <span>@{user?.username}</span>
                                <span>•</span>
                                <span>{videos.length} Videos</span>
                            </div>
                            <p className="mt-4 text-[#a1a1aa] max-w-2xl text-sm leading-relaxed">
                                Welcome to my VidShare channel! Here you can view and manage all your uploaded content.
                            </p>
                        </div>
                        <div className="md:pb-2">
                            <Link to="/change-details">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-white text-black font-bold px-8 py-2.5 rounded-full hover:bg-zinc-200 transition-colors"
                                >
                                    Customize Channel
                                </motion.button>
                            </Link>
                        </div>
                    </div>

                    <hr className="border-[#27272a] mb-12" />

                    {/* Display Delete Error if it occurs */}
                    {deleteError && (
                        <div className="mb-6 bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm text-center">
                            {deleteError}
                        </div>
                    )}

                    {/* Videos Section */}
                    <div className="pb-12">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-white">Manage Videos</h2>
                            <Link to="/upload">
                                <button className="text-sm bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg text-pink-500 hover:text-pink-400 font-medium transition-colors">
                                    + Upload New Video
                                </button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12">
                            {loading ? (
                                Array(4).fill(0).map((_, i) => <VideoSkeleton key={i} />)
                            ) : videos.length > 0 ? (
                                videos.map((video) => (
                                    <motion.div
                                        key={video._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="group bg-[#09090b] rounded-xl overflow-hidden border border-[#18181b] hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(147,51,234,0.1)] transition-all duration-300"
                                    >
                                        <div className="relative aspect-video">
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />

                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-10">
                                                <Link to={`/edit-video/${video._id}`} state={{ video }}>
                                                    <button className="p-3 bg-purple-600 hover:bg-purple-500 rounded-full text-white transition-transform hover:scale-110">
                                                        <LuPencil size={20} />
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={() => handleToggleVisibility(video)}
                                                    disabled={isToggling}
                                                    title={video.isPublished ? "Make Hidden" : "Make Public"}
                                                    className="p-3 bg-zinc-600 hover:bg-zinc-500 rounded-full text-white transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {video.isPublished ? <LuEye size={20} /> : <LuEyeOff size={20} />}
                                                </button>
                                                
                                                {/* 4. Attached the delete handler and loading state here */}
                                                <button 
                                                    onClick={() => handleDeleteVideo(video._id)}
                                                    disabled={isDeleting}
                                                    className="p-3 bg-red-600 hover:bg-red-500 rounded-full text-white transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <LuTrash2 size={20} />
                                                </button>
                                            </div>

                                            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">
                                                {formatDuration(video.duration)}
                                            </span>
                                            {!video.isPublished && (
                                                <span className="absolute top-2 left-2 bg-[#27272a]/90 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 border border-[#3f3f46]">
                                                    <LuEyeOff size={12} /> Draft
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-white font-semibold line-clamp-2 text-sm mb-2 group-hover:text-purple-400 transition-colors">
                                                {video.title}
                                            </h3>
                                            <div className="flex items-center justify-between text-xs text-[#a1a1aa]">
                                                <span>{video.views || 0} views</span>
                                                <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 bg-[#09090b] rounded-2xl border border-zinc-800 border-dashed">
                                    <h3 className="text-xl font-bold text-white mb-2">No videos uploaded</h3>
                                    <p className="text-[#a1a1aa] mb-6 text-sm">Upload a video to start filling up your channel</p>
                                    <Link to="/upload">
                                        <button className="bg-gradient-to-r from-purple-600 to-pink-500 px-8 py-2.5 rounded-full text-white font-bold hover:scale-105 transition-transform">
                                            Upload Video
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}