import React, { useState } from "react";
import { FaReply, FaTrash } from "react-icons/fa";
import CommentInput from "./CommentInput";
import { sarcAPI } from "../../../../../shared/axios/axiosInstance";

const SingleComment = ({ comment, onAddReply, onDeleteComment }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  const handleReply = (text) => {
    if (text.trim()) {
      onAddReply(comment.id, text);
      setReplyText("");
      setShowReplyInput(false);
    }
  };

  const handleDeleteComment = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setIsDeleting(true);
      try {
        await sarcAPI.delete(`sarc/v0/comments/delete-comment/${comment.id}`);
        if (onDeleteComment) onDeleteComment(comment.id);
      } catch (error) {
        console.error("Error deleting comment:", error);
        if (error.response && error.response.status === 404) {
          console.log("Comment was already deleted from database");
          if (onDeleteComment) onDeleteComment(comment.id);
        } else {
          alert("Failed to delete comment");
        }
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (window.confirm("Are you sure you want to delete this reply?")) {
      try {
        await sarcAPI.delete(`sarc/v0/comments/delete-reply/${replyId}`);
        if (onDeleteComment) onDeleteComment(comment.id, replyId);
      } catch (error) {
        console.error("Error deleting reply:", error);
        if (error.response && error.response.status === 404) {
          console.log("Reply was already deleted from database");
          if (onDeleteComment) onDeleteComment(comment.id, replyId);
        } else {
          alert("Failed to delete reply");
        }
      }
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Just now";

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

  const toggleReplies = () => {
    setIsExpanded(!isExpanded);
  };

  const hasReplies = comment.replies && comment.replies.length > 0;

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
              aria-label="Reply to comment"
            >
              <FaReply /> Reply
            </button>
            <button
              className="delete-btn"
              onClick={handleDeleteComment}
              aria-label="Delete comment"
            >
              <FaTrash /> Delete
            </button>
            {hasReplies && (
              <button
                className="toggle-replies-btn"
                onClick={toggleReplies}
                aria-label={isExpanded ? "Hide replies" : "Show replies"}
              >
                {isExpanded
                  ? "Hide replies"
                  : `Show ${comment.replies.length} ${
                      comment.replies.length === 1 ? "reply" : "replies"
                    }`}
              </button>
            )}
          </div>
        </div>
      </div>

      {showReplyInput && (
        <div className="reply-input-wrapper">
          <CommentInput
            onSubmit={handleReply}
            placeholder="Write a reply..."
            initialValue={replyText}
            onChange={setReplyText}
          />
        </div>
      )}

      {hasReplies && isExpanded && (
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
                <div className="reply-actions">
                  <button
                    className="reply-btn"
                    onClick={() => {
                      setShowReplyInput(true);
                      setReplyText(`@${reply.userName} `);
                    }}
                    aria-label="Reply to this comment"
                  >
                    <FaReply /> Reply
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteReply(reply.id)}
                    aria-label="Delete reply"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SingleComment;
