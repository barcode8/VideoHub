import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar.jsx';
import { VideoSkeleton } from '../Skeleton/VideoSkeleton.jsx';
import VideoCard from '../VideoCard/VideoCard.jsx'

export default function Home() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    //Here we send an api call to fetch ALL available videos
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/videos');
                if (response.data?.success) {
                    setVideos(response.data.data.docs || []);
                }
            } catch (error) {
                console.error("Error fetching videos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, []);

    return (
        <div className="flex bg-black min-h-screen pt-20 font-roboto">
            <Sidebar />

            <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)]">
                <div className="p-6 md:p-10"> 
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12">
                        {loading ? (
                            Array(6).fill(0).map((_, i) => <VideoSkeleton key={i} />)
                        ) : videos.length > 0 ? (
                            videos.map((video) => (
                                <VideoCard key={video._id} video={video} />
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-zinc-500">
                                <p className="text-xl font-medium">No videos found</p>
                                <p className="text-sm">Be the first one to upload a video!</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}