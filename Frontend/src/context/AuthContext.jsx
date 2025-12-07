import {createContext ,useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null)

export const AuthProvider = ({children}) =>{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const checkAuth = async ()=>{
            try{
                const res = await axios.get("http://localhost:5000/api/v1/users/current-user", {
                    withCredentials: true
                });
                setUser(res.data.data)

            }catch(error){
                setUser(null)
            }finally{
                setLoading(false)
            }
        }
        checkAuth()
    },[])

    const login = (userData) => setUser(userData)
    const logout = async () => {
        await axios.post("http://localhost:5000/api/v1/users/logout", {}, { withCredentials: true });
        setUser(null);
    };

    return(
        <AuthContext.Provider value={{user, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext)