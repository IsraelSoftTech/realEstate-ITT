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
import { getDatabase, ref, onValue, update, remove } from 'firebase/database';

function AdminProp() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingProperty, setViewingProperty] = useState(null);
  const [properties, setProperties] = useState([]);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'verified', label: 'Verified' },
    { id: 'unverified', label: 'Unverified' },
    { id: 'listed', label: 'Listed' },
    { id: 'unlisted', label: 'Unlisted' }
  ];

  useEffect(() => {
    const db = getDatabase();
    const propertiesRef = ref(db, 'properties');
    
    const unsubscribe = onValue(propertiesRef, (snapshot) => {
      try {
        const propertyList = [];
        snapshot.forEach((childSnapshot) => {
          const property = childSnapshot.val();
          propertyList.push({
            id: childSnapshot.key,
            ...property,
            // Ensure consistent data structure
            isVerified: property.isVerified || false,
            status: property.status || 'unlisted',
            createdAt: property.createdAt || Date.now(),
            lastModifiedAt: property.lastModifiedAt || property.createdAt || Date.now(),
            ownerName: property.ownerName || property.owner || 'Unknown Owner',
            ownerEmail: property.ownerEmail || 'No Email'
          });
        });
        
        // Sort by createdAt in descending order
        propertyList.sort((a, b) => b.createdAt - a.createdAt);
        console.log('Loaded properties:', propertyList.length);
        setProperties(propertyList);
      } catch (error) {
        console.error('Error processing properties:', error);
        toast.error('Error processing properties data');
      }
    }, (error) => {
      console.error('Error fetching properties:', error);
      toast.error('Error loading properties. Please try again.');
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
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleViewProperty = (property) => {
    setViewingProperty(property);
    setIsDetailsModalOpen(true);
  };

  const handleVerifyProperty = async (propertyId, isVerified) => {
    try {
      const db = getDatabase();
      const timestamp = Date.now();
      const propertyRef = ref(db, `properties/${propertyId}`);
      
      const updates = {
        isVerified: isVerified,
        verifiedAt: isVerified ? timestamp : null,
        lastModifiedAt: timestamp,
        lastModifiedBy: 'admin',
        status: isVerified ? 'listed' : 'unlisted' // Automatically update status based on verification
      };

      await update(propertyRef, updates);
      console.log('Property verification updated:', propertyId, isVerified);
      toast.success(`Property ${isVerified ? 'verified' : 'unverified'} successfully`);
    } catch (error) {
      console.error('Error updating verification status:', error);
      toast.error('Error updating verification status. Please try again.');
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;

    try {
      const db = getDatabase();
      await remove(ref(db, `properties/${propertyId}`));
      toast.success('Property deleted successfully');
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Error deleting property. Please try again.');
    }
  };

  const getFilteredProperties = () => {
    let filtered = [...properties];
    
    switch (activeTab) {
      case 'verified':
        filtered = filtered.filter(property => property.isVerified === true);
        break;
      case 'unverified':
        filtered = filtered.filter(property => property.isVerified !== true);
        break;
      case 'listed':
        filtered = filtered.filter(property => property.status === 'listed');
        break;
      case 'unlisted':
        filtered = filtered.filter(property => property.status === 'unlisted');
        break;
      default:
        // Return all properties
        break;
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
                      <span className={`status-badge-ad ${property.status}`}>
                        {property.status}
                      </span>
                    </td>
                    <td>
                      <div className="verification-actions">
                        <button
                          className={`verify-button ${property.isVerified ? 'verified' : ''}`}
                          onClick={() => handleVerifyProperty(property.id, !property.isVerified)}
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
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="icon-button delete"
                          onClick={() => handleDeleteProperty(property.id)}
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
          </div>
        </section>
      </main>

      <PropertyFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <PropertyDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setViewingProperty(null);
        }}
        property={viewingProperty}
      />
    </div>
  );
}

export default AdminProp;