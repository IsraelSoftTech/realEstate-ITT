import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandProp.css';
import { FaHome, FaBuilding, FaQuestionCircle, FaMoneyBill, FaBars, FaTimes, FaSearch, FaPlus } from 'react-icons/fa';
import logo from '../assets/logo.jpg';
import LogoutButton from './LogoutButton';
import ProfileCircle from './ProfileCircle';
import PropertyFormModal from './PropertyFormModal';
import PropertyDetailsModal from './PropertyDetailsModal';
import { toast } from 'react-toastify';
import { getDatabase, ref, onValue, update, remove, push } from 'firebase/database';
import { getAuth } from 'firebase/auth';

function LandProp() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingProperty, setViewingProperty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'listed', label: 'Listed' },
    { id: 'unlisted', label: 'Unlisted' }
  ];

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    const db = getDatabase();
    const propertiesRef = ref(db, 'properties');
    
    const unsubscribe = onValue(propertiesRef, (snapshot) => {
      const propertyList = [];
      snapshot.forEach((childSnapshot) => {
        const property = childSnapshot.val();
        if (property.ownerEmail === user?.email) {
          propertyList.push({
            id: childSnapshot.key,
            ...property
          });
        }
      });
      
      propertyList.sort((a, b) => b.createdAt - a.createdAt);
      setProperties(propertyList);
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

  const getFilteredProperties = () => {
    let filtered = [...properties];
    
    if (activeTab !== 'all') {
      filtered = filtered.filter(prop => prop.status === activeTab);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(prop => 
        prop.name?.toLowerCase().includes(query) ||
        prop.location?.toLowerCase().includes(query) ||
        prop.type?.toLowerCase().includes(query) ||
        prop.propertyType?.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const handleAddProperty = () => {
    setEditingProperty(null);
    setIsModalOpen(true);
  };

  const handleEditProperty = (property) => {
    setEditingProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingProperty(null);
    setIsModalOpen(false);
  };

  const handleViewProperty = (property) => {
    setViewingProperty(property);
    setIsDetailsModalOpen(true);
  };

  const handleSubmitProperty = async (propertyData) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const db = getDatabase();
      const timestamp = Date.now();

      // Prepare the enriched property data
      const enrichedPropertyData = {
        ...propertyData,
        ownerEmail: user?.email || 'guest@example.com',
        ownerName: user?.displayName || propertyData.owner,
        lastModifiedBy: user?.email || 'guest',
        lastModifiedAt: timestamp,
        updatedAt: timestamp,
        isVerified: false,
        status: propertyData.status || 'unlisted',
        createdAt: editingProperty?.id ? editingProperty.createdAt : timestamp,
        propertyId: editingProperty?.id || `prop_${timestamp}`,
        addedBy: user?.email || 'guest'
      };

      // Handle property update or creation
      if (editingProperty?.id) {
        // Update existing property
        const propertyRef = ref(db, `properties/${editingProperty.id}`);
        await update(propertyRef, enrichedPropertyData);
        console.log('✓ Property updated:', editingProperty.id);
        toast.success('Property updated successfully!');
      } else {
        // Add new property
        const propertiesRef = ref(db, 'properties');
        const newPropertyRef = push(propertiesRef);
        
        // Add the property ID to the data
        enrichedPropertyData.propertyId = newPropertyRef.key;
        
        await update(ref(db, `properties/${newPropertyRef.key}`), enrichedPropertyData);
        console.log('✓ New property added:', newPropertyRef.key);
        toast.success('Property added successfully!');
      }

      // Close modal and reset state
      setIsModalOpen(false);
      setEditingProperty(null);
      
      // Refresh the properties list
      const propertiesRef = ref(db, 'properties');
      onValue(propertiesRef, (snapshot) => {
        const propertyList = [];
        snapshot.forEach((childSnapshot) => {
          const property = childSnapshot.val();
          propertyList.push({
            id: childSnapshot.key,
            ...property
          });
        });
        setProperties(propertyList);
      }, {
        onlyOnce: true
      });

    } catch (error) {
      console.error('❌ Error saving property:', error);
      toast.error('Error saving property. Please try again.');
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;

    try {
      const db = getDatabase();
      await remove(ref(db, `properties/${propertyId}`));
      toast.success('Property deleted successfully');
    } catch (error) {
      toast.error('Error deleting property');
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
          <div className="table-container">
            <table className="properties-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Price (XAF)</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredProperties().map((property) => (
                  <tr key={property.id}>
                    <td>
                      <div className="property-image-small">
                        {property.mainImage ? (
                          <img src={property.mainImage} alt={property.name} />
                        ) : (
                          <div className="no-image">No Image</div>
                        )}
                      </div>
                    </td>
                    <td>{property.name}</td>
                    <td>{property.location}</td>
                    <td>{Number(property.price).toLocaleString()}</td>
                    <td>{property.propertyType} - For {property.type}</td>
                    <td>
                      <span className={`status-badge-land ${property.status}`}>
                        {property.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditProperty(property)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteProperty(property.id)}
                        >
                          Delete
                        </button>
                        <button
                          className="view-btn"
                          onClick={() => handleViewProperty(property)}
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {getFilteredProperties().length === 0 && (
                  <tr>
                    <td colSpan="7" className="no-properties">
                      <p>No properties found</p>
                      <button 
                        className="add-property-btn"
                        onClick={handleAddProperty}
                      >
                        <FaPlus /> Add Your First Property
                      </button>
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
        onEdit={handleEditProperty}
      />
    </div>
  );
}

export default LandProp; 