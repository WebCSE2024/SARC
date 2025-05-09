import React, { useEffect, useState } from "react";
import "./CommentsArea.scss";
import { FaReply } from "react-icons/fa";
import defaultUserImg from "../../../public/NoProfileImg.png";
import CommentInput from "./CommentInput";
import CommentsList from "./CommentsList";
import { sarcAPI } from "../../../../../shared/axios/axiosInstance";

const CommentsArea = ({ postId, referenceModel = "Achievement" }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getComments = async () => {
    if (!postId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await sarcAPI.get(
        `/comments/get-comments/${postId}?referenceModel=${referenceModel}`
      );

      // Check if response.data.data exists and is an array before mapping
      const responseData = response.data.data || [];
      const dataArray = Array.isArray(responseData) ? responseData : [];

      // Transform server data format to client format
      const transformedComments = dataArray.map((comment) => ({
        id: comment._id,
        text: comment.content,
        userName: comment.commentedBy.username,
        userImage: defaultUserImg, // Use default image or get from user profile
        timestamp: new Date(comment.createdAt).toLocaleString(),
        replies:
          comment.result && Array.isArray(comment.result)
            ? comment.result.map((reply) => ({
                id: reply._id,
                text: reply.content,
                userName: reply.repliedBy.username,
                userImage: defaultUserImg,
                timestamp: new Date(reply.createdAt).toLocaleString(),
              }))
            : [],
      }));

      setComments(transformedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments");
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getComments();
  }, [postId]);

  const handleAddComment = async (text) => {
    try {
      const response = await sarcAPI.post(
        `/comments/add-comment?referenceModel=${referenceModel}&postId=${postId}`,
        { content: text }
      );

      if (response.data.success) {
        // Check if commentedBy exists and provide fallbacks for username
        const commentData = response.data.data || {};
        const commentedBy = commentData.commentedBy || {};

        const newComment = {
          id: commentData._id || "",
          text: commentData.content || text,
          userName: commentedBy.username || "Anonymous User",
          userImage: defaultUserImg,
          timestamp: "Just now",
          replies: [],
        };
        setComments([newComment, ...comments]);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment");
    }
  };

  const handleAddReply = async (commentId, replyText) => {
    if (!commentId) {
      console.error("Comment ID is required");
      alert("Cannot add reply: Invalid comment");
      return;
    }

    try {
      console.log(`Adding reply to comment: ${commentId}`);
      const response = await sarcAPI.post(
        `/comments/add-reply/${commentId}`,
        { content: replyText }
      );

      if (response.data.success) {
        // Check if repliedBy exists and provide fallbacks for username
        const replyData = response.data.data || {};
        const repliedBy = replyData.repliedBy || {};

        const newReply = {
          id: replyData._id || "",
          text: replyData.content || replyText,
          userName: repliedBy.username || "Anonymous User",
          userImage: defaultUserImg,
          timestamp: "Just now",
        };

        setComments(
          comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: [...comment.replies, newReply],
              };
            }
            return comment;
          })
        );
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      alert(
        `Failed to add reply: ${
          error.response?.status === 404
            ? "API endpoint not found"
            : "Server error"
        }`
      );
    }
  };

  const handleDeleteComment = async (commentId, replyId = null) => {
    if (replyId) {
      // Delete a reply
      setComments(
        comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: comment.replies.filter((reply) => reply.id !== replyId),
            };
          }
          return comment;
        })
      );
    } else {
      // Delete a comment
      setComments(comments.filter((comment) => comment.id !== commentId));
    }
  };

  return (
    <div className="comments-area">
      <CommentInput onSubmit={handleAddComment} />
      {loading ? (
        <p className="loading-comments">Loading comments...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <CommentsList
          comments={comments}
          onAddReply={handleAddReply}
          onDeleteComment={handleDeleteComment}
        />
      )}
    </div>
  );
};

export default CommentsArea;
