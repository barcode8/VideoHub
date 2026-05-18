import React from 'react';
import { Link } from 'react-router-dom';

export default function CommentCard({ comment }) {
    // Fallbacks in case user data is missing
    const avatarUrl = comment?.ownerDetails?.avatar || `https://ui-avatars.com/api/?name=${comment?.ownerDetails?.username || 'U'}&background=random`;
    const username = comment?.ownerDetails?.username || "unknown_user";

    return (
        <div className="flex gap-4 mb-4">
            {/* User Avatar - Wrapped in a Link */}
            <Link to={`/channel/${username}`} className="shrink-0">
                <img 
                    src={avatarUrl} 
                    alt={username} 
                    className="w-10 h-10 rounded-full object-cover bg-zinc-800 hover:opacity-80 transition-opacity"
                />
            </Link>
            
            {/* Comment Content */}
            <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                    {/* Username - Wrapped in a Link */}
                    <Link to={`/channel/${username}`}>
                        <span className="text-white font-bold text-sm hover:text-pink-500 transition-colors">
                            @{username}
                        </span>
                    </Link>
                    <span className="text-zinc-400 text-xs">
                        {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}
                    </span>
                </div>
                <p className="text-zinc-200 text-sm whitespace-pre-wrap">
                    {comment.content}
                </p>
            </div>
        </div>
    );
}