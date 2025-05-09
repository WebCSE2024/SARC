import { React, useEffect, useState } from 'react'
import PublicationsCard from './PublicationsCard'
import SearchBox from '../../components/Filtering/SearchBox'
import { searchInObject } from '../../utils/searchUtils'
import { sarcAPI } from '../../../../../shared/axios/axiosInstance'


const PublicationsPage = () => {

    const [PublicationsData, setPublicationsData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPublications, setFilteredPublications] = useState([]);


    const getPublications = async () => {
        try {
            const response = await sarcAPI.get(`/publication/publication-list`);
            setPublicationsData(response.data.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const filterPublications = () => {
            if (!searchQuery.trim()) {
                setFilteredPublications(PublicationsData);
                return;
            }

            const query = searchQuery.toLowerCase();
            const filtered = PublicationsData.filter(Publication =>
                searchInObject(Publication, query)
            );
            setFilteredPublications(filtered);
        };

        filterPublications();
    }, [searchQuery, PublicationsData]);


    useEffect(() => {
        getPublications();
    }, []);


    return (
        <div className='PublicationsPage'>
            <SearchBox
                key="publications"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                resultsCount={filteredPublications.length}
            />

            {filteredPublications.map((publ_data, index) => {
                // console.log(publ_data);
                return <PublicationsCard key={index} data={publ_data} />;
            })}

            {/* <PublicationsCard />
            <PublicationsCard />
            <PublicationsCard /> */}
        </div>
    )
}

export default PublicationsPage