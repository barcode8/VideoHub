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
        const response = await axios.delete(`http://localhost:5000/api/v1/videos/${videoId}`,{
            withCredentials: true
        })
        setSuccess(true)
        return response.data

        } catch (err) {
            console.log(err)
            setError(err.response?.data?.message || "Failed to delete video");
            return null;

        } finally{
            setLoading(false)
        }
    }

    return {loading, error, success, deleteVideo}
}