import React, { useState, useEffect, useMemo } from "react";
import ReferralCard from "../../features/ReferralCard/referral_card.jsx";
import { searchInObject } from "../../utils/searchUtils.js";
import { sarcAPI } from "../../../../../shared/axios/axiosInstance.js";
import { FaSearch, FaTimes, FaBriefcase, FaFilter } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";
import "./ReferralPage.scss";

const ReferralPage = () => {
  const [referralData, setReferralData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredReferrals, setFilteredReferrals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const getReferrals = async () => {
    setIsLoading(true);
    try {
      const response = await sarcAPI.get(`sarc/v0/referral/active`);
      setReferralData(response.data.data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const workModes = useMemo(() => {
    const modes = new Set(["all"]);
    referralData.forEach((r) => {
      if (r.mode) modes.add(r.mode.toLowerCase());
    });
    return Array.from(modes);
  }, [referralData]);

  useEffect(() => {
    const filterAndSortReferrals = () => {
      let result = [...referralData];

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        result = result.filter((referral) => searchInObject(referral, query));
      }

      // Filter by work mode
      if (selectedMode !== "all") {
        result = result.filter(
          (referral) => referral.mode?.toLowerCase() === selectedMode
        );
      }

      // Sort
      if (sortBy === "latest") {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sortBy === "deadline") {
        result.sort((a, b) => {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline) - new Date(b.deadline);
        });
      } else if (sortBy === "stipend") {
        result.sort(
          (a, b) => (b.stipend?.amount || 0) - (a.stipend?.amount || 0)
        );
      }

      setFilteredReferrals(result);
    };

    filterAndSortReferrals();
  }, [searchQuery, referralData, selectedMode, sortBy]);

  useEffect(() => {
    getReferrals();
  }, []);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="referral-page">
      {/* Hero Section */}
      <section className="referral-page__hero">
        <div className="referral-page__hero-content container">
          <div className="referral-page__hero-badge">
            <HiOutlineSparkles />
            <span>Career Opportunities</span>
          </div>
          <h1 className="referral-page__title">Job Referrals</h1>
          <p className="referral-page__subtitle">
            Discover exclusive job opportunities shared by our CSES
            members. Get referred directly to top companies and accelerate your
            career.
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="referral-page__controls container">
        <div className="referral-page__search-wrapper">
          <div className="referral-page__search" role="search">
            <FaSearch
              className="referral-page__search-icon"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search by company, role, location..."
              className="referral-page__search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search referrals"
            />
            {searchQuery && (
              <button
                type="button"
                className="referral-page__search-clear"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        <div className="referral-page__filters">
          <div className="referral-page__filter-group">
            <FaFilter className="referral-page__filter-icon" />
            <select
              className="referral-page__select"
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              aria-label="Filter by work mode"
            >
              {workModes.map((mode) => (
                <option key={mode} value={mode}>
                  {mode === "all"
                    ? "All Work Modes"
                    : mode.charAt(0).toUpperCase() + mode.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="referral-page__filter-group">
            <select
              className="referral-page__select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort referrals"
            >
              <option value="latest">Latest First</option>
              <option value="deadline">Deadline Soon</option>
              <option value="stipend">Highest Stipend</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="referral-page__results-info">
          <FaBriefcase />
          <span>
            {filteredReferrals.length}{" "}
            {filteredReferrals.length === 1 ? "opportunity" : "opportunities"}{" "}
            found
          </span>
        </div>
      </section>

      {/* Referral Cards Grid */}
      <section className="referral-page__content container">
        {isLoading ? (
          <div className="referral-page__loading">
            <div className="referral-page__spinner"></div>
            <p>Loading opportunities...</p>
          </div>
        ) : filteredReferrals.length > 0 ? (
          <div className="referral-page__grid">
            {filteredReferrals.map((referral, index) => (
              <ReferralCard
                key={referral.referralId || index}
                data={referral}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="referral-page__empty">
            <div className="referral-page__empty-icon">
              <FaBriefcase />
            </div>
            <h3>No referrals found</h3>
            <p>
              {searchQuery || selectedMode !== "all"
                ? "Try adjusting your search or filters"
                : "Check back later for new opportunities"}
            </p>
            {(searchQuery || selectedMode !== "all") && (
              <button
                className="referral-page__reset-btn"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedMode("all");
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ReferralPage;
