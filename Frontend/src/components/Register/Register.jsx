import { motion } from "framer-motion"
import { useState } from "react";
import FileUpload from "../FileUpload";

export default function Register() {
    const [focus, setFocus] = useState(false);

    return (
        <>
            <div className="bg-black h-screen w-screen flex items-center justify-center font-roboto">
                <motion.div
                    className="bg-zinc-900 w-auto h-auto rounded-2xl p-10 flex flex-col items-start justify-start content-between space-y-6"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    <h1 className="text-white text-center pt-2 font-bold text-2xl">
                        Create An Account
                    </h1>

                    <label htmlFor="username" className="text-white">
                        Username <span className="text-red-500">*</span>
                    </label>

                    <input
                        id="username"
                        type="text"
                        className="bg-zinc-800 text-white placeholder-white rounded"
                    />

                    <label htmlFor="email" className="text-white">
                        Email <span className="text-red-500">*</span>
                    </label>

                    <input
                        id="email"
                        type="text"
                        className="bg-zinc-800 text-white placeholder-white rounded"
                    />

                    <label htmlFor="fullname" className="text-white">
                        Full Name <span className="text-red-500">*</span>
                    </label>

                    <input
                        id="fullname"
                        type="text"
                        className="bg-zinc-800 text-white placeholder-white rounded"
                    />

                    <label htmlFor="password" className="text-white">
                        Password <span className="text-red-500">*</span>
                    </label>

                    <input
                        id="password"
                        type="password"
                        className="bg-zinc-800 text-white placeholder-white rounded"
                    />

                    <FileUpload 
                        label="Avatar"
                        name="avatar"
                        required={true}
                        accept="image/*"
                    />

                    <FileUpload 
                        label="Cover Image"
                        name="coverimage"
                        required={false}
                        accept="image/*"
                    />

                    <div className="w-full flex justify-center pt-4">
                        <motion.button
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