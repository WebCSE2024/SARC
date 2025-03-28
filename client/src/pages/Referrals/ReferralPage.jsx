import React, { useState, useEffect } from 'react'
import ReferralCard from './Referral_card.jsx'
import SearchBox from '../../utils/Filtering/SearchBox'
import axiosInstance from '../../../axios.config'

const ReferralPage = () => {
  const [referralData, setReferralData] = useState([]);

  const getReferrals = async () => {
    try {
      const response = await axiosInstance.get(`/referral/referral-list`);
      // console.log(response)
      console.log(response.data.data)
      setReferralData(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };


  useEffect(() => {
    getReferrals();
  }, []);

  return (
    <div className='ReferralPage'>
      <SearchBox />
      {/* {console.log(referralData)} */}

      {referralData && referralData.map((referral, index) => (
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