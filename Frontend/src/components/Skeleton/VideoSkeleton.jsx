import React from 'react';

export function VideoSkeleton() {
    return (
        <div className="flex flex-col gap-2 w-full animate-pulse">
            <div className="w-full aspect-video bg-zinc-800 rounded-xl" />
            <div className="flex gap-3 mt-2">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex-shrink-0" />
                <div className="flex flex-col gap-2 w-full pt-1">
                    <div className="h-4 bg-zinc-800 rounded w-[90%]" />
                    <div className="h-3 bg-zinc-800 rounded w-[60%]" />
                </div>
            </div>
        </div>
    );
}