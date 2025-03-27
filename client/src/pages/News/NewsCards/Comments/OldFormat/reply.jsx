import React from 'react'
import "./reply.scss";

import pic from "../../../../assets/NoProfileImg.png"

const Reply = () => {
    return (
        
            <div className="reply-box">
                <div className="profile">
                    <div className="photo">
                        <img src={pic} alt="PHOTO" width="28" height="28" />
                    </div>
                    <div className="profile-desc">
                        <p className="name">
                            John Doe
                        </p>
                        <p className="description">
                            XYZ | ABC | DEF at IIT (ISM) Dhanbad
                        </p>
                    </div>

                </div>
                <div className="reply">
                    <p className="reply-text">
                        Can’t wait for this. njksdbhjxb nbhxbns hsnmxnmjkxhndxjksn. hello world.
                        Thank you.
                    </p>
                </div>
                <div className="like-reply">
                    <div className="like">
                        <div className="like-text">
                            <p className="likes">Like</p>
                            <span className="like-number"> - 40 Likes</span>
                        </div>
                    </div>
                    <div className="reply-no">
                        <div className="reply-no-text">
                            <p className="replies">Reply</p>
                            <span className="reply-number"> - 2 Relies</span>
                        </div>
                    </div>
                </div>
            </div>

    )
}

export default Reply;
