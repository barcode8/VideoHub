import axios from "axios";
import { useState } from "react";

export const useRemoveVideoFromPlaylist = ()=>{

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const removeVideoFromPlaylist = async (videoId, playlistId)=>{
        setError(null)
        setLoading(true)
        setSuccess(false)

        try {
            const res = await axios.patch(`http://localhost:5000/api/v1/playlist/remove/${videoId}/${playlistId}`,{},{
                withCredentials : true
            })

            setSuccess(true)
            return res.data.data
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to remove video from playlist";
            console.error(errorMessage);
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false)
        }
    }

    return {removeVideoFromPlaylist, loading, error, success}
}