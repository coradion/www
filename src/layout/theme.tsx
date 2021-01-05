import { AppProps } from "next/app";
import "fontsource-public-sans";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { setLightness } from "polished";

const theme = {
  colors: {
    primary: "deepskyblue",
    bad: "coral",
    good: "mediumseagreen",
    white: "seashell",
    greys: new Array(9)
      .fill(null)
      .map((_, index) => setLightness(index / 8, "#000")),
  },
};

const GlobalStyle = createGlobalStyle`
  * {
    font-family: "Public Sans", sans-serif;
  }
  h1 {
    font-family: "Stark", "Public Sans", sans-serif;
    color: deepskyblue;
  }
  body {
    background: ${theme.colors.greys[0]};
  }
`;

export const withTheme = (
  App: ({ Component, pageProps }: AppProps) => JSX.Element
) => (props: AppProps) => (
  <>
    <GlobalStyle />
    <ThemeProvider theme={theme}>
      <App {...props} />
    </ThemeProvider>
  </>
);
