import axios from "axios";
import { useState } from "react";

export const useLikeVideos = () => {
    const [isToggling, setIsToggling] = useState(false);
    const [toggleError, setToggleError] = useState(null);

    const toggleVideoLike = async (videoId) => {
        setToggleError(null); 
        setIsToggling(true);

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/likes/toggle/v/${videoId}`, 
                {}, 
                { withCredentials: true }
            );

            return res.data.data;
        } catch (err) {
            console.error(err); 
            setToggleError(err.response?.data?.message || "Failed to like video");
            return null; 
        } finally {
            setIsToggling(false);
        }
    };

    return { toggleVideoLike, isToggling, toggleError };
};