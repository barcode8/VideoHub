import { useState, useEffect } from "react";
import axios from "axios";

export const useSearchResults = (query, sortBy, sortType)=>{
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        const fetchVideos = async ()=>{
            setLoading(true)
            setError(null)

            try {
                const response = await axios.get("http://localhost:5000/api/v1/videos",{
                    params : {
                        query : query,
                        sortBy : sortBy,
                        sortType : sortType
                    },
                    withCredentials: true
                })
                setVideos(response.data.data.docs)
            } catch (err) {
                console.error("Error fetching videos:", err)
                setError(err.response?.data?.message || err.message || "Failed to fetch search results");
            }finally{
                setLoading(false)
            }
        }

        if(query){
            fetchVideos()
        }else{
            setVideos([])
            setLoading(false)
        }
    },[query, sortBy, sortType])

    return {videos, loading, error}
}