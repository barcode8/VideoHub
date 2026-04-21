import React from 'react';
import { Link } from 'react-router-dom';
import { formatDuration } from '../../utils/formatTime.js';

export default function VideoCard({ video, hideAvatar = false, layout = "vertical" }) {
    const isHorizontal = layout === "horizontal";

    return (
        <div className={`group flex ${isHorizontal ? 'flex-row gap-3' : 'flex-col gap-4'} cursor-pointer`}>
            
            {/* Thumbnail */}
            <Link 
                to={`/watch/${video._id}`} 
                className={`relative aspect-video rounded-xl overflow-hidden bg-zinc-900 block shrink-0 ${isHorizontal ? 'w-40' : 'w-full'}`}
            >
                <img 
                    src={video.thumbnail} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    alt={video.title} 
                />
                {/* Dynamically shrink the duration badge if horizontal */}
                <span className={`absolute bg-black/90 text-white font-bold rounded-md ${isHorizontal ? 'bottom-1 right-1 text-[10px] px-1.5 py-0.5' : 'bottom-3 right-3 text-xs px-2 py-1'}`}>
                    {formatDuration(video.duration)}
                </span>
            </Link>
            
            {/* Details */}
            <div className={`flex ${isHorizontal ? 'gap-0 px-0' : 'gap-4 px-1'}`}>
                {/* Hide avatar if prop says so, OR if we are in horizontal mode (YouTube hides it here) */}
                {!hideAvatar && !isHorizontal && (
                    <img 
                        src={video.ownerDetails?.avatar || 'https://via.placeholder.com/150'} 
                        className="h-11 w-11 rounded-full object-cover border border-zinc-800 flex-shrink-0" 
                        alt="avatar"
                    />
                )}
                
                <div className="flex flex-col overflow-hidden">
                    <Link to={`/watch/${video._id}`}>
                        <h3 className={`text-white font-bold leading-snug line-clamp-2 group-hover:text-purple-400 transition-colors ${isHorizontal ? 'text-sm' : 'text-base'}`}>
                            {video.title}
                        </h3>
                    </Link>
                    <p className={`text-zinc-400 hover:text-white transition-colors ${isHorizontal ? 'text-xs mt-1' : 'text-sm mt-1.5'}`}>
                        {video.ownerDetails?.username || "Unknown Channel"}
                    </p>
                    <p className={`text-zinc-500 ${isHorizontal ? 'text-[11px] mt-0.5' : 'text-sm'}`}>
                        {video.views || 0} views • {new Date(video.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
}