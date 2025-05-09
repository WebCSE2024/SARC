import React from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import './profileHeader.scss';
import defaultProfileImg from '../../../public/NoProfileImg.png';

const profileHeader = ({personInfo, createdAt, eventId, eventData}) => {

    const getTimeAgo = (dateString) => {
        try {
            const date = parseISO(dateString);
            return formatDistanceToNow(date, { addSuffix: true});
        } catch (error) {
            // return 'Invalid date';
        }
    };

    return (
        <header className="accountDetails">
            <span className="accountInfo">
                <img src={(personInfo && personInfo.profilePicture) || eventData?.image?.url ||defaultProfileImg } alt="Profile Pic" className="profileImg" />
                <div className="accountTextDetails">
                    <div className='AccountTitle'>
                        {(personInfo && personInfo.name) || (`CSES IIT (ISM) Dhanbad`)}
                    </div>
                    <div className='TimeOfPost'>{getTimeAgo(createdAt)}</div>
                </div>
            </span>
            {eventData && eventData.type && (
                <div className="event-type">
                    {eventData.type}
                </div>
            )}
        </header>
    );
};

export default profileHeader;