import React from 'react'
import ReferralCard from './referral_card'
import SearchBox from '../../utils/Filtering/SearchBox'

const ReferralPage = () => {
  return (
    <div className='ReferralPage'>
        <SearchBox />
        <ReferralCard />
        <ReferralCard />
        <ReferralCard />
    </div>
  )
}

export default ReferralPage