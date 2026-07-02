import axios from "axios";
import { useState } from "react";

export const useDeletePlaylist = ()=>{
    //Managing loading and error states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false)

    const deletePlaylist = async (playlistId)=>{
        setLoading(true)
        setError(null)

        try {
            const response = await axios.delete (`http://localhost:5000/api/v1/playlist/${playlistId}`, {
                withCredentials : true
            })

            setSuccess(true)
            return response.data
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.message || "Failed to delete playlist");
            return null;
        } finally {
            setLoading(false)
        }
    }

    return {deletePlaylist, success, loading, error}
}