import { React, useEffect, useState } from 'react'
import axiosInstance from '../../../axios.config'
import EventsCard from '../../features/Events/EventsCard'
import HackathonCard from '../../features/Hackathon/HackathonCard'
import './EventsPage.scss'
// import FloatingBookmark from '../../utils/Filtering/FloatingBookmark'
import SearchBox from '../../components/Filtering/SearchBox'

// import TempTestCard from './TempTestCard'

const EventsPage = () => {

  const [eventData, setEventData] = useState([]);

  const getEventsData = async () => {
    try {
      const response = await axiosInstance.get('/event/event-list');
      console.log(response);
      console.log(response.data.data);
      setEventData(response.data.data);
    } catch (error) {
      console.log("error:", error);
    }
  }

  useEffect(()=>{
    getEventsData();
  },[]);


  return (
    <div className='eventsPage'>

      <SearchBox />

      {/* <FloatingBookmark elementId={`event-${123}`} /> */}
      {/* <TempTestCard /> */}

      {/* <h3>Hackathon:</h3> */}
      <HackathonCard posterImg={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvGVNKFKB3h0ay5aBrx-YVN_FcDgH6uf_lpjiGNtTpg1DOaTmRxca2WVB07obEBgS-CRQ&usqp=CAU`} />
      <HackathonCard />

      {/* <h3>Guest Talk:</h3> */}
      <EventsCard />

      <EventsCard />

    </div>
  )
}

export default EventsPage