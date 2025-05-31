import React from 'react';
import { FaTimes, FaEdit } from 'react-icons/fa';
import './PropertyDetailsModal.css';

function PropertyDetailsModal({ isOpen, onClose, property, onEdit }) {
  if (!isOpen || !property) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content details-modal">
        <div className="modal-header">
          <h2>Property Details</h2>
          <div className="header-actions">
            <button className="edit-button" onClick={() => onEdit(property)}>
              <FaEdit /> Edit
            </button>
            <button className="close-button" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="property-details-content">
          {property.mainImage && (
            <div className="property-image">
              <img src={property.mainImage} alt={property.name} />
            </div>
          )}

          <div className="details-grid">
            <div className="detail-group">
              <h3>Basic Information</h3>
              <div className="detail-item">
                <label>Name:</label>
                <span>{property.name}</span>
              </div>
              <div className="detail-item">
                <label>Location:</label>
                <span>{property.location}</span>
              </div>
              <div className="detail-item">
                <label>Price:</label>
                <span>XAF {property.price?.toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <label>Status:</label>
                <span className={`status-badge ${property.status}`}>
                  {property.status}
                </span>
              </div>
            </div>

            <div className="detail-group">
              <h3>Property Details</h3>
              <div className="detail-item">
                <label>Type:</label>
                <span>{property.propertyType} - For {property.type}</span>
              </div>
              <div className="detail-item">
                <label>Area:</label>
                <span>{property.area} sqm</span>
              </div>
              <div className="detail-item">
                <label>Bedrooms:</label>
                <span>{property.bedrooms}</span>
              </div>
              <div className="detail-item">
                <label>Bathrooms:</label>
                <span>{property.bathrooms}</span>
              </div>
            </div>

            {property.amenities?.length > 0 && (
              <div className="detail-group">
                <h3>Amenities</h3>
                <div className="amenities-list">
                  {property.amenities.map((amenity) => (
                    <span key={amenity} className="amenity-tag">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="detail-group full-width">
              <h3>Description</h3>
              <p className="description">{property.description}</p>
            </div>

            <div className="detail-group">
              <h3>Additional Information</h3>
              <div className="detail-item">
                <label>Added by:</label>
                <span>{property.ownerName}</span>
              </div>
              <div className="detail-item">
                <label>Created:</label>
                <span>{new Date(property.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <label>Last Modified:</label>
                <span>{new Date(property.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <label>Modified by:</label>
                <span>{property.lastModifiedBy}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetailsModal; 