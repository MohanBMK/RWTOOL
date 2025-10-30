// App.js
import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate as useRouterNavigate,
  useLocation,
} from "react-router-dom";

import StartLandingPage from "./Pages/StartLandingPage/StartLandingPage";
import LandingPage from "./Pages/HomePage/LandingPage";
import LoginPage from "./Pages/HomePage/LoginPage";
import SignupPage from "./Pages/HomePage/SignupPage";
import OpsDashboard from "./Pages/OpsPage/OpsDashboard";
import Dashboard from "./Pages/AdminPage/AdminDashBoard/Dashboard";
import SubscriberDashboard from "./Pages/SubscriberPage/SubscriberDashboard/SubscriberDashboard";

import "./Pages/HomePage/Style.css";

/**
 * App component:
 * - DOES NOT create a BrowserRouter (assumes one exists at the app root, e.g. index.js)
 * - Preserves your `navigate(page, role)` API for existing pages
 */

const pageToPath = {
  "start-landing": "/",
  landing: "/home",
  login: "/login",
  signup: "/signup",
  "admin-dashboard": "/admin-dashboard",
  "ops-dashboard": "/ops-dashboard",
  "subscriber-dashboard": "/subscriber-dashboard",
};

const pathToPage = Object.fromEntries(
  Object.entries(pageToPath).map(([k, v]) => [v, k])
);

const AppInner = ({ currentPage, setCurrentPage, userRole, setUserRole }) => {
  const routerNavigate = useRouterNavigate();
  const location = useLocation();

  // sync URL -> app state on mount / when location changes
  useEffect(() => {
    const pageFromPath = pathToPage[location.pathname] || "landing";
    setCurrentPage(pageFromPath);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // navigate function passed to pages (keeps old contract)
  const navigate = (page, role = null) => {
    if (role !== null) setUserRole(role);
    setCurrentPage(page);

    const targetPath = pageToPath[page] || "/home";
    if (location.pathname !== targetPath) {
      routerNavigate(targetPath);
    }
  };

  return (
    <Routes>
      <Route path="/" element={<StartLandingPage navigate={navigate} />} />
      <Route path="/home" element={<LandingPage navigate={navigate} />} />
      <Route path="/login" element={<LoginPage role={userRole} navigate={navigate} />} />
      <Route path="/signup" element={<SignupPage role={userRole} navigate={navigate} />} />
      <Route path="/admin-dashboard" element={<Dashboard navigate={navigate} />} />
      <Route path="/ops-dashboard" element={<OpsDashboard navigate={navigate} />} />
      <Route path="/subscriber-dashboard" element={<SubscriberDashboard navigate={navigate} />} />
      <Route path="*" element={<LandingPage navigate={navigate} />} />
    </Routes>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState("start-landing");
  const [userRole, setUserRole] = useState(null);

  return (
    <div className="app">
      <AppInner
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        userRole={userRole}
        setUserRole={setUserRole}
      />
    </div>
  );
};

export default App;