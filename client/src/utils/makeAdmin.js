import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../configs/firebase';

/**
 * Utility function to make a user admin by email
 * This can be used in browser console or as a one-time script
 */
export const makeUserAdmin = async (email) => {
  try {
    // First, we need to find the user by email
    // Since we can't query by email directly, we'll need to check if the user exists
    console.log(`Attempting to make ${email} an admin...`);
    
    // For now, we'll provide instructions to do this manually
    console.log(`
    To make ${email} an admin, follow these steps:
    
    1. Go to Firebase Console: https://console.firebase.google.com
    2. Select your project: picachio-website
    3. Go to Firestore Database
    4. Find the 'users' collection
    5. Find the document with the user's UID (not email)
    6. Edit the document and set: role: "admin"
    
    OR use this function after the user has logged in at least once:
    makeUserAdminByUID("USER_UID_HERE")
    `);
    
    return false;
  } catch (error) {
    console.error('Error making user admin:', error);
    return false;
  }
};

/**
 * Make user admin by UID (more direct method)
 */
export const makeUserAdminByUID = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    
    // Check if user exists
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      console.error('User document not found. User must login at least once.');
      return false;
    }
    
    // Update user role to admin
    await setDoc(userRef, {
      role: 'admin',
      updatedAt: new Date()
    }, { merge: true });
    
    console.log(`User ${uid} is now an admin!`);
    return true;
  } catch (error) {
    console.error('Error making user admin:', error);
    return false;
  }
};

// For console usage
if (typeof window !== 'undefined') {
  window.makeUserAdmin = makeUserAdmin;
  window.makeUserAdminByUID = makeUserAdminByUID;
}
