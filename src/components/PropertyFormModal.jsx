import React, { useState, useEffect } from 'react';
import './PropertyFormModal.css';
import { FaTimes, FaUpload } from 'react-icons/fa';
import { storage, db, auth } from '../firebase';
import { ref as dbRef, push, update, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';

function PropertyFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    status: 'unlisted',
    description: '',
    price: '',
    type: 'sale',
    propertyType: 'house',
    bedrooms: '',
    bathrooms: '',
    area: '',
    amenities: [],
    images: [],
    mainImage: null,
    createdAt: Date.now(),
    updatedAt: Date.now()
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const amenitiesList = [
    'Parking',
    'Swimming Pool',
    'Garden',
    'Security',
    'Gym',
    'Air Conditioning',
    'Furnished',
    'Internet',
    'Cable TV',
    'Balcony'
  ];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setSelectedAmenities(initialData.amenities || []);
      setImagePreview(initialData.mainImage);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const amenity = value;
      if (checked) {
        setSelectedAmenities(prev => [...prev, amenity]);
      } else {
        setSelectedAmenities(prev => prev.filter(item => item !== amenity));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      setFormData(prev => ({
        ...prev,
        mainImage: file
      }));
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    
    const sRef = storageRef(storage, `properties/${Date.now()}-${file.name}`);
    await uploadBytes(sRef, file);
    const url = await getDownloadURL(sRef);
    return url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('You must be logged in to manage properties');
        return;
      }

      let imageUrl = formData.mainImage;
      
      // If mainImage is a File object, upload it
      if (formData.mainImage instanceof File) {
        imageUrl = await uploadImage(formData.mainImage);
      }

      const propertyData = {
        ...formData,
        mainImage: imageUrl,
        amenities: selectedAmenities,
        price: Number(formData.price) || 0,
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        area: Number(formData.area) || 0,
        updatedAt: Date.now(),
        ownerId: user.uid,
        ownerEmail: user.email,
        ownerName: user.displayName || user.email
      };

      if (initialData?.id) {
        // Update existing property
        const updates = {};
        updates[`/properties/${initialData.id}`] = propertyData;
        await update(dbRef(db), updates);
        toast.success('Property updated successfully!');
      } else {
        // Add new property
        propertyData.createdAt = Date.now();
        const newPropertyRef = push(dbRef(db, 'properties'));
        await set(newPropertyRef, propertyData);
        toast.success('Property added successfully!');
      }

      onSubmit(propertyData);
      onClose();
      
      // Reset form data
      setFormData({
        name: '',
        location: '',
        status: 'unlisted',
        description: '',
        price: '',
        type: 'sale',
        propertyType: 'house',
        bedrooms: '',
        bathrooms: '',
        area: '',
        amenities: [],
        images: [],
        mainImage: null,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      setSelectedAmenities([]);
      setImagePreview(null);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error saving property: ' + error.message);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{initialData ? 'Edit Property' : 'Add New Property'}</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Property Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="propertyType">Property Type</label>
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                required
              >
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="type">Listing Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="price">Price (XAF)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="listed">Listed</option>
                <option value="unlisted">Unlisted</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="bedrooms">Bedrooms</label>
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bathrooms">Bathrooms</label>
              <input
                type="number"
                id="bathrooms"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="area">Area (sqm)</label>
              <input
                type="number"
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Amenities</label>
            <div className="amenities-grid">
              {amenitiesList.map(amenity => (
                <label key={amenity} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={amenity}
                    checked={selectedAmenities.includes(amenity)}
                    onChange={handleChange}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="mainImage">Main Image</label>
            <div className="image-upload-container">
              <input
                type="file"
                id="mainImage"
                accept="image/*"
                onChange={handleImageChange}
                className="image-input"
              />
              <label htmlFor="mainImage" className="image-upload-label">
                <FaUpload />
                <span>Choose Image</span>
              </label>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Saving...' : (initialData ? 'Update Property' : 'Add Property')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PropertyFormModal; 