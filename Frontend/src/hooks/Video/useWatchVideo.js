import { useEffect, useState } from "react";
import axios from "axios";

export const useWatchVideo = (videoId)=>{
    const [video, setVideo] = useState(null)
    const [recommendedVideos, setRecommendedVideos] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        if (!videoId) return

        const fetchVideoData = async ()=>{
            setLoading(true)
            setError(null)

            //Searching for the main video
            try {
                const videoRes = await axios.get(`http://localhost:5000/api/v1/videos/${videoId}`,{},{
                    withCredentials: true
                })

                if (videoRes.data?.success) {
                    setVideo(videoRes.data.data);
                }

                //Getting more videos for recommendation system
                const recRes = await axios.get(`http://localhost:5000/api/v1/videos`,{}, {
                    withCredentials: true
                });

                if(recRes.data?.success){
                    // Filter out the video we are currently watching
                    const filteredRecs = recRes.data.data.docs.filter(v => v._id !== videoId);
                    setRecommendedVideos(filteredRecs);
                }

            } catch (err) {
                console.error("Error fetching video details: ",err)
                setError(err.response?.data?.message || "Failed to load video data");
            } finally{
                setLoading(false)
            }
        }

        fetchVideoData()
    },[videoId]) // Re-run if the videoId changes (e.g., clicking a recommended video)

    return {video, recommendedVideos, loading, error}
}