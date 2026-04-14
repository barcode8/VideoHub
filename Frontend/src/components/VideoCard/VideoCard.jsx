import React from 'react';
import { formatDuration } from '../../utils/formatTime.js';

export default function VideoCard({ video }) {
    return (
        <div className="group flex flex-col gap-4 cursor-pointer">
            {/* 16:9 Aspect Ratio following Blueprint */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900">
                <img 
                    src={video.thumbnail} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    alt={video.title} 
                />
                <span className="absolute bottom-3 right-3 bg-black/90 text-white text-xs font-bold px-2 py-1 rounded-md">
                    {formatDuration(video.duration)}
                </span>
            </div>
            
            <div className="flex gap-4 px-1">
                <img 
                    src={video.ownerDetails?.avatar} 
                    className="h-11 w-11 rounded-full object-cover border border-zinc-800 flex-shrink-0" 
                    alt="avatar"
                />
                <div className="flex flex-col overflow-hidden">
                    <h3 className="text-white text-base font-bold leading-snug line-clamp-2 group-hover:text-purple-400 transition-colors">
                        {video.title}
                    </h3>
                    <p className="text-zinc-400 text-sm mt-1.5 hover:text-white transition-colors">
                        {video.ownerDetails?.username}
                    </p>
                    <p className="text-zinc-500 text-sm">
                        {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
}