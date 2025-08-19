import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Navigation/header";
import Footer from "./components/Navigation/footer";
import { appRoutes, protectedRoutes } from "./Routes/routes";
import "./App.css";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import LoginPage from "./pages/LoginPage/LoginPage";

// Root-level component that determines authentication state
const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  // If still loading auth state, show a simple spinner
  if (loading) {
    return (
      <div className="full-page-loader">
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main id="main" className="main-content" role="main" aria-live="polite">
        <Routes>
          {/* Login route - always accessible */}
          <Route path="/login" element={<LoginPage />} />

          {/* All routes are protected */}
          <Route element={<ProtectedRoute />}>
            {/* Previously "public" routes */}
            {appRoutes.map((route, index) => (
              <Route
                key={index || route.path}
                path={route.path}
                element={route.element}
              />
            ))}

            {/* Explicitly protected routes */}
            {protectedRoutes.map((route, index) => (
              <Route
                key={`protected-${index}`}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>

          {/* Catch-all route redirects to login if not authenticated, or home if authenticated */}
          <Route
            path="*"
            element={
              isAuthenticated() ? (
                <Navigate to="/" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

const App = () => {
  // Force token check on initial load
  useEffect(() => {
    // This prevents caching of protected routes
    window.addEventListener("popstate", () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // If no token exists and user tries to navigate back to a protected route
        // we'll handle this in the ProtectedRoute component
      }
    });

    return () => window.removeEventListener("popstate", () => {});
  }, []);

  return (
    <div className="app">
      <BrowserRouter
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true,
        }}
      >
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
