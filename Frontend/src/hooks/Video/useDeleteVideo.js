import { useState } from "react";
import axios from "axios";

export const useDeleteVideo = ()=>{
    //Manage request states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const deleteVideo = async (videoId)=>{
        try {
        setError(null);
        setLoading(true);
        const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/videos/${videoId}`,{
            withCredentials: true
        })
        setSuccess(true)
        return response.data

        } catch (err) {
            console.error(err)
            setError(err.response?.data?.message || "Failed to delete video");
            return null;

        } finally{
            setLoading(false)
        }
    }

    return {loading, error, success, deleteVideo}
}