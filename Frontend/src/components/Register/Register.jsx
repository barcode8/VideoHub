import { motion } from "framer-motion"
import { useState, useMemo, useEffect } from "react";
import { ClipLoader } from "react-spinners"
import FileUpload from "../FileUpload";
import { useRegisterController } from "../../hooks/useRegisterController.js"
import {useNavigate} from 'react-router-dom'

export default function Register() {
    const bubbles = useMemo(() =>
        [...Array(15)].map(() => ({
            size: Math.random() * 60 + 20,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            duration: Math.random() * 6 + 4
        })), []
    );

    const { formData, handleChange, handleFileChange, handleSubmit, loading, error, success } = useRegisterController();

    const navigate = useNavigate();


    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate("/login");
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);


    return (
        <>
            <div className="bg-black h-screen w-screen flex items-center justify-center font-roboto overflow-x-hidden overflow-y-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full">
                    {bubbles.map((bubble, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full bg-white opacity-20"
                            style={{
                                width: bubble.size,
                                height: bubble.size,
                                top: bubble.top,
                                left: bubble.left
                            }}
                            animate={{
                                y: [0, -50, 0],
                                opacity: [0.2, 0.4, 0.2]
                            }}
                            transition={{
                                duration: bubble.duration,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>

                {success
                    ? (
                        <motion.div
                            className="bg-zinc-900 w-auto h-auto rounded-2xl p-10 flex flex-col items-start justify-start content-between space-y-6 shadow-[0_0_60px_15px_rgba(255,255,255,0.6)]"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{
                                y: [0, -15, 0],
                                opacity: 1
                            }}
                            transition={{
                                y: {
                                    repeat: Infinity,
                                    repeatType: "mirror",
                                    duration: 3,
                                    ease: "easeInOut"
                                },
                                opacity: { duration: 1.2, ease: "easeOut" }
                            }}
                        >
                            <motion.svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="green"
                                className="w-16 h-16"
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

                            <p className="text-green-600 font-semibold text-lg">
                                Registered Successfully!
                            </p>
                            <p className="text-gray-500 text-sm">
                                Redirecting to login page...
                            </p>
                        </motion.div>
                    )


                    : (
                        <motion.div
                            className="bg-zinc-900 w-auto h-auto rounded-2xl p-10 flex flex-col items-start justify-start content-between space-y-6 shadow-[0_0_60px_15px_rgba(255,255,255,0.6)]"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{
                                y: [0, -15, 0],
                                opacity: 1
                            }}
                            transition={{
                                y: {
                                    repeat: Infinity,
                                    repeatType: "mirror",
                                    duration: 3,
                                    ease: "easeInOut"
                                },
                                opacity: { duration: 1.2, ease: "easeOut" }
                            }}
                        >
                            <h1 className="text-white text-center pt-2 font-bold text-2xl">
                                Create An Account
                            </h1>

                            <label htmlFor="username" className="text-white mb-2">
                                Username <span className="text-red-500">*</span>
                            </label>

                            <motion.input
                                id="username"
                                onChange={handleChange}
                                value={formData.username}
                                type="text"
                                className="bg-zinc-800 text-white placeholder-white rounded mb-4 px-3 py-2 outline-none border border-transparent focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.6)] transition-all duration-300"
                                whileFocus={{ scale: 1.02 }}
                            />

                            <label htmlFor="email" className="text-white mb-2">
                                Email <span className="text-red-500">*</span>
                            </label>

                            <motion.input
                                id="email"
                                onChange={handleChange}
                                value={formData.email}
                                type="email"
                                className="bg-zinc-800 text-white placeholder-white rounded mb-4 px-3 py-2 outline-none border border-transparent focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.6)] transition-all duration-300"
                                whileFocus={{ scale: 1.02 }}
                            />

                            <label htmlFor="fullname" className="text-white mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>

                            <motion.input
                                id="fullName"
                                onChange={handleChange}
                                value={formData.fullName}
                                type="text"
                                className="bg-zinc-800 text-white placeholder-white rounded mb-4 px-3 py-2 outline-none border border-transparent focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.6)] transition-all duration-300"
                                whileFocus={{ scale: 1.02 }}
                            />

                            <label htmlFor="password" className="text-white mb-2">
                                Password <span className="text-red-500">*</span>
                            </label>

                            <motion.input
                                id="password"
                                onChange={handleChange}
                                value={formData.password}
                                type="password"
                                className="bg-zinc-800 text-white placeholder-white rounded mb-4 px-3 py-2 outline-none border border-transparent focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.6)] transition-all duration-300"
                                whileFocus={{ scale: 1.02 }}
                            />

                            <FileUpload
                                onChange={handleFileChange}
                                label="Avatar"
                                name="avatar"
                                required={true}
                                accept="image/*"
                            />

                            <FileUpload
                                onChange={handleFileChange}
                                label="Cover Image"
                                name="coverImage"
                                required={false}
                                accept="image/*"
                            />

                            {error && (
                                <span className="text-red-600">{error}</span>
                            )}

                            <div className="w-full flex justify-center pt-4">
                                <motion.button
                                    onClick={handleSubmit}
                                    className=" bg-white text-black p-3 rounded cursor-pointer"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={loading ? true : false}
                                >
                                    {loading
                                        ? (<ClipLoader size={18} />)
                                        : (<span>Submit</span>)
                                    }
                                </motion.button>
                            </div>
                        </motion.div>
                    )
                }
            </div>
        </>
    )
}
