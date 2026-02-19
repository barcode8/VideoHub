import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useChangePassword } from "../../hooks/useChangePassword.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useMemo, useEffect } from "react";

/* This file's main functions include-
1. Displaying a change password form
2. Integrates the frontend form, the hook which communicates to the backend change password api to ensure seamless and fluid password changing */

export default function ChangePassword() {
    const { formData, handleChange, handleSubmit, loading, error, success } = useChangePassword();
    const { logout } = useAuth();
    const navigate = useNavigate();

    //This function generates random bubbles which show up in the background of the change password page
    const bubbles = useMemo(() =>
        //By using useMemo we are telling React to not re-calculate the bubble values every time there is any sort of change on the page for eg changes in input field
        [...Array(15)].map(() => ({ //Here we create an empty array of 15 elements just so we can iterate
            size: Math.random() * 60 + 20, //This calculates the size of each bubble which is random
            top: `${Math.random() * 100}%`, //This calculates the position of each bubble on the y axis of the screen
            left: `${Math.random() * 100}%`, //This calculates the position of each bubble on the x axis of the screen
            duration: Math.random() * 6 + 4 //This calculates the duration of each bubble
        })), []
    );

    // Logout and redirect logic (triggers 2.5s after success state turns true)
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                logout();
                navigate("/login");
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [success, logout, navigate]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center font-roboto pt-16 relative overflow-hidden">
            
            {/* Background Animation Bubbles */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {bubbles.map((bubble, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-purple-600 opacity-10"
                        style={{
                            width: bubble.size,
                            height: bubble.size,
                            top: bubble.top,
                            left: bubble.left
                        }}
                        animate={{
                            y: [0, -50, 0],
                            opacity: [0.1, 0.3, 0.1]
                        }}
                        transition={{
                            duration: bubble.duration,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            <motion.div
                className="bg-zinc-900 w-full max-w-lg mx-4 rounded-2xl p-8 shadow-[0_0_60px_15px_rgba(147,51,234,0.3)] relative z-10"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2 text-center">
                    VidShare
                </h1>
                
                <h2 className="text-white text-center pt-2 text-2xl mb-6 font-light">
                    Update Security
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Status Feedback */}
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.p 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded border border-red-500/20"
                            >
                                {error}
                            </motion.p>
                        )}
                        {success && (
                            <motion.p 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-green-500 text-sm text-center bg-green-500/10 py-2 rounded border border-green-500/20"
                            >
                                Password changed! Logging out in 2.5s...
                            </motion.p>
                        )}
                    </AnimatePresence>

                    {/* Current Password Field */}
                    <div>
                        <label className="text-zinc-300 block mb-2 text-sm font-medium">
                            Current Password <span className="text-purple-500">*</span>
                        </label>
                        <motion.input
                            type="password"
                            id="oldPassword"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            placeholder="Enter current password"
                            className="w-full bg-zinc-800 text-white placeholder-zinc-500 rounded-lg px-4 py-3 outline-none border border-zinc-700 focus:border-purple-600 focus:shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all duration-300"
                            whileFocus={{ scale: 1.01 }}
                            required
                        />
                    </div>

                    {/* New Password Field */}
                    <div>
                        <label className="text-zinc-300 block mb-2 text-sm font-medium">
                            New Password <span className="text-purple-500">*</span>
                        </label>
                        <motion.input
                            type="password"
                            id="newPassword" 
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="Enter new password"
                            className="w-full bg-zinc-800 text-white placeholder-zinc-500 rounded-lg px-4 py-3 outline-none border border-zinc-700 focus:border-purple-600 focus:shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all duration-300"
                            whileFocus={{ scale: 1.01 }}
                            required
                        />
                    </div>

                    <div className="w-full flex justify-center pt-4">
                        <motion.button
                            type="submit"
                            disabled={loading || success}
                            className={`w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold px-8 py-3 rounded-lg flex justify-center items-center h-12 transition-all ${loading || success ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-[0_0_20px_rgba(147,51,234,0.5)]'}`}
                            whileHover={!(loading || success) ? { scale: 1.02 } : {}}
                            whileTap={!(loading || success) ? { scale: 0.98 } : {}}
                        >
                            {loading ? "Updating..." : success ? "Success!" : "Update Password"}
                        </motion.button>
                    </div>

                    {!success && (
                        <p className="text-center text-zinc-400 text-sm">
                            <Link to="/" className="text-purple-400 hover:text-pink-400 transition-colors font-medium">
                                Cancel and Return Home
                            </Link>
                        </p>
                    )}
                </form>
            </motion.div>
        </div>
    );
}