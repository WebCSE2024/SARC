import  { useEffect, useState, useCallback } from "react";
import "./CommentsArea.scss";
import defaultUserImg from "../../../public/NoProfileImg.png";
import CommentInput from "./CommentInput";
import CommentsList from "./CommentsList";
import { sarcAPI } from "../../../../../shared/axios/axiosInstance";

const CommentsArea = ({ postId, referenceModel = "Achievement" }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Refactored to useCallback to avoid recreating on every render
  const getComments = useCallback(async () => {
    if (!postId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await sarcAPI.get(
        `sarc/v0/comments/get-comments/${postId}?referenceModel=${referenceModel}`
      );

      // Check if response.data.data exists and is an array before mapping
      const responseData = response.data.data || [];
      const dataArray = Array.isArray(responseData) ? responseData : [];

      // Transform server data format to client format
      const transformedComments = dataArray.map((comment) => ({
        id: comment._id,
        text: comment.content,
        userName: comment.commentedBy?.username || "Anonymous User",
        userImage: comment.commentedBy?.profileImage || defaultUserImg,
        timestamp: new Date(comment.createdAt).toLocaleString(),
        // Ensure replies always exist as an array
        replies: Array.isArray(comment.result)
          ? comment.result.map((reply) => ({
              id: reply._id,
              text: reply.content,
              userName: reply.repliedBy?.username || "Anonymous User",
              userImage: reply.repliedBy?.profileImage || defaultUserImg,
              timestamp: new Date(reply.createdAt).toLocaleString(),
              parentId: comment._id, // Track parent comment ID
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
  }, [postId, referenceModel]);

  useEffect(() => {
    getComments();
  }, [getComments]);

  const handleAddComment = async (text) => {
    if (!text.trim()) return;

    try {
      const response = await sarcAPI.post(
        `sarc/v0/comments/add-comment?referenceModel=${referenceModel}&postId=${postId}`,
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
          userImage: commentedBy.profileImage || defaultUserImg,
          timestamp: new Date().toLocaleString(),
          replies: [],
        };

        // Update state with new comment
        setComments((prevComments) => [newComment, ...prevComments]);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleAddReply = async (commentId, replyText) => {
    if (!commentId || !replyText.trim()) {
      console.error("Comment ID and reply text are required");
      return;
    }

    try {
      const response = await sarcAPI.post(
        `sarc/v0/comments/add-reply/${commentId}`,
        {
          content: replyText,
        }
      );

      if (response.data.success) {
        // Check if repliedBy exists and provide fallbacks for username
        const replyData = response.data.data || {};
        const repliedBy = replyData.repliedBy || {};

        const newReply = {
          id: replyData._id || "",
          text: replyData.content || replyText,
          userName: repliedBy.username || "Anonymous User",
          userImage: repliedBy.profileImage || defaultUserImg,
          timestamp: new Date().toLocaleString(),
          parentId: commentId, // Track parent comment ID
        };

        // Update state immutably with the new reply
        setComments((prevComments) =>
          prevComments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                // Add new reply to existing replies array
                replies: [...(comment.replies || []), newReply],
              };
            }
            return comment;
          })
        );
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const handleDeleteComment = async (commentId, replyId = null) => {
    try {
      
      if (replyId) {
        // Delete a reply
        const res = await sarcAPI.delete(`sarc/v0/comments/delete-reply/${replyId}`);
        
        // Update state by filtering out the deleted reply
        setComments((prevComments) =>
          prevComments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: (comment.replies || []).filter(
                  (reply) => reply.id !== replyId
                ),
              };
            }
            return comment;
          })
        );
      } else {
        // Delete a comment
        try {
          await sarcAPI.delete(`sarc/v0/comments/delete-comment/${commentId}`);

          // Update state by filtering out the deleted comment
          setComments((prevComments) =>
            prevComments.filter((comment) => comment.id !== commentId)
          );
        } catch (deleteError) {
          // If the error is 404 (Not Found), it means the comment was already deleted
          // from the database but the UI still has it, so we should still remove it from UI
          if (deleteError.response && deleteError.response.status === 404) {
            console.log("Comment was already deleted, updating UI");
            // Still update the UI even if the comment wasn't found in DB
            setComments((prevComments) =>
              prevComments.filter((comment) => comment.id !== commentId)
            );
          } else {
            // For other errors, throw to be caught by the outer catch
            throw deleteError;
          }
        }
      }
    } catch (error) {
      console.error("Error deleting:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Only show alert for real errors, not for "Comment not found"
        if (!error.response.data.message.includes("not found")) {
          console.error("Error message:", error.response.data.message);
        }
      }
    }
  };

  // Function to refresh comments - can be used for real-time updates
  const refreshComments = () => {
    getComments();
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
          onRefresh={refreshComments}
        />
      )}
    </div>
  );
};

export default CommentsArea;
