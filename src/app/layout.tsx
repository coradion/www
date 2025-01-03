"use client";

import { FunctionComponent, PropsWithChildren } from "react";
import { Layout } from "../layout";
import "../../public/fonts/fonts.css";
import { AuthContextProvider } from "../contexts/auth";
import { FirebaseContextProvider } from "../contexts/firebase";
import { ThemeContextProvider } from "../layout/theme";
import { ShadeContextProvider } from "../contexts/shade";
import { ServiceWorkerProvider } from "../contexts/service-worker";

// export default class extends Document {
//   static getInitialProps: typeof Document.getInitialProps = async (context) => {
//     const serverStyleSheet = new ServerStyleSheet();
//     context.renderPage = new Proxy(context.renderPage, {
//       apply: (target) => {
//         const enhanceApp: Enhancer<AppType> = (App) => (props) =>
//           serverStyleSheet.collectStyles(<App {...props} />);
//         return target({ enhanceApp });
//       },
//     });
//     const initialProps = await Document.getInitialProps(context);
//     const styledElement = serverStyleSheet.getStyleElement();
//     const styles = [initialProps.styles, styledElement];
//     try {
//       return { ...initialProps, styles };
//     } finally {
//       serverStyleSheet.seal();
//     }
//   };
//
//   render = () => (
//
//
//   );
// }

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
