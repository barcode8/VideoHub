import { motion } from "framer-motion"
import { useState } from "react";
import FileUpload from "../FileUpload";
import {useRegisterController} from "./useRegisterController.js"

export default function Register() {
    const { formData, handleChange, handleFileChange, handleSubmit } = useRegisterController();
    return (
        <>
            <div className="bg-black h-screen w-screen flex items-center justify-center font-roboto overflow-x-hidden overflow-y-hidden">
                <motion.div
                    className="bg-zinc-900 w-auto h-auto rounded-2xl p-10 flex flex-col items-start justify-start content-between space-y-6"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    <h1 className="text-white text-center pt-2 font-bold text-2xl">
                        Create An Account
                    </h1>

                    <label htmlFor="username" className="text-white mb-2">
                        Username <span className="text-red-500">*</span>
                    </label>

                    <input
                        id="username"
                        onChange={handleChange}
                        value={formData.username} // ADDED THIS LINE
                        type="text"
                        className="bg-zinc-800 text-white placeholder-white rounded mb-4"
                    />

                    <label htmlFor="email" className="text-white mb-2">
                        Email <span className="text-red-500">*</span>
                    </label>

                    <input
                        id="email"
                        onChange={handleChange}
                        value={formData.email} // ADDED THIS LINE
                        type="text"
                        className="bg-zinc-800 text-white placeholder-white rounded mb-4"
                    />

                    <label htmlFor="fullname" className="text-white mb-2">
                        Full Name <span className="text-red-500">*</span>
                    </label>

                    <input
                        id="fullName" // Corrected to 'fullName' to match formData key
                        onChange={handleChange}
                        value={formData.fullName} // ADDED THIS LINE
                        type="text"
                        className="bg-zinc-800 text-white placeholder-white rounded mb-4"
                    />

                    <label htmlFor="password" className="text-white mb-2">
                        Password <span className="text-red-500">*</span>
                    </label>

                    <input
                        id="password"
                        onChange={handleChange}
                        value={formData.password} // ADDED THIS LINE
                        type="password"
                        className="bg-zinc-800 text-white placeholder-white rounded mb-4"
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
                        name="coverImage" // This is now correct (camelCase)
                        required={false}
                        accept="image/*"
                    />

                    <div className="w-full flex justify-center pt-4">
                        <motion.button
                            onClick={handleSubmit}
                            className=" bg-white p-3 rounded cursor-pointer"
                            whileHover={{scale: 1.1}}
                            whileTap={{scale: 0.95}}
                        >
                        Submit
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </>
    )
}