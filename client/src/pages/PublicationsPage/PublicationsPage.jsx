import React from 'react'
import PublicationsCard from './PublicationsCard'
import SearchBox from '../../utils/Filtering/SearchBox'

const PublicationsPage = () => {
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