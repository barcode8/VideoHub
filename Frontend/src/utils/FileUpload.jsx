import { useState } from "react";
import { FaTimes } from "react-icons/fa";

/* This file's main functions include- 
1. Creates a component named FileUpload which facilitates file uploading in a form
2. Uses labels to display a nice UI for the file upload section instead of the default html one
3. Includes a functionality through which we can preview files before submitting them */

export default function FileUpload({
    //Here we defined every prop that will be provided when using this component, is it upto us on whether to use the default props or not according to the situation
    label = "Upload File",
    name = "file",
    required = false,
    accept = "image/*",
    onChange, 
}) {
    //Setting states
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    //Defining a function to handle what happens if we select a file (not submit it, just select it)
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);

            //The method createObjectURL basically turns the file that we have in selectedFile into a blob which basically allows us to use the state "preview" we defined earlier straight into the src={} attribute of an image
            setPreview(URL.createObjectURL(selectedFile));

            if (onChange) {
                //This first checks if we passed down a parent-specific change handling function and if it finds one it just provides the event data "e" to the parent component's change handling function
                onChange(e); 
            }
        } else {
            setFile(null);
            setPreview(null);
            if (onChange) {
                //Here, we are basically following the same logic as the onChange function above but this time we are sending a "fake event response" so that we can manage the parent component states effectively
                onChange({ target: { name, files: [] } });
            }
        }
    };

    const removeFile = () => {
        setFile(null);
        setPreview(null);
        if (onChange) {
            //Exactly the same logic as we just discussed above
            onChange({ target: { name, files: [] } }); 
        }
    };

    return (
        <div className="text-white w-full max-w-md mx-auto font-roboto">
            <label htmlFor={name} className="block mb-2">
                {label} {required && <span className="text-red-500">*</span>} {/* If we pass down True to the prop it will show a red star next the field */}
            </label>

            <input
                id={name}
                type="file"
                name={name} 
                accept={accept}
                className="hidden"
                onChange={handleFileChange}
            />

            {/* Here we used conditional rendering to check if a file exists or not and we render the input field based on that */}
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
                            src={preview} //Here is where we were successfully able to use our blob that we created through createObjectURL
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