import React, { useState, useEffect } from 'react';
import './PropertyFormModal.css';
import { FaTimes, FaUpload } from 'react-icons/fa';
import { storage, auth } from '../firebase';
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
    mainImage: null
  });

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
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
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  const resetForm = () => {
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
      mainImage: null
    });
    setSelectedAmenities([]);
    setImagePreview(null);
    setImageFile(null);
    setLoading(false);
  };

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    
    const fileName = `properties/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
    const sRef = storageRef(storage, fileName);
    
    try {
      const snapshot = await uploadBytes(sRef, file);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) {
        toast.error('You must be logged in to manage properties');
        return;
      }

      if (!formData.name || !formData.location || !formData.price) {
        toast.error('Please fill in all required fields');
        return;
      }

      let imageUrl = formData.mainImage;

      if (imageFile) {
        try {
          imageUrl = await uploadImage(imageFile);
        } catch (error) {
          toast.error('Error uploading image. Please try again.');
          return;
        }
      }

      const propertyData = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        status: formData.status,
        description: formData.description.trim(),
        price: Number(formData.price),
        type: formData.type,
        propertyType: formData.propertyType,
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        area: Number(formData.area) || 0,
        amenities: selectedAmenities,
        mainImage: imageUrl,
        createdAt: initialData?.createdAt || Date.now(),
        updatedAt: Date.now()
      };

      await onSubmit(propertyData);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('Error saving property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && !loading && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{initialData ? 'Edit Property' : 'Add New Property'}</h2>
          <button className="close-button" onClick={onClose} disabled={loading}>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Property Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location*</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price (XAF)*</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="propertyType">Property Type</label>
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                disabled={loading}
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
                disabled={loading}
              >
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="unlisted">Unlisted</option>
                <option value="listed">Listed</option>
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
              disabled={loading}
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
                    disabled={loading}
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
                disabled={loading}
              />
              <label htmlFor="mainImage" className="image-upload-label">
                <FaUpload />
                <span>{loading ? 'Uploading...' : 'Choose Image'}</span>
              </label>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={onClose} 
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button" 
              disabled={loading}
            >
              {loading ? 'Saving...' : (initialData ? 'Update Property' : 'Add Property')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PropertyFormModal; 