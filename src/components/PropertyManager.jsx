import React, { useState } from 'react';
import { toast } from 'react-toastify';
import PropertyFormModal from './PropertyFormModal';
import { saveProperty } from '../utils/propertyService';

function PropertyManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePropertySubmit = async (propertyData) => {
    try {
      const savedProperty = await saveProperty(propertyData);
      toast.success('Property saved successfully!');
      return savedProperty;
    } catch (error) {
      console.error('Error in property submission:', error);
      throw new Error(error.message || 'Failed to save property');
    }
  };

  return (
    <div>
      <PropertyFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePropertySubmit}
      />
      
      <button 
        onClick={() => setIsModalOpen(true)}
        className="add-property-button"
      >
        Add New Property
      </button>
    </div>
  );
}

export default PropertyManager; 