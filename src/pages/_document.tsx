import Document from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class extends Document {
  static getInitialProps: typeof Document.getInitialProps = async (context) => {
    const sheet = new ServerStyleSheet();
    const { renderPage: originalRenderPage } = context;
    context.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />)
      });
    const initialProps = await Document.getInitialProps(context);
    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {sheet.getStyleElement()}
        </>
      )
    }
  }
}
