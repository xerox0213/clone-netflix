import { useState, createContext, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase-config';
export const UserContext = createContext(null);

function UserContextProvider({ children }) {
  const [dataIsLoaded, setDataIsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unobserve = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setDataIsLoaded(true);
    });
    return unobserve;
  }, []);

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const connectUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  const disconnectUser = () => {
    return signOut(auth);
  };

  return (
    <UserContext.Provider
      value={{ currentUser, createUser, connectUser, disconnectUser }}
    >
      {dataIsLoaded && children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;
