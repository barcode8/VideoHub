import axios from "axios"
import { useState } from "react"

export const useAddComment = ()=>{
    const [content, setContent] = useState("")

    //Implement state management variables
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const handleChange = (e)=>{
        setContent(e.target.value)
    }

    const handleSubmit = async (e, videoId)=>{
        e.preventDefault()
        setLoading(true)

        const data = {
            content : content
        }

        setError(null);

        try {
            const response = await axios.post (`${import.meta.env.VITE_API_BASE_URL}/api/v1/comments/${videoId}`, data, {
                headers:{
                    "Content-Type" : "application/json"
                },
                withCredentials : true
            })

            setSuccess(true)
            setContent("")
        } catch (err) {
            console.error("Error adding comment:", err)
            setError(err.response?.data?.message || err.message || "Failed to add the comment");
        } finally {
            setLoading(false)
        }
    }

    return {content, handleChange, handleSubmit, loading, error, success}
}
