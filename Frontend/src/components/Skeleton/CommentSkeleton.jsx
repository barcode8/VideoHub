import React from 'react';

export default function CommentSkeleton() {
    return (
        <div className="flex gap-4 mb-4 w-full animate-pulse">
            {/* Avatar Skeleton */}
            <div className="w-10 h-10 rounded-full bg-zinc-900 shrink-0"></div>
            
            {/* Content Skeleton */}
            <div className="flex flex-col w-full max-w-2xl mt-1">
                {/* Username and Date Line */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="h-4 bg-zinc-900 rounded w-24"></div>
                    <div className="h-3 bg-zinc-900 rounded w-16"></div>
                </div>
                
                {/* Comment Text Lines */}
                <div className="flex flex-col gap-2">
                    <div className="h-3 bg-zinc-900 rounded w-full"></div>
                    <div className="h-3 bg-zinc-900 rounded w-5/6"></div>
                    <div className="h-3 bg-zinc-900 rounded w-2/3"></div>
                </div>
            </div>
        </div>
    );
}