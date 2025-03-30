import React, { useState, useEffect } from 'react'
import Achievements from '../../features/Achievements/AchievementsCard'
import SearchBox from '../../components/Filtering/SearchBox'
import axiosInstance from '../../../axios.config'
import mockAchievements from '../../SampleData/achievementsData.json'

const AchievementsPage = () => {
  const [apiAchievements, setApiAchievements] = useState([]);
  const [mockData] = useState(mockAchievements.achievements);

  const getAchievements = async () => {
    try {
      const response = await axiosInstance.get(`/achievements/achievement-list`);
      setApiAchievements(response.data.data);
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
      
      {/* Display API Achievements */}
      {apiAchievements && apiAchievements.map((achievement, index) => (
        <Achievements 
          key={achievement.id || `api_${index}`}
          data={achievement}
        />
      ))}

      {/* Display Mock Achievements */}
      {mockData && mockData.map((achievement, index) => (
        <Achievements 
          key={achievement.id || `mock_${index}`}
          data={achievement}
        />
      ))}
    </div>
  )
}

export default AchievementsPage