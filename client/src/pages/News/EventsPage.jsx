import { React, useEffect, useState } from 'react';
import EventsCard from '../../features/Events/EventsCard';
import eventsData from '../../SampleData/eventsData.json';
import './EventsPage.scss';
import SearchBox from '../../components/Filtering/SearchBox';
import { searchInObject } from '../../utils/searchUtils';
import {csesAPI} from "../../../../../shared/axios/axiosInstance"

const EventsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [apiEvents, setApiEvents] = useState(eventsData.events);
  const [filteredEvents, setFilteredEvents] = useState(eventsData.events);


  const getEventsData = async () => {
    try {
      const response = await csesAPI.get('/cses/v0/events');
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
        resultsCount={filteredEvents.length}
      />



      <section className="events-section">
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