import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserTag } from 'react-icons/fa';
import './UserFormModal.css';

function UserFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    accountType: 'tenant'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        password: '' // Don't show existing password
      });
    } else {
      // Reset form when opening for new user
      setFormData({
        name: '',
        email: '',
        password: '',
        accountType: 'tenant'
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!initialData && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (!initialData && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      // If the error is related to a specific field, show it there
      if (error.message.toLowerCase().includes('email')) {
        setErrors(prev => ({ ...prev, email: error.message }));
      } else if (error.message.toLowerCase().includes('password')) {
        setErrors(prev => ({ ...prev, password: error.message }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose()}>
      <div className="modal-content">
        <h2>{initialData ? 'Edit User' : 'Add New User'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="icon">
              <FaUser />
            </div>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) {
                  setErrors({ ...errors, name: '' });
                }
              }}
              className={errors.name ? 'error' : ''}
              disabled={isSubmitting}
              autoFocus
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <div className="icon">
              <FaEnvelope />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) {
                  setErrors({ ...errors, email: '' });
                }
              }}
              className={errors.email ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <div className="icon">
              <FaLock />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder={initialData ? "New Password (optional)" : "Password"}
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password) {
                  setErrors({ ...errors, password: '' });
                }
              }}
              className={errors.password ? 'error' : ''}
              required={!initialData}
              disabled={isSubmitting}
            />
            <div 
              className="password-toggle" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <div className="icon">
              <FaUserTag />
            </div>
            <select
              value={formData.accountType}
              onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
              disabled={isSubmitting}
            >
              <option value="">Select Account Type</option>
              <option value="tenant">Tenant</option>
              <option value="landlord">Land Lord</option>
              <option value="technician">Technician</option>
            </select>
          </div>

          <div className="modal-actions">
            <button 
              type="submit" 
              className="primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? 'Processing...' 
                : (initialData ? 'Update User' : 'Add User')
              }
            </button>
            <button 
              type="button" 
              className="secondary-button" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserFormModal; 