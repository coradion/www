import {
  ComponentType,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { firebaseConfig } from "../shared/firebase-config";
import { initializeApp, deleteApp, FirebaseApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
//import { addDoc, collection, initializeFirestore } from "firebase/firestore";

const FirebaseContext = createContext<FirebaseApp | null>(null);

export const useFirebase = () => useContext(FirebaseContext);

type WithFirebase = <T>(Component: ComponentType<T>) => ComponentType<T>;

export const withFirebase: WithFirebase = (Component) => (props) => {
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp | null>(null);
  useEffect(() => {
    const newFirebaseApp = initializeApp(firebaseConfig);

    getAnalytics(newFirebaseApp);
    /*
    const firestore = initializeFirestore(newFirebaseApp, {
      useFetchStreams: true,
      experimentalAutoDetectLongPolling: true,
    });
    const tasksCollection = collection(firestore, "tasks");
    addDoc(tasksCollection, { title: "test", description: "test" })
      .then(console.log)
      .catch(console.error);
    */
    setFirebaseApp(newFirebaseApp);
    return () => {
      if(firebaseApp === null) return;
      deleteApp(newFirebaseApp);
      setFirebaseApp(null);
    };
  }, []);

  return (
    <FirebaseContext.Provider value={firebaseApp}>
      <Component {...props} />
    </FirebaseContext.Provider>
  );
};
