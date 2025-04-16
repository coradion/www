"use client";
import "./globals.css";
import "../../public/fonts/fonts.css";

import { FunctionComponent, PropsWithChildren } from "react";
import { Layout } from "../layout";
import { AuthContextProvider } from "../contexts/auth";
import { FirebaseContextProvider } from "../contexts/firebase";
import { ThemeContextProvider } from "../layout/theme";
import { ShadeContextProvider } from "../contexts/shade";
import { ServiceWorkerProvider } from "../contexts/service-worker";

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
        <ThemeContextProvider>
          <FirebaseContextProvider>
            <AuthContextProvider>
              <ServiceWorkerProvider>
                <ShadeContextProvider>
                  <Layout>{children}</Layout>
                </ShadeContextProvider>
              </ServiceWorkerProvider>
            </AuthContextProvider>
          </FirebaseContextProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
};

export default App;
