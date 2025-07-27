import { useState } from "react";
import axios from "axios";

export const useRegisterController= ()=>{
    const [formData, setFormData]= useState({
        username: "",
        email: "",
        fullName: "",
        password: "",
        avatar: null,
        coverImage: null
    })

    const handleChange= (e)=>{
        setFormData((prev)=>({
            ...prev,
            [e.target.id]: e.target.value,
        }))
    }

    const handleFileChange= (e)=>{
        const {name, files} = e.target
        setFormData((prev)=>({
            ...prev,
            [name]: files[0]
        }))
    }

    const handleSubmit= async (e)=>{
        e.preventDefault();

        const data= new FormData()
        data.append("username", formData.username);
        data.append("email", formData.email);
        data.append("fullName", formData.fullName);
        data.append("password", formData.password);
        data.append("avatar", formData.avatar);

        if(formData.coverImage){
            data.append("coverImage", formData.coverImage)
        }

        try {
            const res= await axios.post("http://localhost:5000/api/v1/users/register",data, {
                headers:{
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            })
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    return {formData, handleChange, handleFileChange, handleSubmit}
}