import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminDash.css';
import { FaHome, FaUsers, FaBuilding, FaMoneyBillWave, FaLandmark, FaBars, FaTimes } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import logo from '../assets/logo.jpg'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import LogoutButton from './LogoutButton';
import ProfileCircle from './ProfileCircle';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function AdminDash() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const healthChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'System Health',
        data: [98, 96, 99, 97, 98, 99],
        borderColor: '#1a4ba1',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 90,
        max: 100,
      },
    },
  };

  return (
    <div className="admin-dashboard">
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="logo-section">
          <img src={logo} alt="ITT Real Estate Logo"/>
          <span>ITT Real Estate</span>
        </div>
        
        <nav className="nav-menu">
          <div className="menu-items">
            <Link to="/admin" className="nav-item active">
              <FaHome /> Dashboard
            </Link>
            <Link to="/admin/users" className="nav-item">
              <FaUsers /> Users
            </Link>
            <Link to="/admin/properties" className="nav-item">
              <FaBuilding /> Properties
            </Link>
            <Link to="/admin/transactions" className="nav-item">
              <FaMoneyBillWave /> Transactions
            </Link>
            <Link to="/admin/government" className="nav-item last-item">
              <FaLandmark /> Government
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
          <h1 className="dashboard-title">Dashboard - ITT Real Estate</h1>
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
            <h2 className="card-title">User Statistics</h2>
            <div className="total-users">1,245</div>
            <div className="user-stats">
              <div className="user-stat-item">
                <span>Owners</span>
                <span>300</span>
              </div>
              <div className="user-stat-item">
                <span>Buyers</span>
                <span>500</span>
              </div>
              <div className="user-stat-item">
                <span>Renters</span>
                <span>400</span>
              </div>
              <div className="user-stat-item">
                <span>Technicians</span>
                <span>45</span>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <h2 className="card-title">Property Listings</h2>
            <div className="property-status">
              <div className="status-box">
                <div>Active</div>
                <div className="status-number">350</div>
              </div>
              <div className="status-box">
                <div>Pending</div>
                <div className="status-number">50</div>
              </div>
              <div className="status-box">
                <div>Rejected</div>
                <div className="status-number">200</div>
              </div>
              <div className="status-box">
                <div>Verified</div>
                <div className="status-number">200</div>
              </div>
              <div className="status-box">
                <div>Receced</div>
                <div className="status-number">200</div>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stats-card">
            <h2 className="card-title">Transaction Summary</h2>
            <div className="transaction-details">
              <div className="transaction-item">
                <span>Total Sales</span>
                <span>XAF1,000,000</span>
              </div>
              <div className="transaction-item">
                <span>Escrow Accounts</span>
                <span>120</span>
              </div>
              <div className="transaction-item">
                <span>Pending Payments</span>
                <span>XAF250,000</span>
              </div>
              <div className="transaction-item">
                <span>Revenue</span>
                <span>XAF800,000</span>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <h2 className="card-title">System Health</h2>
            <div className="system-health">
              <div className="health-graph">
                <Line data={healthChartData} options={{
                  ...chartOptions,
                  maintainAspectRatio: false,
                  responsive: true
                }} />
              </div>
              <div>API uptime</div>
              <div>Transaction logs</div>
            </div>
          </div>

          <div className="stats-card">
            <h2 className="card-title">User Management</h2>
            <div className="user-management">
              <button className="action-button primary-button">View Pending KYC</button>
              <button className="action-button secondary-button">Reset Credentials</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDash;