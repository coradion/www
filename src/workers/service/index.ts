// @ts-nocheck

// @ts-ignore
const wbManifest = self.__WB_MANIFEST;

import { initializeApp } from "firebase/app";
import {
  indexedDBLocalPersistence,
  initializeAuth,
  onAuthStateChanged,
  signInAnonymously,
} from "firebase/auth";
import {
  collection,
  initializeFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { initialize as workboxGoogleAnalytics } from "workbox-google-analytics";

import { firebaseConfig } from "../../shared/firebase-config";
import * as reducers from "./reducers";
import type { CoradionServiceWorkerState } from "./types";

const firebaseApp = initializeApp(firebaseConfig);

const state: CoradionServiceWorkerState = {
  auth: initializeAuth(firebaseApp, {
    persistence: indexedDBLocalPersistence,
  }),
  firestore: initializeFirestore(firebaseApp, {
    experimentalAutoDetectLongPolling: true,
  }),
  tasks: [],
};

try {
  self.clients
    .matchAll({ includeUncontrolled: true, type: "window" })
    .then((matchedClients) => {
      const message = {
        type: "authStateChanged",
        payload: reducers.getUser(state),
      };
      matchedClients.forEach((client) => client.postMessage(message));
    });
  onAuthStateChanged(state.auth, () => {
    if (state.auth.currentUser === null) return signInAnonymously(state.auth);
    const userBroadcastChannel = new BroadcastChannel("User");
    userBroadcastChannel.postMessage(reducers.getUser(state));
    const tasksCollection = collection(state.firestore, "tasks");
    const tasksQuery = query(
      tasksCollection,
      where("creator.uid", "==", state.auth.currentUser.uid),
    );
    const tasksBroadcastChannel = new BroadcastChannel("Tasks");
    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      state.tasks = snapshot.docs.map((doc) => doc.data());
      tasksBroadcastChannel.postMessage(state.tasks);
    });
  });

  workboxGoogleAnalytics();

  self.addEventListener("message", async (event) => {
    const { [event.data.type]: reducer = null } = reducers;
    console.log("sw got message", event);
    if (reducer === null) return;
    const result = await reducer(state, event.data.payload);
    event.ports[0].postMessage(result);
  });
} catch (e) {
  console.error(e);
}
