import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Navigation/header";
import Footer from "./components/Navigation/footer";
import { appRoutes, protectedRoutes } from "./Routes/routes";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import LoginPage from "./pages/LoginPage/LoginPage";

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
          <Header />
          <main className="main-content">
            <Routes>
              {/* Public routes */}
              {appRoutes.map((route, index) => (
                <Route
                  key={index || route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}

              {/* Login route */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected routes - wrapped with ProtectedRoute component */}
              <Route element={<ProtectedRoute />}>
                {protectedRoutes.map((route, index) => (
                  <Route
                    key={`protected-${index}`}
                    path={route.path}
                    element={route.element}
                  />
                ))}
              </Route>
            </Routes>
          </main>
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
