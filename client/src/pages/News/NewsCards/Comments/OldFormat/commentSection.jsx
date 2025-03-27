import React from "react";
import "./commentSection.scss";
import Comment from "./comment.jsx";
import Reply from "./reply.jsx";
import pic from "../../../../assets/NoProfileImg.png";

const CommentSection = () => {
    return (
        <div className="body">
            <div className="top-block">
                <div className="photo">
                    <img src={pic} alt="PHOTO" width="28" height="28" />
                </div>
                <div className="comment-box">
                    {/* <p className="text">Add a comment...</p> */}
                    <input type="text" className="text" placeholder="Add a comment..." />
                </div>
                <div className="send">
                    <div className="send-icon">
                        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.9203 9.54318L1.54202 16.8531C1.25411 17.0011 0.980454 16.9692 0.721048 16.7574C0.462354 16.5448 0.333008 16.2377 0.333008 15.8364V1.16514C0.333008 0.762888 0.462711 0.455416 0.722117 0.242728C0.98081 0.0300411 1.25411 -0.00139945 1.54202 0.148406L14.9203 7.45699C15.2695 7.65858 15.4441 8.00628 15.4441 8.50008C15.4441 8.99389 15.2695 9.34159 14.9203 9.54318ZM1.40199 15.4355L14.0694 8.50008L1.40199 1.56463V6.95348L6.58227 8.50008L1.40199 10.0481V15.4355Z" fill="#8D91B0" />
                        </svg>

                    </div>


                </div>
            </div>


            <div className="commentsWrapper">
                < Comment />

                <div className="reply">
                    < Reply />
                    < Reply />
                </div>


                < Comment />

            </div>


        </div>

    );
};

export default CommentSection; // Ensure export matches the component name
