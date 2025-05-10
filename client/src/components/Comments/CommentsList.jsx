import React from "react";
import { FaSync } from "react-icons/fa";
import SingleComment from "./SingleComment";

const CommentsList = ({ comments, onAddReply, onDeleteComment, onRefresh }) => {
  return (
    <div className="comments-list">
      {onRefresh && (
        <div className="comments-refresh">
          <button
            className="refresh-button"
            onClick={onRefresh}
            aria-label="Refresh comments"
          >
            <FaSync /> Refresh
          </button>
        </div>
      )}

      {comments.length === 0 ? (
        <p className="no-comments">No comments yet. Be the first to comment!</p>
      ) : (
        comments.map((comment) => (
          <SingleComment
            key={comment.id}
            comment={comment}
            onAddReply={onAddReply}
            onDeleteComment={onDeleteComment}
          />
        ))
      )}
    </div>
  );
};

export default CommentsList;
