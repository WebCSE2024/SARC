import { React, useEffect, useState } from 'react';
import axiosInstance from '../../../axios.config';
import EventsCard from '../../features/Events/EventsCard';
import HackathonCard from '../../features/Hackathon/HackathonCard';
import hackathonData from '../../SampleData/hackathonData.json';
import eventsData from '../../SampleData/eventsData.json';
import './EventsPage.scss';
import SearchBox from '../../components/Filtering/SearchBox';
import { searchInObject } from '../../utils/searchUtils';
// import { set } from 'mongoose';

const EventsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [apiEvents, setApiEvents] = useState(eventsData.events);
  const [filteredEvents, setFilteredEvents] = useState(eventsData.events);
  const [apiHackathons, setApiHackathons] = useState(hackathonData.hackathons);
  const [filteredHackathons, setFilteredHackathons] = useState(hackathonData.hackathons);
  // const [mockHackathons] = useState(hackathonData.hackathons);
  // const [mockEvents] = useState(eventsData.events);

  const getHackathonsData = async () => {
    try {
      const response = await axiosInstance.get('/hackathon/hackathon-list');
      setApiEvents(response.data.data);
    } catch (error) {
      console.log("error:", error);
    }
  }

  useEffect(() => {
    const filterHackathons = () => {
      if (!searchQuery.trim()) {
        setFilteredHackathons(apiHackathons);
        return;
      }

      const query = searchQuery.toLowerCase();
      const filtered = apiHackathons.filter(Hacakathon =>
        searchInObject(Hacakathon, query)
      );
      setFilteredHackathons(filtered);
    };

    filterHackathons();
  }, [searchQuery, apiHackathons]);

  useEffect(() => {
    getHackathonsData();
  }, []);


  const getEventsData = async () => {
    try {
      const response = await axiosInstance.get('/event/event-list');
      setApiEvents(response.data.data);
    } catch (error) {
      console.log("error:", error);
    }
  }

  useEffect(() => {
    const filterEvents = () => {
      if (!searchQuery.trim()) {
        setFilteredEvents(apiEvents);
        return;
      }

      const query = searchQuery.toLowerCase();
      const filtered = apiEvents.filter(Events =>
        searchInObject(Events, query)
      );
      setFilteredEvents(filtered);
    };

    filterEvents();
  }, [searchQuery, apiEvents]);

  useEffect(() => {
    getEventsData();
  }, []);

  return (
    <div className='eventsPage'>
      <SearchBox
        key="events"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        resultsCount={filteredHackathons.length + filteredEvents.length}
      />

      <section className="hackathons-section">
        {/* <h2 className="section-title">Hackathons</h2> */}
        {filteredHackathons.map((hackathon, index) => (
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
        {filteredEvents.map((event, index) => (
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