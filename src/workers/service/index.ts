// @ts-ignore
const wbManifest = self.__WB_MANIFEST;

import { initialize as workboxGoogleAnalytics } from "workbox-google-analytics";
import { initializeApp } from "firebase/app";
import {
  indexedDBLocalPersistence,
  initializeAuth,
  onAuthStateChanged,
  signInAnonymously,
} from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

import { firebaseConfig } from "../../shared/firebase-config";
import { CoradionServiceWorkerState } from "./types";
import * as reducers from "./reducers";

const firebaseApp = initializeApp(firebaseConfig);

const state: CoradionServiceWorkerState = {
  auth: initializeAuth(firebaseApp, {
    persistence: indexedDBLocalPersistence,
  }),
  firestore: initializeFirestore(firebaseApp, {
    experimentalAutoDetectLongPolling: true,
  }),
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
    self.clients
      .matchAll({ includeUncontrolled: true, type: "window" })
      .then((matchedClients) => {
        const message = {
          type: "authStateChanged",
          payload: reducers.getUser(state),
        };
        matchedClients.forEach((client) => client.postMessage(message));
      });
  });

  workboxGoogleAnalytics();

  self.addEventListener("message", async (event) => {
    const { [event.data.type]: reducer = null } = reducers;
    if (reducer === null) return;
    const result = await reducer(state, event.data.payload);
    event.ports[0].postMessage(result);
  });
} catch (e) {
  console.error(e);
}
