import React from 'react';
import { Link } from 'react-router-dom';
import { formatDuration } from '../../utils/formatTime.js';

export default function SearchVideoCard({ video }) {
    // Pre-compute the URL to handle potentially missing data gracefully
    const channelUrl = `/channel/${video.ownerDetails?.username || ""}`;

    return (
        <div className="group flex flex-col md:flex-row gap-4 md:gap-6 cursor-pointer mb-6">
            
            {/* Scaled way up for desktop (up to 500px wide) */}
            <Link 
                to={`/watch/${video._id}`} 
                className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 block shrink-0 w-full sm:w-[400px] md:w-[450px] lg:w-[500px]"
            >
                <img 
                    src={video.thumbnail} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    alt={video.title} 
                />
                <span className="absolute bg-black/90 text-white font-bold rounded-md bottom-2 right-2 text-xs px-2 py-1">
                    {formatDuration(video.duration)}
                </span>
            </Link>
            
            {/* Scaled up font sizes to match the bigger thumbnail */}
            <div className="flex flex-col mt-2 md:mt-0 pt-1 w-full max-w-2xl">
                <Link to={`/watch/${video._id}`}>
                    <h3 className="text-white font-medium text-lg md:text-xl leading-snug line-clamp-2 group-hover:text-purple-400 transition-colors">
                        {video.title}
                    </h3>
                </Link>
                
                <p className="text-zinc-400 text-xs md:text-sm mt-1">
                    {video.views || 0} views • {new Date(video.createdAt).toLocaleDateString()}
                </p>
                
                {/* Channel Info inline with larger avatar */}
                <div className="flex items-center gap-3 mt-4 w-fit">
                    {/* Avatar Link */}
                    <Link to={channelUrl} className="shrink-0">
                        <img 
                            src={video.ownerDetails?.avatar || 'https://via.placeholder.com/150'} 
                            className="h-8 w-8 rounded-full object-cover" 
                            alt="avatar"
                        />
                    </Link>
                    
                    {/* Username Link */}
                    <Link 
                        to={channelUrl} 
                        className="text-zinc-400 hover:text-white transition-colors text-sm"
                    >
                        {video.ownerDetails?.username || "Unknown Channel"}
                    </Link>
                </div>

                {/* Description Snippet */}
                <p className="text-zinc-500 text-xs md:text-sm mt-4 line-clamp-1 md:line-clamp-2 hidden sm:block">
                    {video.description || "No description available for this video."}
                </p>
            </div>
        </div>
    );
}