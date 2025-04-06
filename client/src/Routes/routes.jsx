import { Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import News from "../pages/News/News";
import ReferralPage from "../pages/Referrals/ReferralPage";
import PublicationsPage from "../pages/PublicationsPage/PublicationsPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import PostReferral from "../pages/PostReferral/PostReferral";
import PostPublication from "../pages/PostPublication/PostPublications";

// These routes are now also protected but categorized as "main content"
export const appRoutes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/news",
    element: <Navigate to="/news/events" replace />,
  },
  {
    path: "/news/:tab",
    element: <News />,
  },
  {
    path: "/referrals",
    element: <ReferralPage />,
  },
  {
    path: "/publications",
    element: <PublicationsPage />,
  },
  // Legacy URL support - redirect old URLs to the new News component
  {
    path: "/events",
    element: <Navigate to="/news/events" replace />,
  },
  {
    path: "/achievements",
    element: <Navigate to="/news/achievements" replace />,
  },
  {
    path: "/seminars",
    element: <Navigate to="/news/seminars" replace />,
  },
];

// User-specific and content creation routes
export const protectedRoutes = [
  // User profile
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/profile/:id",
    element: <ProfilePage />,
  },

  // Content creation
  {
    path: "/post-referral",
    element: <PostReferral />,
  },
  {
    path: "/post-publication",
    element: <PostPublication />,
  },

  // Legacy URL support
  {
    path: "/PostReferrals",
    element: <Navigate to="/post-referral" replace />,
  },
  {
    path: "/PostPublication",
    element: <Navigate to="/post-publication" replace />,
  },
];
