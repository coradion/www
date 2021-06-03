import { useEffect } from "react";
import { AppProps } from "next/app";
import { Workbox } from "workbox-window";
import { Layout } from "../layout";
import { withTheme } from "../layout/theme";
import { firebaseConfig } from "../shared/firebase-config";

import "../../public/fonts/fonts.css";

const firebaseImport = import("firebase/app");
const firebaseAnalyticsImport = import("firebase/analytics");

const initializeFirebase = async () => {
  const { default: firebase } = await firebaseImport;
  await firebaseAnalyticsImport;
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
};

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    const wb = new Workbox("/_next/static/chunks/service.worker.js");
    wb.register();
    wb.messageSW({ type: "auth", payload: { provider: "google" } });
    initializeFirebase().catch(console.error);
    const myWorker = new Worker(
      new URL("../workers/my.worker", import.meta.url)
    );
    myWorker.postMessage({ test: "test" });
  }, []);
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default withTheme(App);
