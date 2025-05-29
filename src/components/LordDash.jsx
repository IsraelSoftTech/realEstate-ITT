import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LordDash.css';
import { FaHome, FaBuilding, FaQuestionCircle, FaMoneyBill, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo.jpg';
import LogoutButton from './LogoutButton';
import ProfileCircle from './ProfileCircle';

function LordDash() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="lord-dashboard">
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

      <main className="main-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Property Owner Dashboard</h1>
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

        <section className="stats-grid">
          <div className="stats-card">
            <h2 className="card-title">Overview</h2>
            <div className="total-properties">5</div>
            <div className="overview-stats">
              <div className="overview-item">
                <span>Properties</span>
                <span>3</span>
              </div>
              <div className="overview-item">
                <span>For Sale</span>
                <span>3</span>
              </div>
              <div className="overview-item">
                <span>New Inquiries</span>
                <span>2</span>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <h2 className="card-title">Property Status</h2>
            <div className="property-status">
              <div className="status-box">
                <div>Listed</div>
                <div className="status-number">2</div>
              </div>
              <div className="status-box">
                <div>Pending</div>
                <div className="status-number">1</div>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stats-card">
            <h2 className="card-title">Inquiries</h2>
            <div className="total-inquiries">8</div>
            <div className="inquiries-stats">
              <div className="inquiries-item">
                <span>Properties</span>
                <span>8</span>
              </div>
              <div className="inquiries-item">
                <span>New Inquiries</span>
                <span>2</span>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <h2 className="card-title">Payments</h2>
            <div className="payment-details">
              <div className="payment-item">
                <span>Amount Due</span>
                <span>XAF5,000</span>
              </div>
              <div className="payment-item">
                <span>Amount Paid</span>
                <span>XAF12,000</span>
              </div>
            </div>
            <div className="action-buttons">
              <button className="action-button primary-button">Edit Profile</button>
              <button className="action-button secondary-button">Account Settings</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LordDash;