import { motion } from "framer-motion";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useState } from "react";

export default function Header() {
    const [query, setQuery] = useState("");

    return (
        <>
            <div className="w-screen h-16 bg-black flex items-center justify-between px-4 font-roboto">
                {/* Left: Logo */}
                <div className="flex items-center">
                    <img
                        className="h-10 w-auto scale-[1.6]"
                        src="/newlogo.png"
                        alt="Logo"
                    />
                </div>

                {/* Center: Search Bar */}
                <div className="flex items-center bg-zinc-900 text-white rounded-full px-4 py-1 w-[500px]">
                    <input
                        type="text"
                        className="flex-grow bg-transparent outline-none text-white placeholder-white text-sm"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                        <button onClick={() => setQuery("")} className="p-1 cursor-pointer">
                            <FaTimes size={14} />
                        </button>
                    )}
                    <button className="p-1 cursor-pointer">
                        <FaSearch size={14} />
                    </button>
                </div>

                {/* Right: Upload + Auth */}
                <div className="flex items-center space-x-6">
                    {/* Upload button - separate like YouTube */}
                    <motion.button
                        className="text-white border-2 border-white py-1 px-3 rounded-full bg-gray-900"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Upload
                    </motion.button>

                    {/* Login / Register buttons */}
                    <div className="flex items-center space-x-3">
                        <motion.button
                            className="text-white border-2 border-white py-1 px-3 rounded-full"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Login
                        </motion.button>

                        <motion.button
                            className="bg-white text-black border-2 border-white py-1 px-3 rounded-full"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Register
                        </motion.button>
                    </div>
                </div>
            </div>
        </>
    );
}
