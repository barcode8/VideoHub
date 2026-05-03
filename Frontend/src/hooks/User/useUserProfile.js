import { useEffect, useState } from "react";
import axios from "axios";

export const useUserProfile = (username)=>{
    const [channel, setChannel] = useState(null)
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [channelVideos, setChannelVideos] = useState(null)

    //Manage request states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [videoLoading, setVideoLoading] = useState(false);
    const [videoError, setVideoError] = useState(null);

    useEffect(()=>{
        if(!username) return

        const fetchUserChannelAndVideos = async ()=>{
            setLoading(true)
            setVideoLoading(true)
            setError(null)
            setVideoError(null)

            try {
                const profileResponse = await axios.get(`http://localhost:5000/api/v1/users/c/${username}`, {
                    withCredentials : true //Not using will cause the request to exclude the cookie, which the backend will then reject because of CORS
                })

                const fetchedChannelData = profileResponse.data.data;

                setChannel(fetchedChannelData)
                setIsSubscribed(fetchedChannelData.isSubscribed)

                setLoading(false)

                try {
                    const response = await axios.get(`http://localhost:5000/api/v1/videos`, {
                    params:{
                        userId : fetchedChannelData._id
                    },
                    withCredentials : true //Not using will cause the request to exclude the cookie, which the backend will then reject because of CORS
                })
                setChannelVideos(response.data.data.docs)
                } catch(err){
                    console.error("Error fetching channel videos:", err)
                    setVideoError(err.response?.data?.message || err.message || "Failed to fetch channel videos");
                } finally{
                    setVideoLoading(false)
                }

            } catch (err) {
                // This catch block handles errors if the initial Profile fetch fails
                console.error("Error fetching channel:", err);
                setError(err.response?.data?.message || err.message || "Failed to fetch channel");
                setLoading(false);
                setVideoLoading(false); // If profile fails, videos fail by default
            }
        }

        fetchUserChannelAndVideos()
    },[username])

    return {loading, error, channel, isSubscribed, videoLoading, videoError, channelVideos}
}