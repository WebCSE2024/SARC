import { Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import SIGOverview from "../pages/SIGs/SIGOverview";
import SIGDetail from "../pages/SIGs/SIGDetail";
import ReferralPage from "../pages/Referrals/ReferralPage";
import PublicationsPage from "../pages/PublicationsPage/PublicationsPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import PostReferral from "../pages/PostReferral/PostReferral";
import PostPublication from "../pages/PostPublication/PostPublication";

// These routes are now also protected but categorized as "main content"
export const appRoutes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/sig",
    element: <SIGOverview />,
  },
  {
    path: "/sig/:domain",
    element: <SIGDetail />,
  },
  {
    path: "/referrals",
    element: <ReferralPage />,
  },
  {
    path: "/publications",
    element: <PublicationsPage />,
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
