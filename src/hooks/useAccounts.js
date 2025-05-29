import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { getDatabase, ref, set, get, remove, update, onValue, push } from 'firebase/database';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';

export const useAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const db = getDatabase();
    const accountsRef = ref(db, 'accounts');

    // Set up real-time listener
    const unsubscribe = onValue(accountsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          // Convert object to array and add the key as id
          const accountsArray = Object.entries(data).map(([id, account]) => ({
            id,
            ...account
          }));
          console.log('Accounts loaded:', accountsArray);
          setAccounts(accountsArray);
        } else {
          setAccounts([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error processing accounts:', err);
        setError(err.message);
        setLoading(false);
      }
    }, (err) => {
      console.error('Database error:', err);
      setError(err.message);
      setLoading(false);
    });

    // Cleanup subscription
    return () => {
      // Detach the listener
      unsubscribe();
    };
  }, []);

  // Add new account
  const addAccount = async (accountData) => {
    try {
      setLoading(true);
      const db = getDatabase();
      
      // Validate email format
      if (!accountData.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      // Validate password length
      if (accountData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Create a new reference for the account
      const newAccountRef = push(ref(db, 'accounts'));
      
      // Prepare the account data
      const newAccount = {
        username: accountData.name.toLowerCase().replace(/\s+/g, '_'),
        name: accountData.name,
        email: accountData.email,
        accountType: accountData.accountType.toLowerCase(),
        password: accountData.password, // In a production app, you should hash this
        createdAt: new Date().toISOString(),
        status: 'Active'
      };

      // Save to database
      await set(newAccountRef, newAccount);
      
      toast.success('Account created successfully');
    } catch (err) {
      console.error('Error adding account:', err);
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete account
  const deleteAccount = async (id) => {
    try {
      setLoading(true);
      const db = getDatabase();
      await remove(ref(db, `accounts/${id}`));
      toast.success('Account deleted successfully');
    } catch (err) {
      console.error('Delete Error:', err);
      toast.error('Error deleting account. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update account
  const updateAccount = async (id, data) => {
    try {
      setLoading(true);
      const db = getDatabase();
      const updates = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      // Remove password if it's empty (no change)
      if (!updates.password) {
        delete updates.password;
      }
      
      await update(ref(db, `accounts/${id}`), updates);
      toast.success('Account updated successfully');
    } catch (err) {
      console.error('Update Error:', err);
      toast.error('Error updating account. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Filter accounts by type
  const getAccountsByType = (type) => {
    if (type === 'users') return accounts;
    if (type === 'owners') {
      return accounts.filter(account => 
        account.accountType && 
        (account.accountType.toLowerCase() === 'owner' || 
         account.accountType.toLowerCase() === 'landlord')
      );
    }
    return accounts.filter(account => 
      account.accountType && account.accountType.toLowerCase() === type.toLowerCase()
    );
  };

  return {
    accounts,
    loading,
    error,
    addAccount,
    deleteAccount,
    updateAccount,
    getAccountsByType
  };
}; 