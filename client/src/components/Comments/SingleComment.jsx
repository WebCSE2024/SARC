import React, { useState } from 'react';
import { FaReply } from 'react-icons/fa';
import CommentInput from './CommentInput';

const SingleComment = ({ comment, onAddReply }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);

    const handleReply = (text) => {
        onAddReply(comment.id, text);
        setShowReplyInput(false);
    };

    return (
        <div className="single-comment">
            <div className="comment-main">
                <img src={comment.userImage} alt="User" className="user-image" />
                <div className="comment-content">
                    <div className="user-info">
                        <h4>{comment.userName}</h4>
                        {/* <span className="timestamp">{comment.timestamp}</span> */}
                    </div>
                    <p className="comment-text">{comment.text}</p>
                    <button 
                        className="reply-btn"
                        onClick={() => setShowReplyInput(!showReplyInput)}
                    >
                        <FaReply /> Reply
                    </button>
                </div>
            </div>

            {showReplyInput && (
                <div className="reply-input-wrapper">
                    <CommentInput 
                        onSubmit={handleReply}
                        placeholder="Press Enter to reply..."
                    />
                </div>
            )}

            {comment.replies.length > 0 && (
                <div className="replies-section">
                    {comment.replies.map(reply => (
                        <div key={reply.id} className="reply">
                            <img src={reply.userImage} alt="User" className="user-image" />
                            <div className="reply-content">
                                <div className="user-info">
                                    <h4>{reply.userName}</h4>
                                    <span className="timestamp">{reply.timestamp}</span>
                                </div>
                                <p className="reply-text">{reply.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SingleComment;