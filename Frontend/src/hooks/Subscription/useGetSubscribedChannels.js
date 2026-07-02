import axios from "axios";
import { useState, useEffect} from "react";

export const useGetSubscribedChannels = ()=>{
    const [subscribedChannels, setSubscribedChannels] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        const fetchSubscribedChannels = async ()=>{
            setLoading(true)
            setError(null)

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/subscriptions/my-subscriptions`,{
                    withCredentials : true
                })
                setSubscribedChannels(response.data.data)
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch subscribed channels");
            } finally {
                setLoading(false)
            }
        }

        fetchSubscribedChannels()
    },[])

    return {loading, error, subscribedChannels}
}