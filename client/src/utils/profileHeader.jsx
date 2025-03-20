import React, { useState } from 'react'
import './profileHeader.scss'
import defaultProfileImg from '../assets/NoProfileImg.png'

const profileHeader = ({eventType}) => {

    // console.log(eventType); 
    const [isBookmarked, setIsBookmarked] = useState(false);

    const handleBookmarkChange = (e) => {
      setIsBookmarked(e.target.checked);
      // Here we will add logic to save the bookmark state to backend/localStorage
    };

    return (
        <header className="accountDetails">
            <span className="accountInfo">
                <img src={defaultProfileImg} alt="not presenet" className="profileImg" />
                <div className="accountTextDetails">
                    {/* Handle overflow in title by not displaying the extras. or putting ... */}
                    <div className='AccountTitle'>Department of Computer Science and Engineering, IIT (ISM) Dhanbad</div>

                    <div className='follower-count'>29K followers</div>
                    {/* Follower count will be addded once we add the feature to follow people */}
                    <div className='TimeOfPost'>2 hours ago</div>
                </div>
            </span>

            <span className='BookmarkSpan'>
                <input
                    type="checkbox"
                    id={`bookmark-chkbox-${eventType}`}
                    className='bookmark-chkbox'
                    checked={isBookmarked}
                    onChange={handleBookmarkChange}
                />

                <label htmlFor={`bookmark-chkbox-${eventType}`} className={`label-bookmark-chkbox ${eventType}`}>
                    {/* <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={isBookmarked ? "#000000" : "#8D91B0"}>
                  <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Z" />
                </svg> */}

                    <svg viewBox="0 0 48 48" height="24px" width="18px" version="1" xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 48 48">
                        <path fill={isBookmarked ? "#8D91B0" : "none"} d="M37,43l-13-6l-13,6V9c0-2.2,1.8-4,4-4h18c2.2,0,4,1.8,4,4V43z"></path>
                    </svg>

                </label>
            </span>
        </header>
    )
}

export default profileHeader