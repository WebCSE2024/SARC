import { React, useEffect, useState } from 'react';
import axiosInstance from '../../../axios.config';
import EventsCard from '../../features/Events/EventsCard';
import HackathonCard from '../../features/Hackathon/HackathonCard';
import hackathonData from '../../SampleData/hackathonData.json';
import eventsData from '../../SampleData/eventsData.json';
import './EventsPage.scss';
import SearchBox from '../../components/Filtering/SearchBox';

const EventsPage = () => {
  const [apiEvents, setApiEvents] = useState([]);
  const [hackathons] = useState(hackathonData.hackathons);
  const [mockEvents] = useState(eventsData.events);

  const getEventsData = async () => {
    try {
      const response = await axiosInstance.get('/event/event-list');
      setApiEvents(response.data.data);
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
            posterImg={hackathon.img_url}
          />
        ))}
      </section>

      <section className="events-section">
        {/* <h2 className="section-title">Events</h2> */}
        {/* API Events */}
        {/* {apiEvents.map((event, index) => (
          <EventsCard
            key={event.id || `api_${index}`}
            data={event}
          />
        ))} */}
        
        {/* Mock Events */}
        {mockEvents.map((event, index) => (
          <EventsCard
            key={event.id || `mock_${index}`}
            data={event}
          />
        ))}
      </section>
    </div>
  );
};

export default EventsPage;