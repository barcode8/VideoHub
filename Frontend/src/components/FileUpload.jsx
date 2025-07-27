import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function FileUpload({
    label = "Upload File",
    name = "file",
    required = false,
    accept = "image/*",
    onFileSelect = () => {},
}) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            onFileSelect(selectedFile); // callback to parent if needed
        }
    };

    const removeFile = () => {
        setFile(null);
        setPreview(null);
        onFileSelect(null); // let parent know it's removed
    };

    return (
        <div className="text-white w-full max-w-md mx-auto">
            <label htmlFor={name} className="block mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <input
                id={name}
                type="file"
                accept={accept}
                className="hidden"
                onChange={handleFileChange}
            />

            {!file ? (
                <label
                    htmlFor={name}
                    className="block w-full text-center bg-zinc-800 text-white py-2 rounded cursor-pointer hover:bg-zinc-700 transition"
                >
                    Choose File
                </label>
            ) : (
                <div className="relative bg-zinc-800 p-4 rounded-md mt-2 flex items-center gap-4">
                    {preview && (
                        <img
                            src={preview}
                            alt="preview"
                            className="w-16 h-16 object-cover rounded-md"
                        />
                    )}
                    <div className="flex-1">
                        <p className="text-sm truncate">{file.name}</p>
                        <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                        onClick={removeFile}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
                    >
                        <FaTimes size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}
