import axios from "axios";
import { useState } from "react";

export const useGetPlaylistById = ()=>{

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [playlist, setPlaylist] = useState(null)

    const getPlaylistById = async (playlistId)=>{
        setError(null)
        setLoading(true)

        try {
            const res = await axios.get(`http://localhost:5000/api/v1/playlist/${playlistId}`,{
                withCredentials : true
            })

            setSuccess(true)
            setPlaylist(res.data.data)
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to fetch playlist";
            console.error(errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false)
        }
    }

    return {getPlaylistById, loading, error, playlist}
}