import { Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import SIGOverview from "../pages/SIGs/SIGOverview";
import SIGDetail from "../pages/SIGs/SIGDetail";
import ReferralPage from "../pages/Referrals/ReferralPage";
import PublicationsPage from "../pages/PublicationsPage/PublicationsPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import PostReferral from "../pages/PostReferral/PostReferral";
import PostPublication from "../pages/PostPublication/PostPublication";

// TEMPORARY: Import RoleBasedRoute for restricting SIG routes
// TODO: Remove this import when role-based access is no longer needed
import RoleBasedRoute from "../components/RoleBasedRoute/RoleBasedRoute";
import { UserType } from "../../../../shared/types/user.type";

export const protectedRoutes = [
  // Main content
  {
    path: "/",
    element: <HomePage />,
  },

  // TEMPORARY: Special Interest Groups (SIGs) - Restricted to ADMIN and PROFESSOR
  // TODO: Uncomment the original routes below and remove this section when restriction is lifted
  // Original routes (commented out):
  // {
  //   path: "/sig",
  //   element: <SIGOverview />,
  // },
  // {
  //   path: "/sig/:domain",
  //   element: <SIGDetail />,
  // },

  // Temporary role-restricted SIG routes
  {
    path: "/sig",
    element: (
      <RoleBasedRoute allowedRoles={[UserType.ADMIN, UserType.PROFESSOR, UserType.STUDENT]} />
    ),
    children: [
      {
        index: true,
        element: <SIGOverview />,
      },
      {
        path: ":domain",
        element: <SIGDetail />,
      },
    ],
  },
  // Referrals
  {
    path: "/referrals",
    element: <ReferralPage />,
  },
  {
    path: "/post-referral",
    element: (<RoleBasedRoute allowedRoles={[UserType.ADMIN, UserType.PROFESSOR, UserType.ALUMNI]} />),
    children: [
      {
        index: true,
        element: <PostReferral />,  
      }
    ],
  },
  // User profile
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/profile/:id",
    element: <ProfilePage />,
  },

  // Publications
  {
    path: "/publications",
    element: <PublicationsPage />,
  },
  {
    path: "/post-publication",
    element: (<RoleBasedRoute allowedRoles={[UserType.ADMIN, UserType.PROFESSOR, UserType.ALUMNI]} />),
    children: [{
      index: true,
      element: <PostPublication />,
    }],
  },
];
