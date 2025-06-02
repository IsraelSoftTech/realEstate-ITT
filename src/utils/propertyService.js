import { getDatabase, ref, push, set, get, child } from 'firebase/database';

export const saveProperty = async (propertyData) => {
  try {
    const db = getDatabase();
    const propertiesRef = ref(db, 'properties');
    
    // Add timestamps
    const timestamp = Date.now();
    const enrichedData = {
      ...propertyData,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    // Push new property and get the key
    const newPropertyRef = push(propertiesRef);
    await set(newPropertyRef, enrichedData);

    return {
      id: newPropertyRef.key,
      ...enrichedData
    };
  } catch (error) {
    console.error('Error saving property:', error);
    throw new Error('Failed to save property. Please check your connection and try again.');
  }
};

export const getProperty = async (propertyId) => {
  try {
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, `properties/${propertyId}`));
    
    if (snapshot.exists()) {
      return {
        id: propertyId,
        ...snapshot.val()
      };
    }
    
    throw new Error('Property not found');
  } catch (error) {
    console.error('Error fetching property:', error);
    throw new Error('Failed to fetch property details');
  }
}; 