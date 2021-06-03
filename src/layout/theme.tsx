import { AppProps } from "next/app";
import "fontsource-public-sans";
import { createGlobalStyle, css, ThemeProvider } from "styled-components";
import { darken, setLightness, transparentize } from "polished";

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
  css: {
    glass: css`
      background: linear-gradient(
        -45deg,
        ${transparentize(0.9, "seashell")},
        ${transparentize(0.8, "seashell")}
      );
      border: thin outset ${transparentize(0.8, "seashell")};
      border-radius: 1rem;
      backdrop-filter: blur(0.25rem);
      box-shadow: rgba(0, 0, 0, 0.2) 0.618rem 0.618rem 1.618rem;
    `,
  },
};

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    font-family: "Public Sans", sans-serif;
  }
  h1, h2, h3, h4, h5, h6, p, button {
    color: ${transparentize(0.2, "seashell")};
  }
  body {
    background: url(https://media.bahai.org/static/mezzo-a44facdf5007a07d3a16a780f2c3b5ae.png), linear-gradient(-45deg, ${
      theme.colors.greys[0]
    }, ${darken(0.4, theme.colors.primary)});
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-flow: row nowrap;
    margin: 0;
    padding: 0.5rem;
  }
  #__next {
    display: contents;
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
