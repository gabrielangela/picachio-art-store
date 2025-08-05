import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../configs/firebase';

/**
 * Set user role in Firestore
 * @param {string} userId - The user's UID
 * @param {string} role - The role to assign ('admin' or 'client')
 * @param {object} additionalData - Additional user data
 */
export const setUserRole = async (userId, role, additionalData = {}) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      role,
      createdAt: new Date(),
      ...additionalData
    }, { merge: true });
    
    console.log(`User role set to: ${role}`);
    return true;
  } catch (error) {
    console.error('Error setting user role:', error);
    return false;
  }
};

/**
 * Get user role from Firestore
 * @param {string} userId - The user's UID
 */
export const getUserRole = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data().role || 'client';
    } else {
      return 'client'; // Default role
    }
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'client'; // Default role on error
  }
};

/**
 * Initialize user document on first login
 * @param {object} user - Firebase user object
 * @param {string} defaultRole - Default role to assign
 */
export const initializeUser = async (user, defaultRole = 'client') => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        role: defaultRole,
        createdAt: new Date(),
        lastLogin: new Date()
      });
      console.log(`New user initialized with role: ${defaultRole}`);
    } else {
      // Update last login
      await setDoc(userRef, {
        lastLogin: new Date()
      }, { merge: true });
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing user:', error);
    return false;
  }
};
