import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom"; 
import { LuSearch, LuUpload, LuX, LuMenu, LuLogOut, LuUser, LuBell, LuMonitorPlay } from "react-icons/lu";
import { useAuth } from '../../context/AuthContext.jsx';

export default function Header() {
    const [query, setQuery] = useState("");
    const [profileOpen, setProfileOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);

    const { user, logout } = useAuth();
    
    //Initialize the navigate function
    const navigate = useNavigate(); 

    //Submit handler
    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Stop the page from reloading
        if (query.trim()) {
            // Push the encoded query to the URL
            navigate(`/search?query=${encodeURIComponent(query)}`);
            // We don't clear the query state here because users usually like to see what they just searched for in the bar
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-zinc-800 font-roboto h-16">
            <div className="px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex items-center justify-between h-full">

                    {/* 1. Left Section */}
                    <div className="flex flex-1 items-center min-w-[200px] pr-4 lg:pr-8">
                        <Link to="/" className="shrink-0">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent cursor-pointer tracking-tight">
                                VidShare
                            </h1>
                        </Link>

                        <div className="hidden xl:flex items-center gap-6 mx-auto">
                            {['Home', 'Trending', 'Subscriptions', 'Library'].map((item) => (
                                <a key={item} href="/" className="text-zinc-400 hover:text-pink-500 transition-colors text-sm font-medium">
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* 2. Search Section */}
                    <div className="hidden lg:flex justify-center w-full max-w-2xl px-4">
                        <form onSubmit={handleSearchSubmit} className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search videos..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                className={`w-full bg-zinc-900 text-white px-4 py-2 pl-10 pr-10 rounded-full border transition-all duration-300 outline-none ${searchFocused
                                        ? 'border-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                                        : 'border-zinc-700'
                                    }`}
                            />
                            {/* Make the search icon clickable to submit as well */}
                            <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2">
                                <LuSearch className="w-5 h-5 text-zinc-500 hover:text-white transition-colors" />
                            </button>
                            
                            {query && (
                                <button type="button" onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-800 rounded-full text-zinc-400">
                                    <LuX size={16} />
                                </button>
                            )}
                        </form>
                    </div>

                    {/* 3. Action Section */}
                    <div className="flex flex-1 items-center justify-end gap-3 min-w-[200px]">
                        <button className="lg:hidden p-2 hover:bg-zinc-800 rounded-full text-white">
                            <LuSearch size={20} />
                        </button>

                        <Link to="/upload">
                            <motion.button
                                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-full"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <LuUpload size={16} />
                                <span className="hidden md:inline text-sm font-medium">Upload</span>
                            </motion.button>
                        </Link>

                        <button className="hidden sm:block p-2 hover:bg-zinc-800 rounded-full text-white relative">
                            <LuBell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full border-2 border-black"></span>
                        </button>

                        {user ? (
                            <div className="relative">
                                <motion.button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <img src={user.avatar} alt="Avatar" className="w-9 h-9 rounded-full object-cover border-2 border-zinc-800" />
                                </motion.button>
                                <AnimatePresence>
                                    {profileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-2 overflow-hidden z-50"
                                        >
                                            <div className="px-4 py-3 border-b border-zinc-800">
                                                <p className="text-white text-sm font-bold truncate">{user.fullName || user.username}</p>
                                                <p className="text-zinc-500 text-xs truncate">@{user.username}</p>
                                            </div>

                                            <Link to="/change-details" onClick={() => setProfileOpen(false)} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800">
                                                <LuUser size={16} /> Edit Details
                                            </Link>

                                            <Link to="/channel" onClick={() => setProfileOpen(false)} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 border-b border-zinc-800">
                                                <LuMonitorPlay size={16} /> View Channel
                                            </Link>
                                            
                                            <button onClick={() => { logout(); setProfileOpen(false); }} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-zinc-800 text-left">
                                                <LuLogOut size={16} /> Sign Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="hidden md:flex gap-3">
                                <Link to='/login' className="text-zinc-400 hover:text-white px-4 py-2 text-sm">Login</Link>
                                <Link to="/register" className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium">Register</Link>
                            </div>
                        )}
                        <button className="md:hidden p-2 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <LuX size={24} /> : <LuMenu size={24} />}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}