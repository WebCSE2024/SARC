import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

import EventsPage from "./pages/News/NewsPage";
import PublicationsCard from "./pages/PublicationsPage/PublicationsCard";
import ReferralCard from "./pages/Referrals/referral_cards";
import AchievementsCard from "./pages/News/NewsCards/AchievementsCard";
import News from "./pages/News/NewsPage.jsx";
import Header from "./components/header";
import Footer from "./components/footer";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Header /> {/* Stays on all pages */}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/achievements" element={<AchievementsCard />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/referrals" element={<ReferralCard />} />
        <Route path="/publications" element={<PublicationsCard />} />
        <Route path="/news" element={<News />} />
        {/* Temporary Redirects */}
        <Route path="/signup" element={<Navigate to="/" />} />
        <Route path="/seminars" element={<Navigate to="/" />} />

        {/* 404 Not Found */}
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
      <Footer /> {/* Stays on all pages */}
    </BrowserRouter>
  </React.StrictMode>
);
