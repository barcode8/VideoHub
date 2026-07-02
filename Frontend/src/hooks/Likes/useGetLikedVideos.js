import { useState, useEffect } from "react";
import axios from "axios";

export const useGetLikedVideos = ()=>{
    const [likedVideos, setlikedVideos] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        const fetchlikedVideos = async ()=>{
            setLoading(true)
            setError(null)

            try {
                const response = await axios.get("${import.meta.env.VITE_API_BASE_URL}/api/v1/likes/videos",{
                    withCredentials : true
                })
                setlikedVideos(response.data.data)
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch liked videos");
            } finally {
                setLoading(false)
            }
        }

        fetchlikedVideos()
    },[])

    return {loading, error, likedVideos}
}