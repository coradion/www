import { Auth } from "firebase/auth";
import { Firestore } from "firebase/firestore";

export type CoradionServiceWorkerState = {
  auth: Auth;
  firestore: Firestore;
  tasks: any[];
};
