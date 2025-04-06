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
      <div className="news-tabs">
        <div
          className={`tab ${activeTab === "events" ? "active" : ""}`}
          onClick={() => handleTabChange("events")}
        >
          Events
        </div>
        <div
          className={`tab ${activeTab === "achievements" ? "active" : ""}`}
          onClick={() => handleTabChange("achievements")}
        >
          Achievements
        </div>
        <div
          className={`tab ${activeTab === "seminars" ? "active" : ""}`}
          onClick={() => handleTabChange("seminars")}
        >
          Seminars
        </div>
      </div>
      <div className="news-content">{renderContent()}</div>
    </div>
  );
};

export default News;
