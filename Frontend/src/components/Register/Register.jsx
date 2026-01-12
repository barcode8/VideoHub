import { motion } from "framer-motion";
import { useMemo, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterController } from "../../hooks/useRegisterController.js";

/* This file's main functions are - 
1. Generates the user-visible registration page with random bubble generation in the background
2. Handling data flow between registration hook and the component where it is the one providing attribute data
*/

export default function Register() {
    //This function generates random bubbles which show up in the background of the registeration page
    const bubbles = useMemo(() =>
        //By using useMemo we are telling React to not re-calculate the bubble values every time there is any sort of change on the page for eg changes in input field
        [...Array(15)].map(() => ({ //Here we create an empty array of 15 elements just so we can iterate
            size: Math.random() * 60 + 20,//This calculates the size of each bubble which is random
            top: `${Math.random() * 100}%`,//This calculates the position of each bubble on the y axis of the screen
            left: `${Math.random() * 100}%`,//This calculates the position of each bubble on the x axis of the screen
            duration: Math.random() * 6 + 4 //This calculates the duration of each bubble
        })), []
    );

    const { formData, handleChange, handleSubmit, loading, error, success } = useRegisterController();

    //useNavigate lets us navigate to any route
    const navigate = useNavigate();

    //Here we check whether the success value is true or not and if it is, the user gets redirected to the login page after 2.5 seconds
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate("/login");
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    return (
        <div className="bg-black h-screen w-screen flex items-center justify-center overflow-hidden relative font-roboto">
            
            {/* Background Animation */}
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
                className="bg-zinc-900 w-full max-w-lg mx-4 rounded-2xl p-8 shadow-[0_0_60px_15px_rgba(147,51,234,0.3)] max-h-[90vh] overflow-y-auto relative z-10"
                initial={{ y: 50, opacity: 0 }}
                animate={{
                    y: 0,
                    opacity: 1
                }}
                transition={{
                    duration: 0.6,
                    ease: "easeOut"
                }}
            >
                {/* Using conditional rendering to display either a "successfully registered screen or the default registeration page" */}
                {success ? (
                    <div className="flex flex-col items-center justify-center py-10 space-y-6">
                        <motion.svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="#9333ea" 
                            className="w-20 h-20"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1 }}
                        >
                            <motion.path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12.75l6 6 9-13.5"
                            />
                        </motion.svg>

                        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                            Account Created!
                        </h2>
                        <p className="text-zinc-400 text-sm">
                            Redirecting you to login...
                        </p>
                    </div>
                ) : (
                    <>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2 self-center text-center">
                            VideoHub
                        </h1>
                        
                        <h2 className="text-white text-center pt-2 text-2xl self-center mb-6 font-light">
                            Create An Account
                        </h2>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="text-zinc-300 block mb-2 text-sm">
                                    Email <span className="text-purple-500">*</span>
                                </label>
                                <motion.input
                                    id="email"
                                    onChange={handleChange}
                                    value={formData.email}
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-zinc-800 text-white placeholder-zinc-500 rounded-lg px-4 py-3 outline-none border border-zinc-700 focus:border-purple-600 focus:shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all duration-300"
                                    whileFocus={{ scale: 1.01 }}
                                />
                            </div>

                            <div>
                                <label htmlFor="username" className="text-zinc-300 block mb-2 text-sm">
                                    Username <span className="text-purple-500">*</span>
                                </label>
                                <motion.input
                                    id="username"
                                    onChange={handleChange}
                                    value={formData.username}
                                    type="text"
                                    placeholder="Choose a username"
                                    className="w-full bg-zinc-800 text-white placeholder-zinc-500 rounded-lg px-4 py-3 outline-none border border-zinc-700 focus:border-purple-600 focus:shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all duration-300"
                                    whileFocus={{ scale: 1.01 }}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="text-zinc-300 block mb-2 text-sm">
                                    Password <span className="text-purple-500">*</span>
                                </label>
                                <motion.input
                                    id="password"
                                    onChange={handleChange}
                                    value={formData.password}
                                    type="password"
                                    placeholder="Create a password"
                                    className="w-full bg-zinc-800 text-white placeholder-zinc-500 rounded-lg px-4 py-3 outline-none border border-zinc-700 focus:border-purple-600 focus:shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all duration-300"
                                    whileFocus={{ scale: 1.01 }}
                                />
                            </div>

                            {error && (
                                <motion.p 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded border border-red-500/20"
                                >
                                    {error}
                                </motion.p>
                            )}

                            <div className="w-full flex justify-center pt-4">
                                <motion.button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold px-8 py-3 rounded-lg cursor-pointer flex justify-center items-center h-12"
                                    whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(147, 51, 234, 0.5)" }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ClipLoader size={20} color="#ffffff" />
                                    ) : (
                                        "Create Account"
                                    )}
                                </motion.button>
                            </div>

                            <p className="text-center text-zinc-400 text-sm pt-2">
                                Already have an account?{' '}
                                <Link to="/login" className="text-purple-400 hover:text-pink-400 transition-colors font-medium">
                                    Sign In
                                </Link>
                            </p>
                        </form>
                    </>
                )}
            </motion.div>
        </div>
    );
}