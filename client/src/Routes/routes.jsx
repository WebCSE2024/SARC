import { Navigate } from "react-router-dom";
import HomePage from '../pages/HomePage/HomePage';
import Achievements from '../pages/News/AchievementsPage';
import EventsPage from '../pages/News/EventsPage';
import ReferralPage from '../pages/Referrals/ReferralPage';
import PublicationsPage from '../pages/PublicationsPage/PublicationsPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import SeminarsPage from '../pages/News/SeminarsPage';
import PostReferral from '../pages/PostReferral/PostReferral';
import PostPublication from '../pages/PostPublication/PostPublications';

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
    path: "/signup",
    element: <LoginPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/seminars",
    element: <SeminarsPage />,
  },
  {
    path: "/PostReferrals",
    element: <PostReferral />,
  },
  {
    path: "/PostPublication",
    element: <PostPublication />,
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  }
];