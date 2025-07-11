"use client";

import { getAnalytics } from "firebase/analytics";
import { deleteApp, type FirebaseApp, initializeApp } from "firebase/app";
import {
  createContext,
  type FunctionComponent,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { firebaseConfig } from "../shared/firebase-config";

const FirebaseContext = createContext<FirebaseApp | null>(null);

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseContextProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp | null>(null);
  useEffect(() => {
    const newFirebaseApp = initializeApp(firebaseConfig);

    getAnalytics(newFirebaseApp);
    setFirebaseApp(newFirebaseApp);
    return () => {
      if (firebaseApp === null) return;
      deleteApp(newFirebaseApp);
      setFirebaseApp(null);
    };
  }, [firebaseApp]);

  return (
    <FirebaseContext.Provider value={firebaseApp}>
      {children}
    </FirebaseContext.Provider>
  );
};
