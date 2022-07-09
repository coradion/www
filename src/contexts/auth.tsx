import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Auth,
  User,
  browserPopupRedirectResolver,
  indexedDBLocalPersistence,
  initializeAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { useFirebase } from "./firebase";
import {WithAppProps} from "./shared.types";

type AuthContextProps = { auth: Auth | null; user: User | null };

const initialContext: AuthContextProps = { auth: null, user: null };

const AuthContext = createContext<AuthContextProps>(initialContext);

export const useAuth = () => useContext(AuthContext);

export const withAuth: WithAppProps = (Component) => (props) => {
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
  }, [firebaseApp]);
  return (
    <AuthContext.Provider value={{ auth, user }}>
      <Component {...props} />
    </AuthContext.Provider>
  );
};
