import React, { useState, useEffect, useCallback } from 'react';
import './PropertyFormModal.css';
import { FaTimes, FaUpload, FaSpinner } from 'react-icons/fa';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';

const INITIAL_FORM_STATE = {
  name: '',
  location: '',
  status: 'unlisted',
  description: '',
  price: '',
  type: 'sale',
  propertyType: 'house',
  zoning: 'residential',
  intendedUse: '',
  layout: '',
  size: '',
  sizeUnit: 'sqm',
  region: '',
  city: '',
  village: '',
  verificationStatus: 'pending',
  virtualTour: '',
  bedrooms: '',
  bathrooms: '',
  area: '',
  amenities: [],
  mainImage: null,
  owner: '',
  ownerContact: '',
  documents: [],
  gpsCoordinates: {
    latitude: '',
    longitude: ''
  }
};

function PropertyFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [errors, setErrors] = useState({});

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

  const propertyTypes = [
    { value: 'house', label: 'House' },
    { value: 'land', label: 'Land' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'villa', label: 'Villa' },
    { value: 'commercial', label: 'Commercial' }
  ];

  const zoningTypes = [
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'industrial', label: 'Industrial' }
  ];

  const propertyStatus = [
    { value: 'sale', label: 'For Sale' },
    { value: 'rent', label: 'For Rent' },
    { value: 'pledge', label: 'Pledge' }
  ];

  const intendedUses = [
    { value: 'home', label: 'Home' },
    { value: 'school', label: 'School' },
    { value: 'bar', label: 'Bar' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'office', label: 'Office' }
  ];

  const regions = [
    'Northwest Region',
    'Southwest Region',
    'West Region',
    'Littoral Region',
    'Centre Region',
    'South Region',
    'East Region',
    'Adamawa Region',
    'North Region',
    'Far North Region'
  ];

  const northwestCities = [
    'Bamenda',
    'Ndop',
    'Wum',
    'Kumbo',
    'Fundong',
    'Nkambe',
    'Mbengwi'
  ];

  const northwestVillages = [
    'Mankon',
    'Nkwen',
    'Bafut',
    'Bali',
    'Babanki',
    'Bambili'
  ];

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setSelectedAmenities([]);
    setImagePreview(null);
    setImageFile(null);
    setLoading(false);
    setErrors({});
  }, []);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Property name is required';
    if (!formData.location?.trim()) newErrors.location = 'Location is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (formData.price && formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.owner?.trim()) newErrors.owner = 'Property owner is required';
    if (!formData.type) newErrors.type = 'Property type is required';
    if (!formData.propertyType) newErrors.propertyType = 'Property category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }));
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, WEBP, or GIF)');
      return;
    }

    // Check file size (5MB)
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
    
    const storage = getStorage();
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
      if (!validateForm()) {
        console.log('Form validation failed:', errors);
        toast.error('Please fill in all required fields correctly');
        return;
      }

      setLoading(true);

      let imageUrl = formData.mainImage;

      if (imageFile) {
        try {
          console.log('📤 Uploading image...');
          imageUrl = await uploadImage(imageFile);
          if (!imageUrl) {
            setLoading(false);
            toast.error('Failed to upload image. Please try again.');
            return;
          }
          console.log('✓ Image uploaded successfully');
        } catch (error) {
          console.error('❌ Image upload error:', error);
          setLoading(false);
          toast.error('Error uploading image. Please try again.');
          return;
        }
      }

      const propertyData = {
        ...formData,
        mainImage: imageUrl,
        amenities: selectedAmenities,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        area: Number(formData.area) || 0,
        name: formData.name.trim(),
        location: formData.location.trim(),
        description: formData.description.trim() || 'No description provided',
        owner: formData.owner.trim(),
        ownerContact: formData.ownerContact.trim() || 'No contact provided',
        status: formData.status || 'unlisted',
        type: formData.type || 'sale',
        propertyType: formData.propertyType || 'house',
        zoning: formData.zoning || 'residential',
        intendedUse: formData.intendedUse || 'home',
        layout: formData.layout || '',
        size: formData.size || '',
        sizeUnit: formData.sizeUnit || 'sqm',
        region: formData.region || '',
        city: formData.city || '',
        village: formData.village || '',
        verificationStatus: formData.verificationStatus || 'pending',
        virtualTour: formData.virtualTour || '',
        submittedAt: Date.now()
      };

      console.log('📝 Submitting property data...');
      await onSubmit(propertyData);
      console.log('✓ Property submitted successfully');
      
      resetForm();
      onClose();
    } catch (error) {
      console.error('❌ Error in form submission:', error);
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
          <h2>Add New Property</h2>
          <button 
            className="close-button" 
            onClick={onClose} 
            disabled={loading}
            type="button"
          >
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Property Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                disabled={loading}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="owner">Property Owner*</label>
              <input
                type="text"
                id="owner"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                className={errors.owner ? 'error' : ''}
                disabled={loading}
                placeholder="Enter owner's full name"
              />
              {errors.owner && <span className="error-message">{errors.owner}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="ownerContact">Owner Contact</label>
              <input
                type="text"
                id="ownerContact"
                name="ownerContact"
                value={formData.ownerContact}
                onChange={handleChange}
                disabled={loading}
                placeholder="Enter owner's contact information"
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
                className={errors.location ? 'error' : ''}
                disabled={loading}
              />
              {errors.location && <span className="error-message">{errors.location}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="price">Price (XAF)*</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                className={errors.price ? 'error' : ''}
                disabled={loading}
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
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
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
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
                {propertyStatus.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
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

            <div className="form-group">
              <label htmlFor="zoning">Zoning Type</label>
              <select
                id="zoning"
                name="zoning"
                value={formData.zoning}
                onChange={handleChange}
                disabled={loading}
              >
                {zoningTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="intendedUse">Intended Use</label>
              <select
                id="intendedUse"
                name="intendedUse"
                value={formData.intendedUse}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select Intended Use</option>
                {intendedUses.map(use => (
                  <option key={use.value} value={use.value}>{use.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="layout">Layout</label>
              <select
                id="layout"
                name="layout"
                value={formData.layout}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select Layout</option>
                <option value="RKT">Room-Kitchen-Toilet (RKT)</option>
                <option value="RPKT">Room-Parlor-Kitchen-Toilet (RPKT)</option>
                <option value="2-RPKT">2-RPKT</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="region">Region</label>
              <select
                id="region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select Region</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            {formData.region === 'Northwest Region' && (
              <>
                <div className="form-group">
                  <label htmlFor="city">City/Town</label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">Select City/Town</option>
                    {northwestCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="village">Village</label>
                  <select
                    id="village"
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">Select Village</option>
                    {northwestVillages.map(village => (
                      <option key={village} value={village}>{village}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="size">Size</label>
              <div className="size-input-group">
                <input
                  type="number"
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  min="0"
                  disabled={loading}
                  placeholder="Enter size"
                />
                <select
                  id="sizeUnit"
                  name="sizeUnit"
                  value={formData.sizeUnit}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="sqm">Square Meters</option>
                  <option value="hectares">Hectares</option>
                  <option value="acres">Acres</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="virtualTour">Virtual Tour URL</label>
              <input
                type="url"
                id="virtualTour"
                name="virtualTour"
                value={formData.virtualTour}
                onChange={handleChange}
                disabled={loading}
                placeholder="Enter virtual tour URL if available"
              />
            </div>

            <div className="form-group">
              <label htmlFor="gpsCoordinates">GPS Coordinates</label>
              <div className="coordinates-group">
                <input
                  type="text"
                  id="latitude"
                  name="gpsCoordinates.latitude"
                  value={formData.gpsCoordinates.latitude}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Latitude"
                />
                <input
                  type="text"
                  id="longitude"
                  name="gpsCoordinates.longitude"
                  value={formData.gpsCoordinates.longitude}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Longitude"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Property Documents</label>
              <input
                type="file"
                id="documents"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  setFormData(prev => ({
                    ...prev,
                    documents: [...prev.documents, ...files]
                  }));
                }}
                disabled={loading}
              />
              <small>Upload property documents (deeds, certificates, etc.)</small>
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
              {loading ? (
                <>
                  <FaSpinner className="spinner" />
                  Adding...
                </>
              ) : (
                'Add Property'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PropertyFormModal; 