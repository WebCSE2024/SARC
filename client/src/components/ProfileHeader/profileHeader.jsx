import React from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import './profileHeader.scss';
import defaultProfileImg from '../../../public/NoProfileImg.png';

const profileHeader = ({personInfo, createdAt, eventId}) => {
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
                <img src={defaultProfileImg} alt="not presenet" className="profileImg" />
                <div className="accountTextDetails">
                    <div className='AccountTitle'>
                        {(personInfo && personInfo.full_name) || (`IIT (ISM) Dhanbad`)}
                    </div>
                    <div className='TimeOfPost'>{getTimeAgo(createdAt)}</div>
                </div>
            </span>
        </header>
    );
};

export default profileHeader;