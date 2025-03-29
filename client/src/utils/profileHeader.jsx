import React, { useState } from 'react'
import './profileHeader.scss'
import defaultProfileImg from '../assets/NoProfileImg.png'

const profileHeader = ({personInfo , eventId}) => {

    // console.log("personInfo:");
    // console.log(personInfo);

    // console.log(eventId); 
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
                    <div className='AccountTitle'>{(personInfo && personInfo.full_name) || (`IIT (ISM) Dhanbad`)}</div>

                    {/* <div className='follower-count'>29K followers</div> */}
                    {/* Follower count will be addded once we add the feature to follow people */}
                    <div className='TimeOfPost'>2 hours ago</div>
                </div>
            </span>

            {/* Bookmark feature possible */}
            {/* <span className='BookmarkSpan'>
                <input
                    type="checkbox"
                    id={`bookmark-chkbox-${eventId}`}
                    className='bookmark-chkbox'
                    checked={isBookmarked}
                    onChange={handleBookmarkChange}
                />

                <label htmlFor={`bookmark-chkbox-${eventId}`} className={`label-bookmark-chkbox ${eventId}`}>

                    <svg viewBox="0 0 48 48" height="24px" width="18px" version="1" xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 48 48">
                        <path fill={isBookmarked ? "#8D91B0" : "none"} d="M37,43l-13-6l-13,6V9c0-2.2,1.8-4,4-4h18c2.2,0,4,1.8,4,4V43z"></path>
                    </svg>

                </label>
            </span> */}
        </header>
    )
}

export default profileHeader