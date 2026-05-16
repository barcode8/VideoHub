import { useState, useEffect } from "react";
import axios from "axios";

export const useWatchHistory = ()=>{
    const [watchHistory, setWatchHistory] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        const fetchWatchHistory = async ()=>{
            setLoading(true)
            setError(null)

            try {
                const response = await axios.get("http://localhost:5000/api/v1/users/watch-history",{
                    withCredentials : true
                })
                setWatchHistory(response.data.data)
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch watch history");
            } finally {
                setLoading(false)
            }
        }

        fetchWatchHistory()
    },[])

    return {loading, error, watchHistory}
}