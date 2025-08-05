import { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../configs/firebase";
import { initializeUser } from "../utils/userUtils";

// 1. Create the context
const AuthContext = createContext(null);

// 2. Buat Provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true); // Untuk menangani loading saat cek user

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Initialize user document if it doesn't exist
        await initializeUser(currentUser, 'client');
        
        // Fetch user role from Firestore
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role || 'client'); // Default to 'client' if no role specified
          } else {
            // If user document doesn't exist, default to 'client'
            setUserRole('client');
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole('client'); // Default to 'client' on error
        }
      } else {
        setUserRole(null);
      }
      
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom hook
export function useAuth() {
  return useContext(AuthContext);
}