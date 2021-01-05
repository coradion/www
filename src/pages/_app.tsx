import { AppProps } from "next/app";
import { Layout } from "../layout";
import { withTheme } from "../layout/theme";

import "../../public/fonts/fonts.css";

const App = ({ Component, pageProps }: AppProps) => (
  <Layout>
    <Component {...pageProps} />
  </Layout>
);

export default withTheme(App);
