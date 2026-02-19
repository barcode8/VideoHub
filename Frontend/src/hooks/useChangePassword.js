import { useState } from "react";
import axios from "axios";

/* This file's main functions are -
1. Manages form state from user inputs in ChangePassword.jsx using the handleChange function implemented in onChange attribute
2. Create an instance of JSON data from the formData and uses formData's final values
3. Calls the change password api where the data sent is normal JSON*/

export const useChangePassword = ()=>{
    const [formData, setFormData] = useState(
        {
            oldPassword : "",
            newPassword : ""
        }
    )

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const handleChange = (e)=>{
        //So here what we are doing is that basically whenever onChange is triggered, the object would be set to empty and if we proceed normally with just asignment of one specific attribute that was changed, we would have one valid property and 2 empty ones, hence we use the spread command alongside prev which basically allows us to append the last valid entries of the object and then modify the value of whatever attribute the user targets
        setFormData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }))
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const data = {
            oldPassword : formData.oldPassword,
            newPassword : formData.newPassword
        }

        setError(null);

        try {
            //Sending change password request to server
            const res = await axios.post("http://localhost:5000/api/v1/users/change-password", data, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials : true
            })

            setSuccess(true);
        } catch (error) {
            const trimmedError = {
                statusCode: error.response?.status,
                message: error.response?.data?.message || "An error occurred"
            }
            console.log(trimmedError)
            setError(trimmedError.message);
        } finally{
            setLoading(false);
        }
    }
    return {formData, handleChange, handleSubmit, loading, error, success}
}