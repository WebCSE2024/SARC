import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Navigation/header";
import Footer from "./components/Navigation/footer";
import { appRoutes } from "./Routes/routes";
import "./App.css";

const App = () => {
  return (
    <div className="app">
      <BrowserRouter
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true,
        }}
      >
        <Header />
        <main className="main-content">
          <Routes>
            {appRoutes.map((route, index) => (
              <Route
                key={index || route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
