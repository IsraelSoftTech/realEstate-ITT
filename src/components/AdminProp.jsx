import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminProp.css';
import { FaHome, FaUsers, FaBuilding, FaMoneyBillWave, FaLandmark, FaBars, FaTimes, FaEye, FaCheck, FaTimes as FaTimesCircle } from 'react-icons/fa';
import logo from '../assets/logo.jpg';
import LogoutButton from './LogoutButton';
import ProfileCircle from './ProfileCircle';
import PropertyFormModal from './PropertyFormModal';
import PropertyDetailsModal from './PropertyDetailsModal';
import { toast } from 'react-toastify';
import { db, auth } from '../firebase';
import { ref, onValue, remove, query, orderByChild, update, push, set } from 'firebase/database';

function AdminProp() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [viewingProperty, setViewingProperty] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'verified', label: 'Verified' },
    { id: 'unverified', label: 'Unverified' },
    { id: 'listed', label: 'Listed' },
    { id: 'unlisted', label: 'Unlisted' }
  ];

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      toast.error('You must be logged in to access this page');
      return;
    }

    const propertiesRef = ref(db, 'properties');
    
    const unsubscribe = onValue(propertiesRef, (snapshot) => {
      try {
        const propertyList = [];
        snapshot.forEach((childSnapshot) => {
          propertyList.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        
        // Sort by createdAt in descending order
        propertyList.sort((a, b) => b.createdAt - a.createdAt);
        
        setProperties(propertyList);
        setError(null);
      } catch (err) {
        setError(err.message);
        toast.error('Error loading properties: ' + err.message);
      } finally {
        setLoading(false);
      }
    }, (error) => {
      setError(error.message);
      toast.error('Error loading properties: ' + error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Add effect to handle body scroll when sidebar is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleAddProperty = () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error('You must be logged in to add a property');
      return;
    }

    setEditingProperty(null);
    setIsModalOpen(true);
  };

  const handleEditProperty = (property) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error('You must be logged in to edit properties');
      return;
    }

    setEditingProperty(property);
    setIsModalOpen(true);
  };

  const handleVerifyProperty = async (propertyId, isVerified) => {
    try {
      const propertyRef = ref(db, `properties/${propertyId}`);
      await update(propertyRef, {
        isVerified,
        verifiedAt: isVerified ? Date.now() : null,
        verifiedBy: isVerified ? auth.currentUser.email : null,
      });
      toast.success(`Property ${isVerified ? 'verified' : 'unverified'} successfully`);
    } catch (error) {
      toast.error('Error updating verification status');
      console.error('Error:', error);
    }
  };

  const handleSubmitProperty = async (propertyData) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error('You must be logged in to manage properties');
      return;
    }

    try {
      const enrichedPropertyData = {
        ...propertyData,
        adminId: user.uid,
        adminEmail: user.email,
        adminName: user.displayName || user.email,
        lastModifiedBy: user.email,
        lastModifiedAt: Date.now()
      };

      if (editingProperty?.id) {
        await update(ref(db, `properties/${editingProperty.id}`), enrichedPropertyData);
        toast.success('Property updated successfully!');
      } else {
        const newPropertyRef = push(ref(db, 'properties'));
        await set(newPropertyRef, enrichedPropertyData);
        toast.success('Property added successfully!');
      }

      setIsModalOpen(false);
      setEditingProperty(null);
    } catch (error) {
      toast.error('Error saving property. Please try again.');
      console.error('Error:', error);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;

    try {
      await remove(ref(db, `properties/${propertyId}`));
      toast.success('Property deleted successfully!');
    } catch (error) {
      toast.error('Error deleting property');
      console.error('Error:', error);
    }
  };

  const getFilteredProperties = () => {
    switch (activeTab) {
      case 'verified':
        return properties.filter(property => property.isVerified === true);
      case 'unverified':
        return properties.filter(property => property.isVerified !== true);
      case 'listed':
        return properties.filter(property => property.status === 'listed');
      case 'unlisted':
        return properties.filter(property => property.status === 'unlisted');
      default:
        return properties;
    }
  };

  const handleViewProperty = (property) => {
    setViewingProperty(property);
    setIsDetailsModalOpen(true);
  };

  const handleEditFromDetails = (property) => {
    setIsDetailsModalOpen(false);
    setEditingProperty(property);
    setIsModalOpen(true);
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
                  <th>Verification</th>
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
                    <td>{property.ownerName || property.owner}</td>
                    <td>
                      <span className={`status-badge ${property.status}`}>
                        {property.status}
                      </span>
                    </td>
                    <td>
                      <div className="verification-actions">
                        <button
                          className={`verify-button ${property.isVerified ? 'verified' : ''}`}
                          onClick={() => handleVerifyProperty(property.id, !property.isVerified)}
                          title={property.isVerified ? 'Remove Verification' : 'Verify Property'}
                        >
                          {property.isVerified ? (
                            <>
                              <FaCheck /> Verified
                            </>
                          ) : (
                            <>
                              <FaTimesCircle /> Unverified
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="icon-button view"
                          onClick={() => handleViewProperty(property)}
                          disabled={loading}
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="icon-button edit"
                          onClick={() => handleEditProperty(property)}
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button 
                          className="icon-button delete"
                          onClick={() => handleDeleteProperty(property.id)}
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
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                      No properties found in this category
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {properties.length === 0 && loading && (
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

      <PropertyDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setViewingProperty(null);
        }}
        property={viewingProperty}
        onEdit={handleEditFromDetails}
      />
    </div>
  );
}

export default AdminProp; 