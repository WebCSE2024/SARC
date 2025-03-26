import React from 'react'
import './TempTestCard.scss'
import HackathonCard from './NewsCards/HackathonCard'
import CommentSection from './NewsCards/Comments/commentSection'
const TempTestCard = () => {
    return (
        <div className='tempTestCard'>
            <HackathonCard />
            <div className="commentsCardWrapper">
                <CommentSection />
            </div>
        </div>
    )
}

export default TempTestCard