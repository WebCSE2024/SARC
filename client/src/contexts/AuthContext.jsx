import React, { createContext, useState, useContext, useEffect } from "react";
import { authAPI } from "../../../../shared/axios/axiosInstance";
import jwt_decode from "jwt-decode";

// Create authentication context
const AuthContext = createContext();

// Custom hook for easy access to auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [credentialsVerified, setCredentialsVerified] = useState(false);
  const [verifiedCredentials, setVerifiedCredentials] = useState(null);

  // Check if user is already logged in (token in localStorage)
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          // Verify token is not expired
          try {
            const decoded = jwt_decode(storedToken);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
              // Token has expired
              throw new Error("Token expired");
            }

            setToken(storedToken);

            // Get user data using the token
            const response = await authAPI.get("/auth-system/v0/auth/me", {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            });

            if (response.data && response.data.success) {
              setUser(response.data.user);
            } else {
              // If token is invalid, clear it
              localStorage.removeItem("token");
              setToken(null);
            }
          } catch (error) {
            console.error("Invalid or expired token:", error);
            localStorage.removeItem("token");
            setToken(null);
          }
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        localStorage.removeItem("token");
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Listen for storage changes (for multi-tab logout)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token" && !e.newValue) {
        // Token was removed in another tab
        setToken(null);
        setUser(null);
        setCredentialsVerified(false);
        setVerifiedCredentials(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // First layer of authentication - verify credentials
  const verifyCredentials = async (username, password) => {
    try {
      // Call the validate-credentials endpoint for the first layer of authentication
      const response = await authAPI.post(
        "/auth-system/v0/auth/validate-credentials",
        {
          username,
          password,
        }
      );

      if (response.data && response.data.success) {
        // Store credentials temporarily for the second layer
        setVerifiedCredentials({ username, password });
        setCredentialsVerified(true);
        return { success: true };
      } else {
        setCredentialsVerified(false);
        return {
          success: false,
          message: response.data.message || "Invalid credentials",
        };
      }
    } catch (error) {
      console.error("Error verifying credentials:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error verifying credentials",
      };
    }
  };

  // Second layer of authentication - complete login with credentials and LinkedIn
  const completeLogin = async (provider) => {
    try {
      if (!credentialsVerified || !verifiedCredentials) {
        return {
          success: false,
          message: "Please verify your credentials first",
        };
      }

      // Handle LinkedIn OAuth flow
      if (provider === "linkedin") {
        // Get the current origin for constructing the redirect URI
        const origin = window.location.origin;

        // Store credentials in sessionStorage for retrieval after OAuth redirect
        sessionStorage.setItem(
          "verifiedCredentials",
          JSON.stringify(verifiedCredentials)
        );

        // Redirect to LinkedIn OAuth endpoint
        window.location.href = `${
          authAPI.defaults.baseURL
        }/auth-system/v0/auth/linkedin?storage=local&redirect=${encodeURIComponent(
          `${origin}/login`
        )}`;

        // Indicate we're redirecting
        return {
          redirecting: true,
        };
      }

      // Use the saved credentials from the first layer
      const { username, password } = verifiedCredentials;

      // Complete the authentication process using the login endpoint
      const response = await authAPI.post("/auth-system/v0/auth/login", {
        username,
        password,
      });

      if (response.data && response.data.success) {
        // Save token and user data
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);

        // Clear temporary credentials
        setVerifiedCredentials(null);

        return { success: true };
      } else {
        return {
          success: false,
          message: response.data?.message || "Authentication failed",
        };
      }
    } catch (error) {
      console.error("Error during login:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error during login",
      };
    }
  };

  // Check for OAuth callback results on component mount
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      // If we have a token in the URL, it means we've been redirected back from the OAuth provider
      if (token) {
        try {
          // Set token
          localStorage.setItem("token", token);
          setToken(token);

          // Get user data
          const response = await authAPI.get("/auth-system/v0/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data && response.data.success) {
            setUser(response.data.user);
          }

          // Remove token from URL to prevent it from being saved in browser history
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        } catch (error) {
          console.error("Error processing OAuth callback:", error);
          localStorage.removeItem("token");
          setToken(null);
        }
      }
    };

    handleOAuthCallback();
  }, []);

  // Logout function
  const logout = async () => {
    try {
      // Call the server logout endpoint if we have a token
      if (token) {
        await authAPI.get("/auth-system/v0/auth/logout", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Always clear local state regardless of server response
      localStorage.removeItem("token");
      sessionStorage.removeItem("verifiedCredentials");
      setToken(null);
      setUser(null);
      setCredentialsVerified(false);
      setVerifiedCredentials(null);

      // Force page to reload to ensure all auth state is cleared
      window.location.href = "/login";
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    if (!token) return false;

    try {
      // Verify token is not expired
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        // Token has expired
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking authentication status:", error);
      return false;
    }
  };

  const value = {
    user,
    token,
    loading,
    credentialsVerified,
    verifyCredentials,
    completeLogin,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
