import React from 'react'
import Achievements from './NewsCards/AchievementsCard'
import SearchBox from '../../utils/Filtering/SearchBox'

const AchievementsPage = () => {
  return (
    <div className='AchievementsPage'>
        <SearchBox />
        <Achievements />
        <Achievements />
        <Achievements />
    </div>
  )
}

export default AchievementsPage 