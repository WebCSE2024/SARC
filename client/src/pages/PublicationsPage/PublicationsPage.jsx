import { React, useEffect, useState } from 'react'
import axiosInstance from '../../../axios.config'
import PublicationsCard from './PublicationsCard'
import SearchBox from '../../utils/Filtering/SearchBox'



const PublicationsPage = () => {

    const [PublicationsData, setPublicationsData] = useState([]);

    const getPublications = async () => {
        try {
            const response = await axiosInstance.get(`/publication/publications-list`);
            console.log(response)
            console.log(response.data.data)
            setPublicationsData(response.data.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };


    useEffect(() => {
        getPublications();
    }, []);


    return (
        <div className='PublicationsPage'>
            <SearchBox />
            <PublicationsCard />
            <PublicationsCard />
            <PublicationsCard />
        </div>
    )
}

export default PublicationsPage