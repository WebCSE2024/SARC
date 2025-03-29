import { React, useEffect, useState } from 'react';
import axiosInstance from '../../../axios.config';
import EventsCard from '../../features/Events/EventsCard';
import HackathonCard from '../../features/Hackathon/HackathonCard';
import hackathonData from '../../data/hackathonData.json';
import './EventsPage.scss';
import SearchBox from '../../components/Filtering/SearchBox';

const EventsPage = () => {
  const [eventData, setEventData] = useState([]);
  const [hackathons] = useState(hackathonData.hackathons);

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

  useEffect(() => {
    getEventsData();
  }, []);

  return (
    <div className='eventsPage'>
      <SearchBox />

      <section className="hackathons-section">
        {/* <h2 className="section-title">Hackathons</h2> */}
        {hackathons.map((hackathon, index) => (
          <HackathonCard
            key={hackathon.id || `hack_${index}`}
            data={hackathon}
            posterImg={hackathon.posterImage}
          />
        ))}
      </section>

      <section className="events-section">
        {/* <h2 className="section-title">Events</h2> */}
        <EventsCard />
        <EventsCard />
      </section>


      <HackathonCard posterImg={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvGVNKFKB3h0ay5aBrx-YVN_FcDgH6uf_lpjiGNtTpg1DOaTmRxca2WVB07obEBgS-CRQ&usqp=CAU`} />
      <HackathonCard />

      <EventsCard />
      <EventsCard />

    </div>
  );
};

export default EventsPage;