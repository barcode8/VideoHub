import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LuCamera, LuShieldCheck, LuSave, LuExternalLink, LuLoader, LuInfo } from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useChangeUserDetails } from '../../hooks/useChangeUserDetails';

const ChangeUserDetails = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    // Initialize refs for the file inputs
    const coverInputRef = useRef(null);
    const avatarInputRef = useRef(null);

    const {
        fullName, handleFullNameChange,
        handleAvatarChange, handleCoverImageChange,
        handleSubmit, loading, error, success,
        avatar, coverImage
    } = useChangeUserDetails();

    //Listen for success and auto-sync the frontend with the backend
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                // Reloads the page to fetch the new user data and clear memory states
                window.location.reload();
            }, 1000); // 1-second delay so they can read the success message
            
            // Cleanup the timer if the component unmounts early
            return () => clearTimeout(timer);
        }
    }, [success]);

    return (
        <div className="min-h-screen bg-[#000000] text-white pt-24 pb-12 px-4 md:px-8 font-roboto">
            <div className="max-w-5xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                        Channel Customization
                    </h1>
                    {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
                    {success && <p className="text-green-500 mt-2 text-sm">Profile updated successfully!</p>}
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">

                        {/* Cover Image Section */}
                        <section className="bg-[#18181b] rounded-2xl overflow-hidden border border-[#3f3f46]">
                            
                            <div 
                                onClick={() => coverInputRef.current.click()} 
                                className="group block relative h-48 w-full bg-[#27272a] cursor-pointer"
                            >
                                {(user?.coverImage || coverImage) ? (
                                    <img
                                        src={coverImage ? URL.createObjectURL(coverImage) : user.coverImage}
                                        alt="Cover"
                                        className="w-full h-full object-cover pointer-events-none transition-transform duration-500 group-hover:scale-105" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <LuCamera className="text-[#71717a]" size={48} />
                                    </div>
                                )}

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                                    <div className="flex items-center gap-2 bg-black/60 text-white px-4 py-2 rounded-full font-medium backdrop-blur-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <LuCamera size={20} />
                                        <span>Change Banner</span>
                                    </div>
                                </div>

                                {coverImage && (
                                    <div className="absolute top-4 right-4 bg-pink-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg flex items-center gap-1.5 z-10">
                                        <LuInfo size={14} /> Unsaved Change
                                    </div>
                                )}
                            </div>

                            <input
                                type="file"
                                ref={coverInputRef}
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    handleCoverImageChange(e);
                                    e.target.value = '';
                                }}
                            />

                            <div className="p-6">
                                <h3 className="text-lg font-semibold">Banner Image</h3>
                                <p className="text-sm text-[#a1a1aa]">Recommended: 1920x1080px (Click image to change)</p>
                            </div>
                        </section>

                        {/* Avatar & Name Section */}
                        <section className="bg-[#18181b] rounded-2xl p-8 border border-[#3f3f46]">
                            <div className="flex flex-col md:flex-row gap-8 items-start">

                                {/* Avatar */}
                                <div className="relative mx-auto md:mx-0">
                                    
                                    <div 
                                        onClick={() => avatarInputRef.current.click()} 
                                        className="group block cursor-pointer"
                                    >
                                        <div className="relative w-32 h-32 rounded-full bg-[#27272a] border-4 border-[#3f3f46] overflow-hidden">
                                            <img
                                                src={avatar ? URL.createObjectURL(avatar) : user?.avatar}
                                                alt="Avatar"
                                                className="w-full h-full object-cover pointer-events-none"
                                            />
                                            
                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <LuCamera className="text-white transform scale-75 group-hover:scale-100 transition-transform duration-300" size={32} />
                                            </div>
                                        </div>
                                    </div>

                                    <input
                                        type="file"
                                        ref={avatarInputRef}
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            handleAvatarChange(e);
                                            e.target.value = '';
                                        }}
                                    />

                                    {avatar && (
                                        <div className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-lg border-2 border-[#18181b] flex items-center gap-1 z-10">
                                            <LuInfo size={12} /> Unsaved
                                        </div>
                                    )}
                                </div>

                                {/* Name + Save */}
                                <div className="flex-1 w-full space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-[#71717a] tracking-wider">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            placeholder={user?.fullName || "Enter full name"}
                                            onChange={handleFullNameChange}
                                            className="w-full bg-[#27272a] text-white px-4 py-3 rounded-lg border border-zinc-700 focus:border-purple-600 outline-none transition-all"
                                        />
                                    </div>

                                    <motion.button
                                        disabled={loading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSubmit}
                                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 px-8 py-3 rounded-full font-bold disabled:opacity-50"
                                    >
                                        {loading ? <LuLoader className="animate-spin" size={18} /> : <LuSave size={18} />}
                                        {loading ? "Saving..." : "Save Changes"}
                                    </motion.button>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        <div className="bg-[#18181b] rounded-2xl p-6 border border-[#3f3f46]">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-600/10 rounded-lg">
                                    <LuShieldCheck className="text-purple-500" size={20} />
                                </div>
                                <h3 className="font-bold">Security</h3>
                            </div>
                            <button
                                onClick={() => navigate("/change-password")}
                                className="w-full py-3 rounded-xl bg-[#27272a] border border-[#3f3f46] font-bold text-sm hover:bg-[#3f3f46] flex items-center justify-center gap-2"
                            >
                                Change Password <LuExternalLink size={14} />
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default ChangeUserDetails;