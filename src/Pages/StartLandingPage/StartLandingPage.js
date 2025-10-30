import React from "react";
import { useNavigate as useRouterNavigate } from "react-router-dom";
import "./StartLandingPage.css";

const StartLandingPage = ({ navigate }) => {
  // fallback router navigate if no navigate prop is provided
  const routerNavigate = useRouterNavigate();

  const handleLoginClick = () => {
    if (typeof navigate === "function") {
      // old state-based API: 'landing' -> your role-selection LandingPage (App maps 'landing' -> '/home')
      navigate("landing");
    } else {
      // fallback direct URL (React Router): go to /home which renders LandingPage
      routerNavigate("/home");
    }
  };

  return (
    <div className="landing-root">
      {/* Background Layer */}
      <div className="hero-bg">
        <img src="/heroimage2.png" alt="Hero background" className="hero-img" />
        <div className="hero-overlay" />
      </div>

      {/* Foreground Layer */}
      <div className="foreground d-flex flex-column min-vh-100">
        <header className="px-3 pt-0">
          <nav className="top-nav container-fluid bg-light rounded-btm">
            <div className="container py-3 d-flex align-items-center">
              <div className="d-flex align-items-center">
                <img src="/sc_logo2.png" alt="Standard Chartered" className="sc-logo" />
                <div className="divider mx-3" />
                <span className="brand-text">RW TOOL</span>
              </div>

              {/* Right side nav links */}
              <div className="nav-right ms-auto d-flex align-items-center gap-3">
                <a
                  className="nav-link about-link"
                  href="https://www.sc.com/en/about/who-we-are/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  About us
                </a>
                <a
                  className="nav-link contact-link"
                  href="https://www.sc.com/en/contact-us/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact us
                </a>
              </div>
            </div>
          </nav>
        </header>

        <main className="main-area d-flex align-items-center flex-grow-1">
          <div className="content">
            <div className="decor-left">
              <div className="decor-inner">
                <h1 className="hero-title">Centralized Reporting for Wealth Core</h1>
              </div>
            </div>

            <p className="hero-sub">All Your Financial Reports Under One Roof</p>

            <div className="mt-4">
              <button
                onClick={handleLoginClick}
                className="btn login-btn d-inline-flex align-items-center gap-2"
                type="button"
              >
                Login
                <svg
                  className="login-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StartLandingPage;