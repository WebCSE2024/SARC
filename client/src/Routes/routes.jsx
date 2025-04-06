import { Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import Achievements from "../pages/News/AchievementsPage";
import EventsPage from "../pages/News/EventsPage";
import ReferralPage from "../pages/Referrals/ReferralPage";
import PublicationsPage from "../pages/PublicationsPage/PublicationsPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import SeminarsPage from "../pages/News/SeminarsPage";
import PostReferral from "../pages/PostReferral/PostReferral";
import PostPublication from "../pages/PostPublication/PostPublications";

// Public routes that don't require authentication
export const appRoutes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/achievements",
    element: <Achievements />,
  },
  {
    path: "/events",
    element: <EventsPage />,
  },
  {
    path: "/referrals",
    element: <ReferralPage />,
  },
  {
    path: "/publications",
    element: <PublicationsPage />,
  },
  {
    path: "/news",
    element: <Navigate to="/events" />,
  },
  {
    path: "/seminars",
    element: <SeminarsPage />,
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
];

// Protected routes that require authentication
export const protectedRoutes = [
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/PostReferrals",
    element: <PostReferral />,
  },
  {
    path: "/PostPublication",
    element: <PostPublication />,
  },
];
