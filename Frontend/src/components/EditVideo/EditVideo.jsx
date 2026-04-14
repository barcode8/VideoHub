import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuImage, LuSave, LuX, LuVideo, LuCircleCheck } from 'react-icons/lu';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useUpdateVideo } from '../../hooks/Video/useUpdateVideo.js';
import { useTogglePublish } from '../../hooks/Video/useTogglePublish.js';

export default function EditVideo() {
    // 1. Hook and Routing Setup
    const { videoId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // 2. Local UI State
    const [isPublished, setIsPublished] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    // 3. Custom Hooks
    const { togglePublish, isToggling } = useTogglePublish();
    const { 
        formData, 
        setFormData, 
        loading, 
        error, 
        success, 
        handleChange, 
        handleThumbnailSelect, 
        handleSubmit 
    } = useUpdateVideo(videoId);

    const passedVideo = location.state?.video || null;

    // 4. Initial Data Injection
    useEffect(() => {
        if (passedVideo) {
            setFormData({
                title: passedVideo.title,
                description: passedVideo.description
            });
            setIsPublished(passedVideo.isPublished);
            setThumbnailPreview(passedVideo.thumbnail);
        }
    }, [passedVideo, setFormData]);

    // 5. Success Redirect Logic
    useEffect(() => {
        if (success) {
            const timeout = setTimeout(() => {
                navigate('/channel');
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [success, navigate]);

    // 6. Visibility Handler
    const handleVisibilityToggle = async () => {
        console.log("Toggling video:", videoId);
        const newStatus = await togglePublish(videoId);
        if (newStatus !== null) {
            setIsPublished(newStatus);
        }
    };

    return (
        <div className="min-h-screen bg-[#000000] text-white pt-24 pb-12 font-roboto px-4 sm:px-6 lg:px-8">
            {/* Loading & Success Overlay */}
            <AnimatePresence>
                {(loading || success) && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl flex flex-col items-center gap-4 text-center max-w-sm mx-4 shadow-2xl"
                        >
                            {loading ? (
                                <>
                                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                    <p className="text-white font-bold text-xl">Updating Video...</p>
                                    <p className="text-zinc-400 text-sm">Please wait while we save your changes</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
                                        <LuCircleCheck size={48} />
                                    </div>
                                    <p className="text-white font-bold text-xl">Updated Successfully!</p>
                                    <p className="text-zinc-400 text-sm">Redirecting you back to your channel...</p>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
            >
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Edit Video</h1>
                        <p className="text-[#a1a1aa] text-sm">Update your video details and visibility</p>
                    </div>
                    <button 
                        type="button"
                        onClick={() => navigate('/channel')}
                        className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
                    >
                        <LuX size={24} />
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Visual Preview */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-6">
                        <div className="bg-[#18181b] border border-[#3f3f46] rounded-2xl overflow-hidden p-4">
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <LuVideo size={16} /> Current Video Preview
                            </p>
                            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black relative mb-4">
                                <img 
                                    src={thumbnailPreview || 'https://via.placeholder.com/640x360?text=No+Thumbnail'} 
                                    alt="Thumbnail preview" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="font-bold text-lg text-white mb-1 line-clamp-2">
                                {formData.title || "Video Title"}
                            </h3>
                            <div className="flex items-center gap-2 mt-4">
                                <div className={`px-3 py-1 text-xs font-bold rounded-full border ${isPublished ? 'bg-purple-900/30 border-purple-500/50 text-purple-400' : 'bg-zinc-800 border-zinc-600 text-zinc-400'}`}>
                                    {isPublished ? 'Public' : 'Draft'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Edit Form */}
                    <form onSubmit={handleSubmit} className="w-full lg:w-2/3 bg-[#18181b] border border-[#3f3f46] rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-xl">
                        
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {/* Title Input */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-zinc-300">Video Title</label>
                            <input 
                                id='title'
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                placeholder="Enter a catchy title..."
                                required
                            />
                        </div>

                        {/* Description Input */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-zinc-300">Description</label>
                            <textarea 
                                id='description'
                                value={formData.description}
                                onChange={handleChange}
                                rows={5}
                                className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                                placeholder="Tell viewers about your video..."
                            />
                        </div>

                        {/* Thumbnail Upload */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-zinc-300">Update Thumbnail (Optional)</label>
                            <div className="relative group">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => {
                                        handleThumbnailSelect(e);
                                        if (e.target.files && e.target.files[0]) {
                                            setThumbnailPreview(URL.createObjectURL(e.target.files[0]))
                                        }
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="w-full border-2 border-dashed border-zinc-700 group-hover:border-purple-500 rounded-xl px-4 py-8 flex flex-col items-center justify-center gap-3 bg-zinc-900/50 transition-colors">
                                    <div className="bg-zinc-800 p-3 rounded-full group-hover:bg-purple-600 transition-colors">
                                        <LuImage size={24} className="text-zinc-400 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-zinc-300 group-hover:text-purple-400 transition-colors">Click or drag new thumbnail</p>
                                        <p className="text-xs text-zinc-500 mt-1">JPEG, PNG, WEBP (Max 5MB)</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Visibility Toggle */}
                        <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800">
                            <label className="text-sm font-bold text-zinc-300">Visibility</label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!isPublished) handleVisibilityToggle();
                                    }}
                                    disabled={isToggling}
                                    className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${isPublished ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]' : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}
                                >
                                    <LuCircleCheck size={18} className={isPublished ? 'block' : 'hidden'} /> Public
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (isPublished) handleVisibilityToggle();
                                    }}
                                    disabled={isToggling}
                                    className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${!isPublished ? 'bg-zinc-700 border-zinc-500 text-white' : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}
                                >
                                    Draft
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 mt-4">
                            <button 
                                type="button"
                                onClick={() => navigate('/channel')}
                                className="px-6 py-2.5 rounded-full font-bold text-zinc-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                disabled={loading || success}
                                className={`bg-gradient-to-r from-purple-600 to-pink-500 px-8 py-2.5 rounded-full text-white font-bold flex items-center gap-2 shadow-lg transition-all ${(loading || success) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-purple-500/25'}`}
                            >
                                <LuSave size={18} /> 
                                {loading ? "Saving..." : "Save Changes"}
                            </motion.button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}