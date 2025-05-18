import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

export type CoradionServiceWorkerState = {
  auth: Auth;
  firestore: Firestore;
  tasks: any[];
};
