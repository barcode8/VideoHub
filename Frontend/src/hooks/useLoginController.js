import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";

export const useLoginController = ()=>{
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: ""
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

    const handleSubmit = async (e) =>{
        e.preventDefault();

        const isEmail = formData.username.includes("@");

        const data = {
            [isEmail ? "email" : "username"]: formData.username,
            password: formData.password,
        };

        setError(null)

        try{
            setLoading(true)

            const res = await axios.post("http://localhost:5000/api/v1/users/login", data, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            })

            console.log(res)

            login(res.data.data.user);

            setSuccess(true)
        }catch(error){
            const trimmedError = {
                statusCode: error.response?.status,
                message: error.response?.data?.message || "An error occurred"
            }
            console.log(trimmedError)
            setError(trimmedError.message);
        }finally{
            setLoading(false)
        }
    }
    return {formData, handleChange, handleSubmit, loading, error, success}
}