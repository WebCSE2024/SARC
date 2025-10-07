import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import EventsPage from "./EventsPage";
import AchievementsPage from "./AchievementsPage";
import SeminarsPage from "./SeminarsPage";
import "./News.scss";

const News = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("events");

  // Set the active tab based on the URL path when component mounts
  useEffect(() => {
    const path = location.pathname.split("/").pop();
    if (["events", "achievements", "seminars"].includes(path)) {
      setActiveTab(path);
    } else {
      // Default to events if no valid path
      setActiveTab("events");
    }
  }, [location.pathname]);

  // Handle tab selection
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/news/${tab}`);
  };

  // Render the appropriate content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case "events":
        return <EventsPage />;
      case "achievements":
        return <AchievementsPage />;
      case "seminars":
        return <SeminarsPage />;
      default:
        return <EventsPage />;
    }
  };

  return (
    <div className="news-container">
      <div className="news-tabs" role="tablist" aria-label="News categories">
        <button
          className={`tab ${activeTab === "events" ? "active" : ""}`}
          role="tab"
          aria-selected={activeTab === "events"}
          aria-controls="panel-events"
          onClick={() => handleTabChange("events")}
        >
          Events
        </button>
        <button
          className={`tab ${activeTab === "achievements" ? "active" : ""}`}
          role="tab"
          aria-selected={activeTab === "achievements"}
          aria-controls="panel-achievements"
          onClick={() => handleTabChange("achievements")}
        >
          Achievements
        </button>
        <button
          className={`tab ${activeTab === "seminars" ? "active" : ""}`}
          role="tab"
          aria-selected={activeTab === "seminars"}
          aria-controls="panel-seminars"
          onClick={() => handleTabChange("seminars")}
        >
          Seminars
        </button>
      </div>
      <div
        id={`panel-${activeTab}`}
        className="news-content"
        role="tabpanel"
        tabIndex={0}
        aria-label={`${activeTab} content`}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default News;
