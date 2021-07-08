import { Auth } from "firebase/auth";
import { FirebaseFirestore } from "firebase/firestore";

export type CoradionServiceWorkerState = {
  auth: Auth;
  firestore: FirebaseFirestore;
};
