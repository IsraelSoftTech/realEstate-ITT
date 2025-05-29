import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Users.css';
import { FaHome, FaUsers, FaBuilding, FaMoneyBillWave, FaLandmark, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo.jpg';
import LogoutButton from './LogoutButton';
import ProfileCircle from './ProfileCircle';
import { useAccounts } from '../hooks/useAccounts';
import UserFormModal from './UserFormModal';
import { toast } from 'react-toastify';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

function Users() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const {
    accounts,
    loading,
    error,
    addAccount,
    deleteAccount,
    updateAccount,
    getAccountsByType
  } = useAccounts();

  const tabs = [
    { id: 'users', label: 'All Users' },
    { id: 'owners', label: 'Owners' },
    { id: 'tenants', label: 'Tenants' },
    { id: 'technicians', label: 'Technicians' }
  ];

  const handleAddUser = async (userData) => {
    try {
      await addAccount(userData);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error adding user:', err);
    }
  };

  const handleEditUser = async (userData) => {
    try {
      await updateAccount(editingUser.id, userData);
      setIsModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteAccount(userId);
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(26, 75, 161);
    doc.text('ITT Real Estate - User List', 14, 30);
    
    // Add timestamp
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 38);

    const tableColumn = ["Name", "Username", "Email", "Account Type", "Status"];
    const tableRows = accounts.map(account => [
      account.name,
      account.username,
      account.email,
      account.accountType,
      account.status || 'Active'
    ]);

    autoTable(doc, {
      startY: 45,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [26, 75, 161],
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.save('itt-real-estate-users.pdf');
    toast.success('PDF exported successfully!');
  };

  const getFilteredAccounts = () => {
    switch (activeTab) {
      case 'owners':
        return accounts.filter(account => 
          account.accountType && 
          (account.accountType.toLowerCase() === 'owner' || 
           account.accountType.toLowerCase() === 'landlord')
        );
      case 'tenants':
        return accounts.filter(account => 
          account.accountType && account.accountType.toLowerCase() === 'tenant'
        );
      case 'technicians':
        return accounts.filter(account => 
          account.accountType && account.accountType.toLowerCase() === 'technician'
        );
      default:
        return accounts;
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Users</h2>
        <p>{error}</p>
        <p>Please check your database connection and try again.</p>
        <pre className="error-details">
          {JSON.stringify({ error, accounts }, null, 2)}
        </pre>
      </div>
    );
  }

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
            <Link to="/admin/users" className="nav-item active">
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
          <h1 className="dashboard-title">Users Management</h1>
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

        <section className="content-section">
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

          <div className="users-table-container">
            <div className="table-actions">
              <button 
                className="action-button primary-button"
                onClick={() => {
                  setEditingUser(null);
                  setIsModalOpen(true);
                }}
                disabled={loading}
              >
                Add New User
              </button>
              <button 
                className="action-button secondary-button"
                onClick={exportToPDF}
                disabled={loading || accounts.length === 0}
              >
                Export List
              </button>
            </div>

            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Account Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredAccounts().map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-info">
                        <span className="user-name">{user.name}</span>
                      </div>
                    </td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td style={{ textTransform: 'capitalize' }}>{user.accountType}</td>
                    <td>
                      <span className={`status-badge ${(user.status || 'active').toLowerCase()}`}>
                        {user.status || 'Active'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="icon-button edit"
                          onClick={() => {
                            setEditingUser(user);
                            setIsModalOpen(true);
                          }}
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button 
                          className="icon-button delete"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {getFilteredAccounts().length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                      No users found in this category
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {loading && (
              <div className="loading-overlay">
                <div className="loading-spinner" />
              </div>
            )}
          </div>
        </section>
      </main>

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={editingUser ? handleEditUser : handleAddUser}
        initialData={editingUser}
      />
    </div>
  );
}

export default Users; 