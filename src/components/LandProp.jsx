import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandProp.css';
import { FaHome, FaBuilding, FaQuestionCircle, FaMoneyBill, FaBars, FaTimes, FaSearch, FaPlus } from 'react-icons/fa';
import logo from '../assets/logo.jpg';
import LogoutButton from './LogoutButton';
import ProfileCircle from './ProfileCircle';
import PropertyFormModal from './PropertyFormModal';
import { toast } from 'react-toastify';
import { getDatabase, ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { auth } from '../firebase';

function LandProp() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'listed', label: 'Listed' },
    { id: 'unlisted', label: 'Unlisted' }
  ];

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const db = getDatabase();
    const propertiesRef = ref(db, 'properties');

    // Set up real-time listener
    const unsubscribe = onValue(propertiesRef, (snapshot) => {
      const propertyList = [];
      snapshot.forEach((childSnapshot) => {
        const property = childSnapshot.val();
        if (property.ownerId === user.uid) {
          propertyList.push({
            id: childSnapshot.key,
            ...property
          });
        }
      });
      
      // Sort by createdAt in descending order
      propertyList.sort((a, b) => b.createdAt - a.createdAt);
      
      setProperties(propertyList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching properties:", error);
      toast.error('Error loading properties');
      setLoading(false);
    });

    return () => {
      // Cleanup listener
      unsubscribe();
    };
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

  const getFilteredProperties = () => {
    let filtered = [...properties];
    
    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(prop => prop.status === activeTab);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(prop => 
        prop.name.toLowerCase().includes(query) ||
        prop.location.toLowerCase().includes(query) ||
        prop.type.toLowerCase().includes(query) ||
        prop.propertyType.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

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
    setEditingProperty(property);
    setIsModalOpen(true);
  };

  const handleSubmitProperty = async (propertyData) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error('You must be logged in to manage properties');
      return;
    }

    // Add owner information to property data
    const enrichedPropertyData = {
      ...propertyData,
      ownerId: user.uid,
      ownerEmail: user.email,
      ownerName: user.displayName || user.email
    };

    setIsModalOpen(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="landlord-dashboard">
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
            <Link to="/landlord/properties" className="nav-item active">
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

      <main className={`main-content ${isMobileMenuOpen ? 'sidebar-open' : ''}`}>
        <div className="dashboard-header">
          <h1 className="dashboard-title">My Properties</h1>
          <div className="header-actions">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              className="add-property-btn"
              onClick={handleAddProperty}
            >
              <FaPlus /> Add Property
            </button>
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

        <section className="properties-section">
          <div className="properties-grid">
            {loading ? (
              <div className="loading-message">Loading properties...</div>
            ) : getFilteredProperties().length > 0 ? (
              getFilteredProperties().map(property => (
                <div key={property.id} className="property-card">
                  <div className="property-image">
                    {property.mainImage ? (
                      <img src={property.mainImage} alt={property.name} />
                    ) : (
                      <div className="placeholder-image" />
                    )}
                    <span className={`status-badge ${property.status}`}>
                      {property.status}
                    </span>
                  </div>
                  <div className="property-details">
                    <h3>{property.name}</h3>
                    <p className="location">{property.location}</p>
                    <p className="type">{property.propertyType} - For {property.type}</p>
                    <p className="price">XAF {property.price.toLocaleString()}</p>
                    {property.bedrooms && (
                      <p className="specs">
                        {property.bedrooms} beds • {property.bathrooms} baths • {property.area}sqm
                      </p>
                    )}
                    <div className="property-actions">
                      <button 
                        className="action-button edit-button"
                        onClick={() => handleEditProperty(property)}
                      >
                        Edit
                      </button>
                      <button 
                        className="action-button view-button"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-properties">
                <p>No properties found</p>
                <button 
                  className="add-property-btn"
                  onClick={handleAddProperty}
                >
                  <FaPlus /> Add Your First Property
                </button>
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

export default LandProp; 