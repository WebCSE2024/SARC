import React from 'react'
import EventsCard from './NewsCards/EventsCard'
import SearchBox from '../../utils/Filtering/SearchBox'

const SeminarsPage = () => {
    return (
        <div className='SeminarsPage'>

            <SearchBox />

            <EventsCard />
            <EventsCard />

        </div>
    )
}

export default SeminarsPage