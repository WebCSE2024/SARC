import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import PropTypes from "prop-types";
import "./RoleBasedRoute.scss";

/**
 * TEMPORARY: RoleBasedRoute Component
 *
 * This component provides temporary role-based access control for specific routes.
 * It checks if the authenticated user has one of the allowed roles.
 *
 * TODO: Remove this temporary implementation when role-based access is no longer needed
 * or integrate it properly into the main routing architecture.
 *
 * @param {Array<string>} allowedRoles - Array of user types that can access the route
 * @param {string} redirectTo - Path to redirect unauthorized users (default: "/")
 */
const RoleBasedRoute = ({ allowedRoles = [], redirectTo = "/" }) => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking user data
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Verifying access...</p>
      </div>
    );
  }

  // Check if user exists and has a valid userType
  if (!user || !user.userType) {
    console.warn("RoleBasedRoute: User or userType not found");
    return <Navigate to={redirectTo} replace />;
  }

  // Check if user's role is in the allowed roles list
  const hasAccess = allowedRoles.includes(user.userType);

  if (!hasAccess) {
    console.warn(
      `RoleBasedRoute: Access denied. User type "${user.userType}" not in allowed roles:`,
      allowedRoles
    );
    return (
      <div className="access-denied-container">
        <div className="access-denied-content">
          <h2>Access Restricted</h2>
          <p>
            You do not have permission to access this section. This area is
            currently restricted to faculty and administrators.
          </p>
          <button onClick={() => (window.location.href = redirectTo)}>
            Go Back to Home
          </button>
        </div>
      </div>
    );
  }

  // User has the required role, render the child routes
  return <Outlet />;
};

RoleBasedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  redirectTo: PropTypes.string,
};

export default RoleBasedRoute;
