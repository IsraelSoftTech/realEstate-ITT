import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandInquire.css';
import { FaHome, FaBuilding, FaQuestionCircle, FaMoneyBill, FaBars, FaTimes, FaSearch, FaEye, FaTrash } from 'react-icons/fa';
import logo from '../assets/logo.jpg';
import LogoutButton from './LogoutButton';
import ProfileCircle from './ProfileCircle';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';

function LandInquire() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    const db = getDatabase();
    const inquiriesRef = ref(db, 'inquiries');
    
    const unsubscribe = onValue(inquiriesRef, (snapshot) => {
      const inquiryList = [];
      snapshot.forEach((childSnapshot) => {
        const inquiry = childSnapshot.val();
        if (inquiry.propertyOwnerEmail === user?.email) {
          inquiryList.push({
            id: childSnapshot.key,
            ...inquiry
          });
        }
      });
      
      inquiryList.sort((a, b) => b.createdAt - a.createdAt);
      setInquiries(inquiryList);
      setLoading(false);
    }, (error) => {
      setError(error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getFilteredInquiries = () => {
    if (!searchQuery) return inquiries;

    const query = searchQuery.toLowerCase();
    return inquiries.filter(inquiry => 
      inquiry.propertyName?.toLowerCase().includes(query) ||
      inquiry.userName?.toLowerCase().includes(query) ||
      inquiry.status?.toLowerCase().includes(query)
    );
  };

  const handleDeleteInquiry = async (inquiryId) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;

    try {
      const db = getDatabase();
      await remove(ref(db, `inquiries/${inquiryId}`));
      toast.success('Inquiry deleted successfully');
    } catch (error) {
      toast.error('Error deleting inquiry');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsMobileMenuOpen(false);
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="landlord-inquiries">
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
            <Link to="/landlord" className="nav-item">
              <FaHome /> Dashboard
            </Link>
            <Link to="/landlord/properties" className="nav-item">
              <FaBuilding /> Properties
            </Link>
            <Link to="/landlord/inquiries" className="nav-item active">
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
          <h1 className="dashboard-title">Property Inquiries</h1>
          <div className="header-actions">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search inquiries..."
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

        <section className="inquiries-section">
          <div className="table-container">
            <table className="inquiries-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>User</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredInquiries().map((inquiry) => (
                  <tr key={inquiry.id}>
                    <td>{inquiry.propertyName}</td>
                    <td>{inquiry.userName}</td>
                    <td>{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${inquiry.status}`}>
                        {inquiry.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="view-btn"
                          onClick={() => {/* Handle view */}}
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteInquiry(inquiry.id)}
                          title="Delete Inquiry"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {getFilteredInquiries().length === 0 && (
                  <tr>
                    <td colSpan="5" className="no-inquiries">
                      <p>No inquiries found</p>
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

export default LandInquire; 