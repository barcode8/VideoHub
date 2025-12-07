import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { LuSearch, LuUpload, LuX, LuMenu, LuLogOut, LuUser, LuBell } from "react-icons/lu"; 
import { useAuth } from '../../context/AuthContext.jsx';

export default function Header() {
    const [query, setQuery] = useState("");
    const [profileOpen, setProfileOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);

    const { user, logout } = useAuth();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-zinc-800 font-roboto h-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex items-center justify-between h-full">
                    
                    <div className="flex items-center gap-8">
                        <Link to="/">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent cursor-pointer tracking-tight">
                                VidShare
                            </h1>
                        </Link>

                        <div className="hidden md:flex items-center gap-6">
                            {['Home', 'Trending', 'Subscriptions', 'Library'].map((item) => (
                                <a
                                    key={item}
                                    href="#"
                                    className="text-zinc-400 hover:text-pink-500 transition-colors text-sm font-medium"
                                >
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search videos..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                className={`w-full bg-zinc-900 text-white px-4 py-2 pl-10 pr-10 rounded-full border transition-all duration-300 outline-none ${
                                    searchFocused
                                        ? 'border-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.6)]'
                                        : 'border-zinc-700'
                                }`}
                            />
                            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            
                            {query && (
                                <button 
                                    onClick={() => setQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
                                >
                                    <LuX size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        
                        <button className="lg:hidden p-2 hover:bg-zinc-800 rounded-full transition-colors text-white">
                            <LuSearch size={20} />
                        </button>

                        <motion.button 
                            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-4 py-2 rounded-full transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <LuUpload size={16} />
                            <span className="hidden md:inline text-sm font-medium">Upload</span>
                        </motion.button>

                        <button className="hidden sm:block p-2 hover:bg-zinc-800 rounded-full transition-colors text-white relative">
                            <LuBell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full border-2 border-black"></span>
                        </button>

                        {user ? (
                            <div className="relative">
                                <motion.button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 focus:outline-none"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {user.avatar ? (
                                        <img 
                                            src={user.avatar} 
                                            alt="Avatar" 
                                            className="w-9 h-9 rounded-full object-cover border-2 border-zinc-800 hover:border-purple-500 transition-colors"
                                        />
                                    ) : (
                                        <div className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors">
                                            <LuUser size={20} className="text-white" />
                                        </div>
                                    )}
                                </motion.button>

                                <AnimatePresence>
                                    {profileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] py-2 overflow-hidden z-50"
                                        >
                                            <div className="px-4 py-3 border-b border-zinc-800">
                                                <p className="text-white text-sm font-bold truncate">
                                                    {user.fullName || user.username}
                                                </p>
                                                <p className="text-zinc-500 text-xs truncate">@{user.username}</p>
                                            </div>
                                            
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setProfileOpen(false);
                                                }}
                                                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-zinc-800/50 hover:text-red-300 transition-colors text-left"
                                            >
                                                <LuLogOut size={16} />
                                                Sign Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-3">
                                <Link to='/login'>
                                    <motion.button
                                        className="text-zinc-400 hover:text-white hover:bg-zinc-800 px-4 py-2 rounded-full font-medium text-sm transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Login
                                    </motion.button>
                                </Link>

                                <Link to="/register">
                                    <motion.button
                                        className="bg-zinc-100 text-black hover:bg-white px-4 py-2 rounded-full font-medium text-sm transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Register
                                    </motion.button>
                                </Link>
                            </div>
                        )}

                        <button 
                            className="md:hidden p-2 hover:bg-zinc-800 rounded-full transition-colors text-white"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <LuX size={24} /> : <LuMenu size={24} />}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}