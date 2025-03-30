import React from 'react'
import EventsCard from '../../features/Events/EventsCard'
import SearchBox from '../../components/Filtering/SearchBox'
import seminarsDataObj from '../../SampleData/seminarData.json'

const SeminarsPage = () => {
    console.log(seminarsDataObj);
    console.log(typeof(seminarsDataObj.seminars));
    const seminarsData=seminarsDataObj.seminars
    return (
        <div className='SeminarsPage'>

            <SearchBox />

            {seminarsData.map((Sem_data, index) => (
                <EventsCard data={Sem_data}/>
            ))}

            {/* <EventsCard />
            <EventsCard /> */}

        </div>
    )
}

export default SeminarsPage