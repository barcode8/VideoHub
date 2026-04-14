import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LuPencil, LuTrash2, LuEyeOff } from 'react-icons/lu';
import { VideoSkeleton } from '../Skeleton/VideoSkeleton.jsx';
import { formatDuration } from '../../utils/formatTime.js';

export default function MyChannel() {
    //Getting user data from context
    const { user } = useAuth();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyVideos = async () => {
            try {
                // Fetch videos belonging to the current user
                const response = await axios.get(`http://localhost:5000/api/v1/videos?userId=${user?._id}`);
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

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#000000] text-white pt-16 font-roboto pb-12">
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 -mt-12 md:-mt-16 mb-12">
                    <img 
                        src={user?.avatar || 'https://via.placeholder.com/150'} 
                        alt="Channel Avatar" 
                        className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-black object-cover bg-zinc-800"
                    />
                    <div className="flex-1 text-center md:text-left pb-2">
                        <h1 className="text-3xl font-bold text-white">{user?.fullName || user?.username}</h1>
                        <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-[#a1a1aa] text-sm font-medium">
                            <span>@{user?.username}</span>
                            <span>•</span>
                            <span>{videos.length} Videos</span>
                        </div>
                        <p className="mt-4 text-[#a1a1aa] max-w-2xl text-sm leading-relaxed">
                            Welcome to my VidShare channel! Here you can view and manage all your uploaded content.
                        </p>
                    </div>
                    <div className="pb-2">
                        <Link to="/change-details">
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-[#27272a] hover:bg-[#3f3f46] border border-[#3f3f46] text-white font-medium px-6 py-2.5 rounded-full transition-colors"
                            >
                                Customize Channel
                            </motion.button>
                        </Link>
                    </div>
                </div>

                <hr className="border-[#27272a] mb-8" />

                {/* Videos Section */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Manage Videos</h2>
                        <Link to="/upload">
                            <button className="text-sm text-pink-500 hover:text-pink-400 font-medium transition-colors">
                                + Upload New Video
                            </button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {loading ? (
                            Array(4).fill(0).map((_, i) => <VideoSkeleton key={i} />)
                        ) : videos.length > 0 ? (
                            videos.map((video) => (
                                <motion.div 
                                    key={video._id} 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="group bg-[#18181b] rounded-xl overflow-hidden border border-[#3f3f46] hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(147,51,234,0.15)] transition-all duration-300"
                                >
                                    <div className="relative aspect-video">
                                        <img 
                                            src={video.thumbnail} 
                                            alt={video.title} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        
                                        {/* Edit/Delete Overlay */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-10">
                                            <button 
                                                className="p-3 bg-purple-600 hover:bg-purple-500 rounded-full text-white transition-transform hover:scale-110" 
                                                title="Edit Video"
                                            >
                                                <LuPencil size={20} />
                                            </button>
                                            <button 
                                                className="p-3 bg-red-600 hover:bg-red-500 rounded-full text-white transition-transform hover:scale-110" 
                                                title="Delete Video"
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
                            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-[#18181b] rounded-2xl border border-[#3f3f46] border-dashed">
                                <h3 className="text-xl font-bold text-white mb-2">No videos uploaded</h3>
                                <p className="text-[#a1a1aa] mb-6 text-sm">Upload a video to start filling up your channel</p>
                                <Link to="/upload">
                                    <button className="bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-2.5 rounded-full text-white font-bold hover:scale-105 transition-transform">
                                        Upload Video
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}