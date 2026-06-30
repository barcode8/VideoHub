import axios from "axios";
import { useState } from "react";

export const useDashboard = ()=>{
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [dashboardData, setDashboardData] = useState()
    
    const getDashboardData = async (channelId)=>{
        setLoading(true);
        setError(false)

        try {
            const res = await axios.get(`http://localhost:5000/api/v1/dashboard/stats/${channelId}`,
                {
                    withCredentials : true
                }
            )
            setDashboardData(res.data.data)
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.message || "Failed to fetch channel stats");
        }finally {
            setLoading(false)
        }

    }
    return {loading, error, dashboardData, getDashboardData}
}
