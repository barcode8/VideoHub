import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LuEllipsisVertical, LuPencil, LuTrash2 } from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext.jsx';
import { useDeleteComment } from '../../hooks/Comments/useDeleteComment.js';
import { useUpdateComment } from '../../hooks/Comments/useUpdateComment.js';

export default function CommentCard({ comment, onCommentDeleted }) {
    // 1. Get Logged In User
    const { user } = useAuth();
    
    // 2. Ownership Check
    const isOwner = user?._id === comment?.owner;

    // UI States
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    // Hook Implementations (Mapped EXACTLY to your export names)
    const { deleteComment, loading: isDeleting } = useDeleteComment();
    const { 
        content: editContent, 
        setContent: setEditContent, 
        handleSubmit: handleUpdate, 
        loading: isUpdating 
    } = useUpdateComment(comment.content);

    // Fallbacks
    const avatarUrl = comment?.ownerDetails?.avatar || `https://ui-avatars.com/api/?name=${comment?.ownerDetails?.username || 'U'}&background=random`;
    const username = comment?.ownerDetails?.username || "unknown_user";

    // Close menu if clicking outside of it
    const menuRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handlers
    const handleDelete = async () => {
        const result = await deleteComment(comment._id);
        if (result && onCommentDeleted) {
            onCommentDeleted(comment._id); 
        }
        setIsMenuOpen(false);
    };

    const submitEdit = async (e) => {
        // Run the update hook
        const result = await handleUpdate(e, comment._id);
        
        if (result) {
            // 1. Optimistically update the master comment content with your local text state
            comment.content = editContent; 
            
            // 2. Shut down edit mode so it switches back to a normal text paragraph
            setIsEditing(false); 
        }
    };

    return (
        <div className="flex gap-4 mb-4 group relative">
            {/* Avatar */}
            <Link to={`/channel/${username}`} className="shrink-0">
                <img src={avatarUrl} alt={username} className="w-10 h-10 rounded-full object-cover bg-zinc-800 hover:opacity-80 transition-opacity" />
            </Link>
            
            {/* Content Area */}
            <div className="flex flex-col w-full">
                <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                        <Link to={`/channel/${username}`}>
                            <span className="text-white font-bold text-sm hover:text-pink-500 transition-colors">
                                @{username}
                            </span>
                        </Link>
                        <span className="text-zinc-400 text-xs">
                            {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}
                        </span>
                    </div>

                    {/* CONDITIONAL RENDERING */}
                    {isOwner && !isEditing && (
                        <div className="relative" ref={menuRef}>
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <LuEllipsisVertical size={16} />
                            </button>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                                <div className="absolute right-0 top-full mt-1 w-32 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden z-10">
                                    <button 
                                        onClick={() => { 
                                            // Reset the hook's text state to the comment's current text whenever edit mode is opened
                                            setEditContent(comment.content); 
                                            setIsEditing(true); 
                                            setIsMenuOpen(false); 
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                                    >
                                        <LuPencil size={14} /> Edit
                                    </button>
                                    <button 
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                                    >
                                        <LuTrash2 size={14} /> {isDeleting ? "..." : "Delete"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Text vs Edit Form Toggle */}
                {isEditing ? (
                    <div className="flex flex-col gap-2 mt-1">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            disabled={isUpdating}
                            className="w-full bg-zinc-900 border border-zinc-700 focus:border-pink-500 outline-none rounded-lg p-2 text-white text-sm transition-colors disabled:opacity-50 resize-none min-h-[60px]"
                        />
                        <div className="flex justify-end gap-2">
                            <button 
                                onClick={() => setIsEditing(false)}
                                disabled={isUpdating}
                                className="text-zinc-400 hover:text-white text-sm px-3 py-1.5 rounded-full hover:bg-zinc-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={submitEdit}
                                disabled={isUpdating || editContent.trim() === ""}
                                className="bg-gradient-to-r from-purple-600 to-pink-500 disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-400 text-white font-bold text-sm px-4 py-1.5 rounded-full transition-all"
                            >
                                {isUpdating ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-zinc-200 text-sm whitespace-pre-wrap">
                        {comment.content}
                    </p>
                )}
            </div>
        </div>
    );
}