import React, { useState } from 'react';
import './TechDash.css';
import { FaHome, FaClipboardList, FaCalendarAlt, FaEnvelope, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo.jpg';
import LogoutButton from './LogoutButton';
import ProfileCircle from './ProfileCircle';

function TechDash() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="tech-dashboard">
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="logo-section">
          <img src={logo} alt="ITT Real Estate Logo"/>
          <span>ITT Real Estate</span>
        </div>
        
        <nav className="nav-menu">
          <div className="menu-items">
            <div className="nav-item active">
              <FaHome /> Dashboard
            </div>
            <div className="nav-item">
              <FaClipboardList /> Work Orders
            </div>
            <div className="nav-item">
              <FaCalendarAlt /> Schedule
            </div>
            <div className="nav-item">
              <FaEnvelope /> Messages
            </div>
          </div>
          <div className="mobile-menu-footer">
            <ProfileCircle />
            <LogoutButton />
          </div>
        </nav>
      </aside>

      <main className="main-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Technician Dashboard</h1>
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
            <div className="total-orders">8</div>
            <div className="overview-stats">
              <div className="overview-item">
                <span>Total Work Orders</span>
                <span>8</span>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <h2 className="card-title">Work Orders</h2>
            <div className="work-status">
              <div className="status-box">
                <div>In Progress</div>
                <div className="status-number">2</div>
              </div>
              <div className="status-box">
                <div>Completed</div>
                <div className="status-number">1</div>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stats-card">
            <h2 className="card-title">Schedule</h2>
            <div className="schedule-details">
              <div className="schedule-item">
                <span>Today's Jobs</span>
                <span>4</span>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <h2 className="card-title">Messages</h2>
            <div className="message-details">
              <div className="message-item">
                <span>New Messages</span>
                <span>3</span>
              </div>
            </div>
            <div className="action-buttons">
              <button className="action-button primary-button">View Notifications</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default TechDash;