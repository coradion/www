import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";
import React from "react";
import {AppType, Enhancer} from "next/dist/shared/lib/utils";

export default class extends Document {
  static getInitialProps: typeof Document.getInitialProps = async (context) => {
    const serverStyleSheet = new ServerStyleSheet();
    context.renderPage = new Proxy(context.renderPage, {
      apply: (target) => {
        const enhanceApp: Enhancer<AppType> = (App) => (props) =>
          serverStyleSheet.collectStyles(<App {...props} />);
        return target({enhanceApp});
      },
    });
    const initialProps = await Document.getInitialProps(context);
    const styledElement = serverStyleSheet.getStyleElement();
    const styles = [initialProps.styles, styledElement];
    try {
      return {...initialProps, styles};
    } finally {
      serverStyleSheet.seal();
    }
  };

  render = () => (
    <Html lang="en">
      <Head/>
      <body>
      <Main/>
      <NextScript/>
      </body>
    </Html>
  );
}
