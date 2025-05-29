import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminProp.css';
import { FaHome, FaUsers, FaBuilding, FaMoneyBillWave, FaLandmark, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo.jpg';
import LogoutButton from './LogoutButton';
import ProfileCircle from './ProfileCircle';
import PropertyFormModal from './PropertyFormModal';
import { toast } from 'react-toastify';

function AdminProp() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'listed', label: 'Listed' },
    { id: 'unlisted', label: 'Unlisted' }
  ];

  const properties = []; // This will be replaced with actual data from your hook

  const handleAddProperty = () => {
    setEditingProperty(null);
    setIsModalOpen(true);
  };

  const handleEditProperty = (property) => {
    setEditingProperty(property);
    setIsModalOpen(true);
  };

  const handleSubmitProperty = async (propertyData) => {
    try {
      setLoading(true);
      // Add your property submission logic here
      // Example:
      // if (editingProperty) {
      //   await updateProperty(editingProperty.id, propertyData);
      // } else {
      //   await addProperty(propertyData);
      // }
      setIsModalOpen(false);
      setEditingProperty(null);
      toast.success(editingProperty ? 'Property updated successfully!' : 'Property added successfully!');
    } catch (err) {
      setError(err.message);
      toast.error('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    try {
      setLoading(true);
      // Add your delete logic here
      // Example: await deleteProperty(propertyId);
      toast.success('Property deleted successfully!');
    } catch (err) {
      setError(err.message);
      toast.error('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredProperties = () => {
    switch (activeTab) {
      case 'listed':
        return properties.filter(property => property.status === 'listed');
      case 'unlisted':
        return properties.filter(property => property.status === 'unlisted');
      default:
        return properties;
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Properties</h2>
        <p>{error}</p>
        <p>Please check your database connection and try again.</p>
        <pre className="error-details">
          {JSON.stringify({ error, properties }, null, 2)}
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
            <Link to="/admin/users" className="nav-item">
              <FaUsers /> Users
            </Link>
            <Link to="/admin/properties" className="nav-item active">
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
          <h1 className="dashboard-title">Properties</h1>
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

          <div className="properties-table-container">
            <div className="table-actions">
              <button 
                className="action-button primary-button"
                onClick={handleAddProperty}
                disabled={loading}
              >
                Add New Property
              </button>
            </div>

            <table className="properties-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredProperties().map((property) => (
                  <tr key={property.id}>
                    <td>
                      <div className="property-info">
                        <span className="property-name">{property.name}</span>
                      </div>
                    </td>
                    <td>{property.location}</td>
                    <td>{property.owner}</td>
                    <td>
                      <span className={`status-badge ${property.status}`}>
                        {property.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="icon-button edit"
                          onClick={() => handleEditProperty(property)}
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button 
                          className="icon-button delete"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this property?')) {
                              handleDeleteProperty(property.id);
                            }
                          }}
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {getFilteredProperties().length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                      No properties found in this category
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

      <PropertyFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProperty(null);
        }}
        onSubmit={handleSubmitProperty}
        initialData={editingProperty}
      />
    </div>
  );
}

export default AdminProp; 