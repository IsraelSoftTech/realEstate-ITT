import React, { useState } from 'react';
import './TenantDash.css';
import { FaHome, FaFileContract, FaMoneyBillWave, FaTools, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo.jpg';
import LogoutButton from './LogoutButton';
import ProfileCircle from './ProfileCircle';

function TenantDash() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="tenant-dashboard">
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
              <FaFileContract /> Leases
            </div>
            <div className="nav-item">
              <FaMoneyBillWave /> Payments
            </div>
            <div className="nav-item">
              <FaTools /> Maintenance
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
          <h1 className="dashboard-title">Tenant Dashboard</h1>
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
            <div className="total-leases">2</div>
            <div className="overview-stats">
              <div className="overview-item">
                <span>Active Leases</span>
                <span>2</span>
              </div>
              <div className="overview-item">
                <span>Upcoming Payment</span>
                <span>1</span>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <h2 className="card-title">Lease Details</h2>
            <div className="lease-status">
              <div className="status-box">
                <div>Lease Ends Soon</div>
                <div className="status-number">1</div>
              </div>
              <div className="status-box">
                <div>Past Due Payment</div>
                <div className="status-number">1</div>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stats-card">
            <h2 className="card-title">Payments</h2>
            <div className="payment-details">
              <div className="payment-item">
                <span>Next Payment</span>
                <span>XAF 1,200</span>
              </div>
              <div className="payment-item">
                <span>Paid This Year</span>
                <span>XAF 3,600</span>
              </div>
            </div>
          </div>

          <div className="stats-card action-card">
            <div className="action-buttons">
              <button className="action-button primary-button">Pay Rent</button>
              <button className="action-button secondary-button">Submit Request</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default TenantDash;