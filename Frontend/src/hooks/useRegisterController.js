import { useState } from "react";
import axios from "axios";

export const useRegisterController = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData()
        data.append("username", formData.username);
        data.append("email", formData.email);
        data.append("password", formData.password);

        setError(null)

        try {
            setLoading(true)

            const res = await axios.post("http://localhost:5000/api/v1/users/register", data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            })
            console.log(res)
            setSuccess(true)
        } catch (error) {
            const trimmedError = {
                statusCode: error.response?.status,
                message: error.response?.data?.message || "An error occurred"
            }
            console.log(trimmedError)
            setError(trimmedError.message);
        } finally {
            setLoading(false)
        }
    }
    
    return { formData, handleChange, handleSubmit, loading, error, success }
}