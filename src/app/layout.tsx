"use client";
import "./globals.css";
import "../../public/fonts/fonts.css";

import type { FunctionComponent, PropsWithChildren } from "react";
import { AuthContextProvider } from "../contexts/auth";
import { FirebaseContextProvider } from "../contexts/firebase";
import { ServiceWorkerProvider } from "../contexts/service-worker";
import { ShadeContextProvider } from "../contexts/shade";
import { Layout } from "../layout";

const App: FunctionComponent<PropsWithChildren> = ({ children }) => {
  // useEffect(() => {
  // const myWorker = new Worker(
  //   new URL("../workers/my.worker", import.meta.url)
  // );
  // myWorker.postMessage({ test: "test" });
  // }, []);
  return (
    <html lang="en">
      <body>
        <FirebaseContextProvider>
          <AuthContextProvider>
            <ServiceWorkerProvider>
              <ShadeContextProvider>
                <Layout>{children}</Layout>
              </ShadeContextProvider>
            </ServiceWorkerProvider>
          </AuthContextProvider>
        </FirebaseContextProvider>
      </body>
    </html>
  );
};

export default App;
