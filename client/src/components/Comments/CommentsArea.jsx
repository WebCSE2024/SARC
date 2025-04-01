import React, { useEffect, useState } from 'react';
import './CommentsArea.scss';
import { FaReply } from 'react-icons/fa';
import defaultUserImg from '../../../public/noProfileImg.png';
import CommentInput from './CommentInput';
import CommentsList from './CommentsList';

const CommentsArea = ({ postId }) => {
    const [comments, setComments] = useState([]);

    // console.log("postId:", postId);

    const getComments = async (postId) => {
        try {
            const response = await axiosInstance.get(`/comments/get-comments/:${postId}`);
            setComments(response.data.data);
        } catch (error) {
            console.error('Error:', error);
            setComments([]);
        }
    }

    useEffect(() => {
        getComments();
    }, []);


    const handleAddComment = (text) => {
        const newComment = {
            id: Date.now(),
            text,
            userName: "Current User", // Replace with actual user data
            userImage: defaultUserImg,
            timestamp: "Just now",
            replies: []
        };
        setComments([newComment, ...comments]);
    };

    const handleAddReply = (commentId, replyText) => {
        setComments(comments.map(comment => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    replies: [...comment.replies, {
                        id: Date.now(),
                        text: replyText,
                        userName: "Current User", // Replace with actual user data
                        userImage: defaultUserImg,
                        timestamp: "Just now"
                    }]
                };
            }
            return comment;
        }));
    };

    return (
        <div className="comments-area">
            <CommentInput onSubmit={handleAddComment} />
            <CommentsList
                comments={comments}
                onAddReply={handleAddReply}
            />
        </div>
    );
};

export default CommentsArea;