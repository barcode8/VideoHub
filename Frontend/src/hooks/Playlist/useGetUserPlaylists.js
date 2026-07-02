import axios from "axios";
import { useState } from "react";

export const useGetUserPlaylists = ()=>{

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const [userPlaylists, setUserPlaylists] = useState([])

    const getUserPlaylists = async (userId)=>{
        setError(null)
        setLoading(true)
        setSuccess(false)

        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/playlist/user/${userId}`,{
                withCredentials : true
            })

            setSuccess(true)
            setUserPlaylists(res.data.data)
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to fetch user's playlists";
            console.error(errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false)
        }
    }

    return {getUserPlaylists, loading, error, success, userPlaylists}
}