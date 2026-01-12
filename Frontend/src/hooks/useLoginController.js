import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";

/* This file's main functions are -
1. Manages form state from user inputs in Login.jsx using the handleChange function implemented in onChange attribute
2. Create an instance of JSON data from the formData and uses formData's final values
3. Calls the user login api where the data sent is normal JSON*/

export const useLoginController = ()=>{
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: ""
    })

    //Here, we are initialising the login method we defined in the Context, the method which lets us store user data in the context
    const {login} = useAuth()

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

    const handleSubmit = async (e) =>{
        e.preventDefault();

        //Checking whether the entered email address has an @ symbol or not
        const isEmail = formData.username.includes("@");

        const data = {
            //Here, we validate isEmail and assign the attribute accordingly, there might be some confusion on why we are using formData.username either way and that is because in the Login.jsx component our username/email input has the id "username" so whatever the user enters, be it email or username, it will be stored in formData.username which we can later validate AND THEN assign its value to the correct attribute
            [isEmail ? "email" : "username"]: formData.username,
            password: formData.password,
        };

        setError(null)

        try{
            setLoading(true)

            //Sending login request to server
            const res = await axios.post("http://localhost:5000/api/v1/users/login", data, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true //Not using will cause the request to exclude the cookie, which the backend will then reject because of CORS
            })

            console.log(res)

            //Updating the Context's user data
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