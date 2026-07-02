import { useState } from "react";
import axios from "axios";

export const useTogglePublish = ()=>{
    const [isToggling, setIsToggling] = useState(false)
    const [toggleError, setToggleError] = useState(null);

    const togglePublish = async(videoId)=>{
        setIsToggling(true);
        setToggleError(null);

        try {
            const res = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/videos/toggle/publish/${videoId}`, {},{
                withCredentials:true
            })

            return res.data.data.isPublished;
        } catch (err) {
            console.log(err)
            setToggleError(err.response?.data?.message || "Failed to toggle visibility");
            return null; // Return null so the UI knows it failed
        }finally{
            setIsToggling(false)
        }
    }

    return {togglePublish, isToggling, toggleError}
}