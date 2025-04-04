import React, { useState, useEffect } from 'react'
import ReferralCard from '../../features/ReferralCard/referral_card.jsx'
import SearchBox from '../../components/Filtering/SearchBox.jsx'
import axiosInstance from '../../../axios.config'
import { searchInObject } from '../../utils/searchUtils.js'

const ReferralPage = () => {
  const [referralData, setReferralData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredReferrals, setFilteredReferrals] = useState([]);

  const getReferrals = async () => {
    try {
      const response = await axiosInstance.get(`/referral/referral-list`);
      // console.log(response)
      // console.log(response.data.data)
      setReferralData(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const filterReferrals = () => {
      if (!searchQuery.trim()) {
        setFilteredReferrals(referralData);
        return;
      }

      const query = searchQuery.toLowerCase();
      const filtered = referralData.filter(referral =>
        searchInObject(referral, query)
      );
      setFilteredReferrals(filtered);
    };

    filterReferrals();
  }, [searchQuery, referralData])

  useEffect(() => {
    getReferrals();
  }, []);

  return (
    <div className='ReferralPage'>
      <SearchBox
        key="referralsPage"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        resultsCount={filteredReferrals.length}
      />
      {/* {console.log(referralData)} */}

      {filteredReferrals && filteredReferrals.map((referral, index) => (
        // console.log(index);
        // console.log(referral);
        <ReferralCard key={index} data={referral} />
      ))}
      {/* <ReferralCard />
      <ReferralCard />
      <ReferralCard /> */}
    </div>
  )
}

export default ReferralPage