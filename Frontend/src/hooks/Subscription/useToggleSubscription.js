import axios from "axios";
import { useState } from "react";

export const useToggleSubscription = () => {
    const [isToggling, setIsToggling] = useState(false);
    const [toggleError, setToggleError] = useState(null);

    const toggleSubscription = async (channelId) => {
        setToggleError(null); 
        setIsToggling(true);

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/subscriptions/c/${channelId}`, 
                {}, 
                { withCredentials: true }
            );

            return res.data.data;
        } catch (err) {
            console.error(err); 
            setToggleError(err.response?.data?.message || "Failed to subscribe");
            return null; 
        } finally {
            setIsToggling(false);
        }
    };

    return { toggleSubscription, isToggling, toggleError };
};