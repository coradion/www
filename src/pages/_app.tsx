import {ElementType, FunctionComponent, useEffect} from "react";
import { AppProps } from "next/app";
import { Layout } from "../layout";
import { withTheme } from "../layout/theme";

import "../../public/fonts/fonts.css";
import { withShade } from "../contexts/shade";
import { withPageProps } from "../contexts/page-props";
import { withServiceWorker } from "../contexts/service-worker";
import { withFirebase } from "../contexts/firebase";
import { withAuth } from "../contexts/auth";

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
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

export default [
  withPageProps,
  withTheme,
  withFirebase,
  withAuth,
  withServiceWorker,
  withShade,
].reduceRight<ElementType<AppProps>>((Component, withHoc) => withHoc(Component), App);
