import { createContext, useState, useContext, useEffect } from "react";
import { authAPI } from "../../../../shared/axios/axiosInstance";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";

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
  const [linkedinError, setLinkedinError] = useState(false);
  const [linkedinProfile, setLinkedinProfile] = useState(null);

  // Check if user is already logged in (token in localStorage)
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          // Verify token is not expired
          try {
            const decoded = jwtDecode(storedToken);
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
        } else {
          // Check if we have saved credentials in session
          const savedCredentials = sessionStorage.getItem(
            "verifiedCredentials"
          );
          if (savedCredentials) {
            try {
              setVerifiedCredentials(JSON.parse(savedCredentials));
              setCredentialsVerified(true);
            } catch (e) {
              console.error("Error parsing saved credentials:", e);
              sessionStorage.removeItem("verifiedCredentials");
            }
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
        const credentials = { username, password };
        setVerifiedCredentials(credentials);
        setCredentialsVerified(true);

        // Store credentials in session for later use
        sessionStorage.setItem(
          "verifiedCredentials",
          JSON.stringify(credentials)
        );

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
        try {
          // Get the current origin for constructing the redirect URI
          const origin = window.location.origin;

          // Redirect to LinkedIn OAuth endpoint
          const baseUrl = authAPI.defaults.baseURL.endsWith("/")
            ? authAPI.defaults.baseURL
            : authAPI.defaults.baseURL + "/";

          window.location.href = `${baseUrl}auth-system/v0/auth/linkedin?storage=local&redirect=${encodeURIComponent(
            `${origin}/login`
          )}`;

          return {
            redirecting: true,
          };
        } catch (linkedinError) {
          console.error("LinkedIn service error:", linkedinError);
          setLinkedinError(true);

          // Fall back to regular login with saved credentials
          return await performRegularLogin();
        }
      }

      return await performRegularLogin();
    } catch (error) {
      console.error("Error during login:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error during login",
      };
    }
  };

  // Helper function for regular login (without LinkedIn)
  const performRegularLogin = async () => {
    // Use the saved credentials
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

      // Clear temporary credentials from session storage
      // but keep them in state for potential LinkedIn retry
      sessionStorage.removeItem("verifiedCredentials");

      return { success: true };
    } else {
      return {
        success: false,
        message: response.data?.message || "Authentication failed",
      };
    }
  };

  // Function to get LinkedIn profile data
  const getLinkedInProfile = async () => {
    if (!token) return null;

    try {
      const response = await authAPI.get(
        "/auth-system/v0/auth/linkedin/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        setLinkedinProfile(response.data.profile);
        return response.data.profile;
      }
      return null;
    } catch (error) {
      console.error("Error fetching LinkedIn profile:", error);
      return null;
    }
  };

  // Check for OAuth callback results on component mount
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const error = urlParams.get("error");

      if (error) {
        // LinkedIn auth failed, set the error state
        setLinkedinError(true);
        // Fall back to regular login with saved credentials
        if (credentialsVerified && verifiedCredentials) {
          await performRegularLogin();
        }
      } else if (token) {
        // If we have a token in the URL, it means we've been redirected back from the OAuth provider
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

            // Try to get LinkedIn profile data
            await getLinkedInProfile();
          }

          // Remove credentials from session storage since login is complete
          sessionStorage.removeItem("verifiedCredentials");

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
          setLinkedinError(true);

          // Fall back to regular login
          if (credentialsVerified && verifiedCredentials) {
            await performRegularLogin();
          }
        }
      }
    };

    handleOAuthCallback();
  }, [credentialsVerified, verifiedCredentials]);

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
      setLinkedinError(false);
      setLinkedinProfile(null);

      // Force page to reload to ensure all auth state is cleared
      window.location.href = "/login";
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    if (!token) return false;

    try {
      // Verify token is not expired
      const decoded = jwtDecode(token);
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
    verifiedCredentials,
    linkedinError,
    linkedinProfile,
    verifyCredentials,
    completeLogin,
    getLinkedInProfile,
    performRegularLogin,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
