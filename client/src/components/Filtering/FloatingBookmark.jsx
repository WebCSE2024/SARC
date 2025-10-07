import React from 'react'
import { useState } from 'react';
import './FloatingBookmark.scss'

const FloatingBookmark = ({ elementId }) => {

    const [isBookmarked, setIsBookmarked] = useState(false);

    const handleBookmarkFiler = (e) => {
        setIsBookmarked(e.target.checked);
        // Here we will add logic to save the bookmark state to backend/localStorage
    };

    return (
        <div className='FloatingBookmark'>
                <input
                    type="checkbox"
                    id={`bookmark-chkbox-${elementId}`}
                    className='bookmark-chkbox'
                    checked={isBookmarked}
                    onChange={handleBookmarkFiler}
                />

                <label htmlFor={`bookmark-chkbox-${elementId}`} className={`label-bookmark-chkbox`}>
                    {/* <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={isBookmarked ? "#000000" : "#8D91B0"}>
                  <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Z" />
                </svg> */}

                    <svg className='Bookmark-svg' viewBox="0 0 48 48" height="24px" width="18px" version="1" xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 48 48">
                        <path fill={isBookmarked ? "#8D91B0" : "none"} d="M37,43l-13-6l-13,6V9c0-2.2,1.8-4,4-4h18c2.2,0,4,1.8,4,4V43z"></path>
                    </svg>

                </label>
        </div>
    )
}

export default FloatingBookmark