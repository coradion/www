"use client";

import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Auth,
  browserPopupRedirectResolver,
  indexedDBLocalPersistence,
  initializeAuth,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { useFirebase } from "./firebase";

type AuthContextProps = { auth: Auth | null; user: User | null };

const initialContext: AuthContextProps = { auth: null, user: null };

const AuthContext = createContext<AuthContextProps>(initialContext);

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const firebaseApp = useFirebase();
  const [auth, setAuth] = useState<Auth | null>(null);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    if (firebaseApp === null || auth !== null) return;
    const newAuth = initializeAuth(firebaseApp, {
      persistence: indexedDBLocalPersistence,
      popupRedirectResolver: browserPopupRedirectResolver,
    });
    const unsubscribe = onAuthStateChanged(newAuth, setUser);
    setAuth(newAuth);
    return () => {
      unsubscribe();
    };
  }, [auth, firebaseApp]);
  return (
    <AuthContext.Provider value={{ auth, user }}>
      {children}
    </AuthContext.Provider>
  );
};
