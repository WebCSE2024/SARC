import React, { useState, useEffect } from 'react'
import EventsCard from '../../features/Events/EventsCard'
import SearchBox from '../../components/Filtering/SearchBox'
// import axiosInstance from '../../../axios.config'
import { searchInObject } from '../../utils/searchUtils'
import {sarcAPI} from "../../../../../shared/axios/axiosInstance.js"

const SeminarsPage = () => {
    const [apiSeminars, setApiSeminars] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSeminars, setFilteredSeminars] = useState([]);

    const getSeminars = async () => {
        try {
            const response = await sarcAPI.get(`sarc/v0/seminar/seminar-list`);
        
            setApiSeminars(response.data.data);
        } catch (error) {
            console.error('Error:', error);
            setApiSeminars([]); // Set empty array on error
        }
    };

    useEffect(() => {
        const filterSeminars = () => {
            if (!searchQuery.trim()) {
                setFilteredSeminars(apiSeminars);
                return;
            }

            const query = searchQuery.toLowerCase();
            const filtered = apiSeminars.filter(seminar => 
                searchInObject(seminar, query)
            );
            setFilteredSeminars(filtered);
        };

        filterSeminars();
    }, [searchQuery, apiSeminars]);

    useEffect(() => {
        getSeminars();
    }, []);

    return (
        <div className="seminars-page">
            <SearchBox
                key="seminars"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                resultsCount={filteredSeminars.length}
            />

            {filteredSeminars.map((seminar, index) => (
                <EventsCard 
                    data={seminar} 
                    key={seminar.id || `seminar-${index}`} 
                />
            ))}
        </div>
    );
};

export default SeminarsPage;