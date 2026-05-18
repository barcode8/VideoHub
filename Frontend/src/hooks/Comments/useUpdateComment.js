import axios from "axios"
import { useState } from "react"

export const useUpdateComment = (initialContent = "")=>{
    //We use initialContent so the box isn't empty when you click edit
    const [content, setContent] = useState(initialContent)

    //Implement state management variables
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const handleChange = (e)=>{
        setContent(e.target.value)
    }

    const handleSubmit = async (e, commentId)=>{
        e.preventDefault()
        setLoading(true)

        const data = {
            content : content
        }

        setError(null);

        try {
            const response = await axios.patch (`http://localhost:5000/api/v1/comments/c/${commentId}`, data, {
                headers:{
                    "Content-Type" : "application/json"
                },
                withCredentials : true
            })

            setSuccess(true)
            return response.data
        } catch (err) {
            console.error("Error editing comment:", err)
            setError(err.response?.data?.message || err.message || "Failed to edit comment");
        } finally {
            setLoading(false)
        }
    }

    // We must return setContent here or the text wont appear in the edit box
    return {content, setContent, handleChange, handleSubmit, loading, error, success}
}
