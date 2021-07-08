import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";
import React from "react";
import { AppType, Enhancer } from "next/dist/next-server/lib/utils";

export default class extends Document {
  static getInitialProps: typeof Document.getInitialProps = async (context) => {
    const serverStyleSheet = new ServerStyleSheet();
    context.renderPage = new Proxy(context.renderPage, {
      apply: (target) => {
        const enhanceApp: Enhancer<AppType> = (App) => (props) =>
          serverStyleSheet.collectStyles(<App {...props} />);
        return target({ enhanceApp });
      },
    });
    const initialProps = await Document.getInitialProps(context);
    const styledElement = serverStyleSheet.getStyleElement();
    const styles = [
      ...React.Children.toArray(initialProps.styles),
      styledElement,
    ];
    serverStyleSheet.seal();
    return { ...initialProps, styles };
  };

  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
