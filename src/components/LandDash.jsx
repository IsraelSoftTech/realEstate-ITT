import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LandDash.css';
import { FaHome, FaBuilding, FaQuestionCircle, FaMoneyBill, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo.jpg';
import LogoutButton from './LogoutButton';
import ProfileCircle from './ProfileCircle';

function LandDash() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="landlord-dashboard">
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-overlay active" 
          onClick={handleOverlayClick}
        />
      )}
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="logo-section">
          <img src={logo} alt="ITT Real Estate Logo"/>
          <span>ITT Real Estate</span>
        </div>
        
        <nav className="nav-menu">
          <div className="menu-items">
            <Link to="/landlord" className="nav-item active">
              <FaHome /> Dashboard
            </Link>
            <Link to="/landlord/properties" className="nav-item">
              <FaBuilding /> Properties
            </Link>
            <Link to="/landlord/inquiries" className="nav-item">
              <FaQuestionCircle /> Inquiries
            </Link>
            <Link to="/landlord/payments" className="nav-item">
              <FaMoneyBill /> Payments
            </Link>
          </div>
          <div className="mobile-menu-footer">
            <ProfileCircle />
            <LogoutButton />
          </div>
        </nav>
      </aside>

      <main className={`main-content ${isMobileMenuOpen ? 'sidebar-open' : ''}`}>
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <div className="header-actions">
            <div className="desktop-profile">
              <ProfileCircle />
            </div>
            <div className="desktop-logout">
              <LogoutButton />
            </div>
            <button 
              className="menu-toggle" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Add your dashboard content here */}
      </main>
    </div>
  );
}

export default LandDash; 