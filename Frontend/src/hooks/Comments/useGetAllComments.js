import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

export const useGetAllComments = (videoId)=>{
    const [comments, setComments] = useState()

    //Managing loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        if(!videoId) return

        const fetchComments = async ()=>{
            setLoading(true)
            setError(null)

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/comments/${videoId}`,
                    {withCredentials: true}
                )

                setComments(response.data.data.docs)
            } catch (err) {
                console.error("Error fetching comments: ",err)
                setError(err.response?.data?.message || "Failed to load comments");
            } finally {
                setLoading(false)
            }
        }

        fetchComments()
    },[videoId])

    return {comments, setComments, loading, error}
}