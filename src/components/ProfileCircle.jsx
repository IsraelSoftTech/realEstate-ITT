import React, { useState, useEffect } from 'react';
import './ProfileCircle.css';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, storage, db } from '../firebase';

const ProfileCircle = () => {
  const [showModal, setShowModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch existing profile image when component mounts
    const fetchProfileImage = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (userDoc.exists() && userDoc.data().profileImage) {
            setPreviewUrl(userDoc.data().profileImage);
          }
        } catch (error) {
          console.error('Error fetching profile image:', error);
          setError('Failed to fetch existing profile image');
        }
      }
    };

    fetchProfileImage();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && auth.currentUser) {
      try {
        setIsLoading(true);
        setError(null);
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('File size too large. Please choose an image under 5MB.');
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);

        console.log('Uploading to path:', `profileImages/${auth.currentUser.uid}`);
        
        // Upload to Firebase Storage
        const storageRef = ref(storage, `profileImages/${auth.currentUser.uid}`);
        const uploadResult = await uploadBytes(storageRef, file);
        console.log('Upload successful:', uploadResult);
        
        // Get download URL
        const downloadURL = await getDownloadURL(storageRef);
        console.log('Download URL obtained:', downloadURL);
        
        // Save URL to Firestore
        await setDoc(doc(db, 'users', auth.currentUser.uid), {
          profileImage: downloadURL,
          updatedAt: new Date().toISOString()
        }, { merge: true });

        console.log('Firestore document updated successfully');

        setProfileImage(file);
        setPreviewUrl(downloadURL);
        setShowModal(false);
      } catch (error) {
        console.error('Detailed error:', error);
        setError(error.message || 'Failed to upload image. Please try again.');
        alert(error.message || 'Failed to upload image. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else if (!auth.currentUser) {
      setError('Please sign in to upload a profile image');
      alert('Please sign in to upload a profile image');
    }
  };

  return (
    <>
      <div 
        className="profile-circle"
        onClick={() => {
          if (!auth.currentUser) {
            alert('Please sign in to update your profile image');
            return;
          }
          setShowModal(true);
        }}
      >
        {isLoading ? (
          <span className="loading">...</span>
        ) : previewUrl ? (
          <img src={previewUrl} alt="Profile" />
        ) : (
          <span>Ad</span>
        )}
      </div>

      {showModal && (
        <div className="profile-modal">
          <div className="modal-content">
            <h3>Update Profile Picture</h3>
            {error && <p className="error-message">{error}</p>}
            <div className="upload-area">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="profile-upload"
                disabled={isLoading}
              />
              <label htmlFor="profile-upload">
                {isLoading ? 'Uploading...' : 'Choose Image'}
              </label>
            </div>
            <button 
              className="close-modal"
              onClick={() => {
                setShowModal(false);
                setError(null);
              }}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileCircle; 