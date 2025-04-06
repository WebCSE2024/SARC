import React, { useState, useEffect } from 'react'
import Achievements from '../../features/Achievements/AchievementsCard'
import SearchBox from '../../components/Filtering/SearchBox'
import axiosInstance from '../../../axios.config'
import mockAchievements from '../../SampleData/achievementsData.json'
import { searchInObject } from '../../utils/searchUtils'
import {sarcAPI} from "../../../../../shared/axios/axiosInstance.js"

const AchievementsPage = () => {
  const [mockData] = useState(mockAchievements.achievements);
  const [apiAchievements, setApiAchievements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAchievements, setFilteredAchievements] = useState([]);

  const getAchievements = async () => {
    try {
      const response = await sarcAPI.get(`sarc/v0/achievement/achievement-list`);
      setApiAchievements(response.data.data);
    } catch (error) {
      console.error('Error:', error);
      setApiAchievements(mockAchievements.achievements);
    }
  };

  // Filter achievements based on search query
  useEffect(() => {
    const filterAchievements = () => {
      if (!searchQuery.trim()) {
        setFilteredAchievements(apiAchievements);
        return;
      }

      const query = searchQuery.toLowerCase();
      const filtered = apiAchievements.filter(achievement => 
        searchInObject(achievement,query)
        // achievement.title.toLowerCase().includes(query) ||
        // achievement.description.toLowerCase().includes(query)
      );
      setFilteredAchievements(filtered);
    };

    filterAchievements();
  }, [searchQuery, apiAchievements]);

  useEffect(() => {
    getAchievements();
  }, []);

  return (
    <div className='AchievementsPage'>
      <SearchBox 
        key="achievements"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        // resultsCount={filteredAchievements.length}
      />
      
      {/* Display Filtered Achievements */}
      {filteredAchievements.map((achievement, index) => (
        <Achievements 
          key={achievement.id || `achievement_${index}`}
          data={achievement}
        />
      ))}

      {/* Display Mock Achievements */}
      {/* {mockData && mockData.map((achievement, index) => (
        <Achievements 
          key={achievement.id || `mock_${index}`}
          data={achievement}
        />
      ))} */}
    </div>
  )
}

export default AchievementsPage