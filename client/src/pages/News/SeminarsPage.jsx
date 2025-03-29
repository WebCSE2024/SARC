import React from 'react'
import EventsCard from '../../features/Events/EventsCard'
import SearchBox from '../../components/Filtering/SearchBox'

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