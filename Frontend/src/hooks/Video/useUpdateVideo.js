import { useState } from "react";
import axios from "axios";

export const useUpdateVideo = (videoId)=>{
    //Managing text states
    const [formData, setFormData] = useState({
        title : "",
        description : ""
    })

    //Managing file states
    const [thumbnail, setThumbnail] = useState(null)

    //Manage request states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    //Handle text input changes
    const handleChange = (e) => {
        //So here what we are doing is that basically whenever onChange is triggered, the object would be set to empty and if we proceed normally with just asignment of one specific attribute that was changed, we would have one valid property and 2 empty ones, hence we use the spread command alongside prev which basically allows us to append the last valid entries of the object and then modify the value of whatever attribute the user targets
        setFormData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };

    const handleThumbnailSelect = (e)=>{
        if(e.target.files && e.target.files[0]){
            setThumbnail(e.target.files[0])
        }
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()

        const data = new FormData();
        if (formData.title) data.append("title", formData.title);
        if (formData.description) data.append("description", formData.description);
        if (thumbnail) data.append("thumbnail", thumbnail);

        setError(null);
        setLoading(true);

        try {
            const res = await axios.patch(`http://localhost:5000/api/v1/videos/${videoId}`, data, {
                headers:{
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true
            })
            setSuccess(true)
        } catch (err) {
            const errorMessage = err.response?.data?.message || "An error occurred during updating video details";
            console.error(errorMessage);
            setError(errorMessage);
        }finally{
            setLoading(false)
        }
    }

    return {
        formData,
        setFormData,
        thumbnail,
        loading,
        error,
        success,
        handleChange,
        handleThumbnailSelect,
        handleSubmit
    }
}