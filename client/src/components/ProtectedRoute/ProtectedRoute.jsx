import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { authAPI } from "../../../../../shared/axios/axiosInstance";
import "./ProtectedRoute.scss";

// Component to protect routes that require authentication
const ProtectedRoute = () => {
  const { isAuthenticated, loading, token, logout } = useAuth();
  const [validatingToken, setValidatingToken] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const location = useLocation();

  // Effect to validate token on route change or when token changes
  useEffect(() => {
    const validateToken = async () => {
      // If no token or already logged out, no need to validate
      if (!token) {
        setTokenValid(false);
        return;
      }

      try {
        setValidatingToken(true);
        const response = await authAPI.get("/auth-system/v0/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Token is valid if the request succeeds
        setTokenValid(response.data.success);

        if (!response.data.success) {
          // If token is invalid, clear authentication state
          logout();
        }
      } catch (error) {
        console.error("Token validation error:", error);
        setTokenValid(false);
        // If token validation fails, clear authentication state
        logout();
      } finally {
        setValidatingToken(false);
      }
    };

    validateToken();
  }, [token, location.pathname]);

  // If authentication is still loading or validating token, show a loading spinner
  if (loading || validatingToken) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if user is not authenticated or token is invalid
  return isAuthenticated() && tokenValid ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

export default ProtectedRoute;
