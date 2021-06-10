import Document from "next/document";
import { ServerStyleSheet } from "styled-components";
import React from "react";

export default class extends Document {
  static getInitialProps: typeof Document.getInitialProps = async (context) => {
    const serverStyleSheet = new ServerStyleSheet();
    context.renderPage = new Proxy(context.renderPage, {
      apply: (target) => {
        const enhanceApp = (App) => (props) =>
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
}
