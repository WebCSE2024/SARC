import React, { useState, useEffect } from "react";
import ReferralCard from "../../features/ReferralCard/referral_card.jsx";
import SearchBox from "../../components/Filtering/SearchBox.jsx";
import { searchInObject } from "../../utils/searchUtils.js";
import { sarcAPI } from "../../../../../shared/axios/axiosInstance.js";

const ReferralPage = () => {
  const [referralData, setReferralData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredReferrals, setFilteredReferrals] = useState([]);

  const getReferrals = async () => {
    try {
      const response = await sarcAPI.get(`sarc/v0/referral/active`);
      setReferralData(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const filterReferrals = () => {
      if (!searchQuery.trim()) {
        setFilteredReferrals(referralData);
        return;
      }

      const query = searchQuery.toLowerCase();
      const filtered = referralData.filter((referral) =>
        searchInObject(referral, query)
      );
      setFilteredReferrals(filtered);
    };

    filterReferrals();
  }, [searchQuery, referralData]);

  useEffect(() => {
    getReferrals();
  }, []);

  return (
    <div className="ReferralPage">
      <SearchBox
        key="referralsPage"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        resultsCount={filteredReferrals.length}
      />

      {filteredReferrals &&
        filteredReferrals.map((referral, index) => (
          <ReferralCard key={index} data={referral} />
        ))}

    </div>
  );
};

export default ReferralPage;
