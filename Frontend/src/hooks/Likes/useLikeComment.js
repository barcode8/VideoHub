import axios from "axios";
import { useState } from "react";

export const useLikeComment = () => {
    const [isToggling, setIsToggling] = useState(false);
    const [toggleError, setToggleError] = useState(null);

    const toggleCommentLike = async (commentId) => {
        setToggleError(null); 
        setIsToggling(true);

        try {
            const res = await axios.post(
                `http://localhost:5000/api/v1/likes/toggle/c/${commentId}`, 
                {}, 
                { withCredentials: true }
            );

            return res.data.data;
        } catch (err) {
            console.error(err); 
            setToggleError(err.response?.data?.message || "Failed to like comment");
            return null; 
        } finally {
            setIsToggling(false);
        }
    };

    return { toggleCommentLike, isToggling, toggleError };
};