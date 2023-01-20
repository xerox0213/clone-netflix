import { useState, createContext } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase-config';
export const UserContext = createContext(null);

function UserContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

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
      value={{
        currentUser,
        createUser,
        connectUser,
        disconnectUser,
        setCurrentUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;
