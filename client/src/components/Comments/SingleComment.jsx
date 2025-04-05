import React, { useState } from "react";
import { FaReply, FaTrash } from "react-icons/fa";
import CommentInput from "./CommentInput";
import axiosInstance from "../../../axios.config";

const SingleComment = ({ comment, onAddReply, onDeleteComment }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleReply = (text) => {
    onAddReply(comment.id, text);
    setShowReplyInput(false);
  };

  const handleDeleteComment = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setIsDeleting(true);
      try {
        await axiosInstance.delete(`/comments/delete-comment/${comment.id}`);
        if (onDeleteComment) onDeleteComment(comment.id);
      } catch (error) {
        console.error("Error deleting comment:", error);
        alert("Failed to delete comment");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (window.confirm("Are you sure you want to delete this reply?")) {
      try {
        await axiosInstance.delete(`/comments/delete-reply/${replyId}`);
        if (onDeleteComment) onDeleteComment(comment.id, replyId);
      } catch (error) {
        console.error("Error deleting reply:", error);
        alert("Failed to delete reply");
      }
    }
  };

  const formatTimestamp = (timestamp) => {
    if (timestamp === "Just now") return timestamp;

    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="single-comment" style={isDeleting ? { opacity: 0.5 } : {}}>
      <div className="comment-main">
        <img src={comment.userImage} alt="User" className="user-image" />
        <div className="comment-content">
          <div className="user-info">
            <h4>{comment.userName}</h4>
            <span className="timestamp">
              {formatTimestamp(comment.timestamp)}
            </span>
          </div>
          <p className="comment-text">{comment.text}</p>
          <div className="comment-actions">
            <button
              className="reply-btn"
              onClick={() => setShowReplyInput(!showReplyInput)}
            >
              <FaReply /> Reply
            </button>
            <button className="delete-btn" onClick={handleDeleteComment}>
              <FaTrash /> Delete
            </button>
          </div>
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

      {comment.replies && comment.replies.length > 0 && (
        <div className="replies-section">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="reply">
              <img src={reply.userImage} alt="User" className="user-image" />
              <div className="reply-content">
                <div className="user-info">
                  <h4>{reply.userName}</h4>
                  <span className="timestamp">
                    {formatTimestamp(reply.timestamp)}
                  </span>
                </div>
                <p className="reply-text">{reply.text}</p>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteReply(reply.id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SingleComment;
