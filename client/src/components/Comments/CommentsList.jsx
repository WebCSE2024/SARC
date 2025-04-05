import React from "react";
import SingleComment from "./SingleComment";

const CommentsList = ({ comments, onAddReply, onDeleteComment }) => {
  return (
    <div className="comments-list">
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
