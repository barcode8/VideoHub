import { useState } from "react";
import axios from "axios";

export const useTogglePublish = ()=>{
    const [isToggling, setIsToggling] = useState(false)
    const [toggleError, setToggleError] = useState(null);

    const togglePublish = async(videoId)=>{
        setIsToggling(true);
        setToggleError(null);

        try {
            const res = await axios.patch(`http://localhost:5000/api/v1/videos/toggle/publish/${videoId}`, {},{
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