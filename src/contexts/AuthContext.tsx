import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, isAdmin: false });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          // Check if user doc exists
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef).catch(e => handleFirestoreError(e, OperationType.GET, `users/${currentUser.uid}`));
          
          if (!userDoc.exists()) {
            await setDoc(userDocRef, {
              email: currentUser.email,
              displayName: currentUser.displayName || 'Patient',
              role: 'patient',
              createdAt: serverTimestamp()
            }).catch(e => handleFirestoreError(e, OperationType.CREATE, `users/${currentUser.uid}`));
          }
          
          // Check admin status
          if (currentUser.email === 'asartist20@gmail.com') {
            setIsAdmin(true);
          } else {
            const adminDocRef = doc(db, 'admins', currentUser.uid);
            const adminDoc = await getDoc(adminDocRef).catch(e => handleFirestoreError(e, OperationType.GET, `admins/${currentUser.uid}`));
            setIsAdmin(adminDoc.exists());
          }
          
        } catch (error) {
          console.error("Error setting up user:", error);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
