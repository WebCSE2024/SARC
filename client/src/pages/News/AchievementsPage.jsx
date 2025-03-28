import React, { useState, useEffect } from 'react'
import Achievements from './NewsCards/AchievementsCard'
import SearchBox from '../../utils/Filtering/SearchBox'
import axiosInstance from '../../../axios.config'

const AchievementsPage = () => {
  const [achievementsData, setAchievementsData] = useState([]);

  const getAchievements = async () => {
    try {
      const response = await axiosInstance.get(`/achievements/achievement-list`);
      // console.log(response.data.data);
      // console.log(typeof(response.data.data));
      setAchievementsData(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    getAchievements();
  }, []);

  return (
    <div className='AchievementsPage'>
      <SearchBox />
      {achievementsData && achievementsData.map((achievement, index) => (
        <Achievements 
          key={achievement.id || index}
          data={achievement}
        />
      ))}
    </div>
  )
}

export default AchievementsPage