import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminTransac.css';
import { FaHome, FaUsers, FaBuilding, FaMoneyBillWave, FaLandmark, FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import logo from '../assets/logo.jpg';
import LogoutButton from './LogoutButton';
import ProfileCircle from './ProfileCircle';

function AdminTransac() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'all', label: 'All Transactions' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
    { id: 'failed', label: 'Failed' }
  ];

  // Sample transaction data (replace with actual data from your backend)
  const transactions = [
    {
      id: 'TRX001',
      date: '2024-03-15',
      type: 'Property Purchase',
      amount: 'XAF250,000',
      status: 'completed',
      parties: 'Gaston Tibah → Precious Ngum'
    },
    {
      id: 'TRX002',
      date: '2024-03-14',
      type: 'Rent Payment',
      amount: 'XAF1,500',
      status: 'pending',
      parties: 'Fondanui Joseph → Tangum Wilson'
    },
    // Add more sample transactions as needed
  ];

  const getFilteredTransactions = () => {
    let filtered = [...transactions];
    
    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(t => t.status === activeTab);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.id.toLowerCase().includes(query) ||
        t.type.toLowerCase().includes(query) ||
        t.parties.toLowerCase().includes(query)
      );
    }

    return filtered;
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
            <Link to="/admin" className="nav-item">
              <FaHome /> Dashboard
            </Link>
            <Link to="/admin/users" className="nav-item">
              <FaUsers /> Users
            </Link>
            <Link to="/admin/properties" className="nav-item">
              <FaBuilding /> Properties
            </Link>
            <Link to="/admin/transactions" className="nav-item active">
              <FaMoneyBillWave /> Transactions
            </Link>
            <Link to="/admin/government" className="nav-item">
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
          <h1 className="dashboard-title">Transactions</h1>
          <div className="header-actions">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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

        <div className="tabs-container">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <section className="transactions-section">
          <div className="transactions-table">
            <table>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Parties</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredTransactions().map(transaction => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>{transaction.date}</td>
                    <td>{transaction.type}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.parties}</td>
                    <td>
                      <span className={`status-badge ${transaction.status}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td>
                      <button className="action-button view-button">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
                {getFilteredTransactions().length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminTransac; 