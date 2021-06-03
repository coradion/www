// @ts-ignore
const wbManifest = self.__WB_MANIFEST;
import * as googleAnalytics from "workbox-google-analytics";
import firebase from "firebase/app";
import "firebase/auth";
import { firebaseConfig } from "../shared/firebase-config";

firebase.initializeApp(firebaseConfig);
const firebaseReady = firebase
  .auth()
  .setPersistence(firebase.auth.Auth.Persistence.LOCAL);
//firebase.auth().signInAnonymously().then(console.log).catch(console.error);
googleAnalytics.initialize();

self.addEventListener("message", async () => {
  /*  const {
    type,
    payload: { provider },
  } = event.data;*/
  await firebaseReady;
});
