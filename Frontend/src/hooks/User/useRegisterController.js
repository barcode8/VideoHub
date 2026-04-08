import { useState } from "react";
import axios from "axios";

/* This file's main functions are -
1. Manages form state from user inputs in Register.jsx using the handleChange function implemented in onChange attribute
2. Create an instance of FormData and store the final user input values in the FormData
3. Send a POST request to the register user API with the FormData (facilitated by multer)*/

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
        //So here what we are doing is that basically whenever onChange is triggered, the object would be set to empty and if we proceed normally with just asignment of one specific attribute that was changed, we would have one valid property and 2 empty ones, hence we use the spread command alongside prev which basically allows us to append the last valid entries of the object and then modify the value of whatever attribute the user targets
        setFormData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        //Here we initialise a new FormData variable (IMPORTANT : this approach of FormData only works if one is using multer in that route, otherwise we use normal objects)
        const data = new FormData()
        data.append("username", formData.username);
        data.append("email", formData.email);
        data.append("password", formData.password);

        setError(null)

        try {
            setLoading(true)

            const res = await axios.post("http://localhost:5000/api/v1/users/register", data, {
                headers: {
                    "Content-Type": "multipart/form-data" //One part different from other use__ hooks is that here we use multipart/form-data and not application/json since as we discussed before we are using multer here
                },
                withCredentials: true//Not using will cause the request to exclude the cookie, which the backend will then reject because of CORS
            })
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