import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./LoginPage.scss";
import { FaLinkedin, FaSpinner, FaSignInAlt } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    verifyCredentials,
    completeLogin,
    isAuthenticated,
    linkedinError,
    performRegularLogin,
  } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [linkedinAttempted, setLinkedinAttempted] = useState(false);

  // Check for error or success parameters in URL (from OAuth callbacks)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorMsg = urlParams.get("error");
    const successMsg = urlParams.get("success");
    const token = urlParams.get("token");

    if (errorMsg) {
      setError(decodeURIComponent(errorMsg));
      setLinkedinAttempted(true);
    } else if (successMsg) {
      // Clear any previous errors
      setError("");
    }

    // Clean up URL parameters
    if (errorMsg || successMsg || token) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // If already authenticated, redirect to home page or the page they tried to access
    if (isAuthenticated()) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [location, navigate, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Form validation
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      return;
    }

    setIsLoading(true);

    try {
      // First layer authentication - verify credentials locally
      const result = await verifyCredentials(username, password);

      if (result.success) {
        setIsVerified(true);
        // Don't navigate yet - user needs to complete second layer auth
      } else {
        setError(result.message || "Verification failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkedInClick = async () => {
    if (!isVerified) {
      setError("Please verify your credentials first");
      return;
    }

    setIsLoading(true);
    setLinkedinAttempted(true);

    try {
      // Second layer authentication - LinkedIn OAuth
      const result = await completeLogin("linkedin");

      // If we're redirecting to LinkedIn, the page will reload
      if (result.redirecting) {
        // Just keep the loading state on, we'll be redirected
        return;
      }

      if (result.success) {
        // Success - navigate to home page or previous page
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      } else {
        setError(result.message || "Authentication failed");
        // Don't reset verification since we want to allow direct login
      }
    } catch (error) {
      console.error("LinkedIn login error:", error);
      setError(
        "LinkedIn authentication failed. You can continue with regular login."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegularLogin = async () => {
    if (!isVerified) {
      setError("Please verify your credentials first");
      return;
    }

    setIsLoading(true);

    try {
      const result = await performRegularLogin();

      if (result.success) {
        // Success - navigate to home page or previous page
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      } else {
        setError(result.message || "Login failed");
        setIsVerified(false); // Reset verification on failure
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Authentication failed. Please try again.");
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome to SARC</h1>
        <p className="subtitle">
          Student Alumni Relations Cell, IIT(ISM) Dhanbad
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              disabled={isLoading || isVerified}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              disabled={isLoading || isVerified}
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          {linkedinError && !error && (
            <p className="error-message">
              LinkedIn authentication is currently unavailable. Please use
              regular login.
            </p>
          )}

          <button
            type="submit"
            className="submit-button"
            disabled={isLoading || isVerified}
          >
            {isLoading && !isVerified ? (
              <FaSpinner className="spinner" />
            ) : isVerified ? (
              "Credentials Verified"
            ) : (
              "Verify Credentials"
            )}
          </button>

          {isVerified && (
            <>
              <div className="divider">
                <span>Login Options</span>
              </div>

              <div className="login-options">
                {/* LinkedIn button - show unless there was a previous LinkedIn error */}
                {!linkedinError && (
                  <button
                    type="button"
                    onClick={handleLinkedInClick}
                    className="linkedin-button"
                    disabled={isLoading}
                  >
                    {isLoading && linkedinAttempted ? (
                      <FaSpinner className="spinner" />
                    ) : (
                      <>
                        <FaLinkedin style={{ scale: 1.5, marginRight: 5 }} />
                        Sign in with LinkedIn
                      </>
                    )}
                  </button>
                )}

                {/* Regular login button - always show when credentials are verified */}
                <button
                  type="button"
                  onClick={handleRegularLogin}
                  className="regular-login-button"
                  disabled={isLoading}
                >
                  {isLoading && !linkedinAttempted ? (
                    <FaSpinner className="spinner" />
                  ) : (
                    <>
                      <FaSignInAlt style={{ marginRight: 5 }} />
                      {linkedinError
                        ? "Continue with Login"
                        : "Skip LinkedIn & Sign In"}
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
