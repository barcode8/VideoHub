import React from 'react';

const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const totalSeconds = Math.floor(seconds);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
};

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
                    {/* Larger font size for larger cards */}
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

export const VideoSkeleton = () => (
    <div className="flex flex-col gap-4 animate-pulse">
        <div className="aspect-video w-full bg-zinc-800 rounded-2xl" />
        <div className="flex gap-4 px-1">
            <div className="h-11 w-11 rounded-full bg-zinc-800 flex-shrink-0" />
            <div className="flex flex-col gap-3 w-full">
                <div className="h-5 w-5/6 bg-zinc-800 rounded-md" />
                <div className="h-4 w-1/2 bg-zinc-800 rounded-md" />
            </div>
        </div>
    </div>
);