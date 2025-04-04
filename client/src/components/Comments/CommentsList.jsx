import React from 'react';
import SingleComment from './SingleComment';

const CommentsList = ({ comments, onAddReply }) => {
    return (
        <div className="comments-list">
            {comments.map(comment => (
                <SingleComment 
                    key={comment.id}
                    comment={comment}
                    onAddReply={onAddReply}
                />
            ))}
        </div>
    );
};

export default CommentsList;