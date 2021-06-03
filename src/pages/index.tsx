import { FunctionComponent, useEffect, useState } from "react";
import { CoradionLogo } from "../components/coradion-logo";
import styled from "styled-components";
import Head from "next/head";
import { GoogleLogo } from "../components/google-logo";
import { IconButton } from "../components/icon-button";

interface customWindow extends Window {
  gapi?: any;
}

declare const window: customWindow;

const StackedColorSquare = styled.div`
  width: 61.8vmin;
  height: 61.8vmin;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  margin: calc(38.2vmin / 2) auto;
`;

const WordMark = styled.h1`
  flex: 1;
  font-size: 10vmin;
  margin: 0;
`;

type GoogleAuth = {
  grantOfflineAccess: () => Promise<void>;
};

const FlexDiv = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
`;

const Aside = styled.aside`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  flex: 0 0 auto;
  margin: 0.5rem;
  padding: 0.5rem;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  justify-content: start;
  align-items: start;
`;

const Button = styled.button`
  background: rgba(0, 0, 0, 0);
  margin: 0.5rem;
  padding: 0.5rem;
  font-size: 1rem;
  border: transparent thin solid;
  border-radius: 0.5rem;
  transition: background 0.1s ease;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3rem;
  height: 3rem;
  :hover {
    background: rgba(0, 0, 0, 0.2);
  }
  :focus {
    outline: none;
  }
`;

const Card = styled.p`
  ${(p) => p.theme.css.glass};
  margin: 0.5rem;
  padding: 0.5rem;
`;

const IndexPage: FunctionComponent = () => {
  const [auth, setAuth] = useState<GoogleAuth | null>(null);
  const [clicked, setClicked] = useState(false);

  const handleGapiLoad = async () => {
    if (typeof window.gapi === "undefined") return;
    await new Promise((resolve) => window.gapi.load("auth2", resolve));
    const newAuth = window.gapi.auth2.init({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID,
    });
    setAuth(newAuth);
    if (clicked) {
      await newAuth.grantOfflineAccess();
      console.log("next step, validate token");
    }
  };

  const handleClick = async () => {
    if (auth === null) {
      setClicked(true);
      return;
    }
    const authResult = await auth.grantOfflineAccess();
    console.log("next step, validate token");
  };

  useEffect(() => {
    const gapiElement = document.querySelector("#gapi");
    if (gapiElement === null) return;
    gapiElement.addEventListener("load", handleGapiLoad);
    return () => {
      gapiElement.removeEventListener("load", handleGapiLoad);
    };
  }, []);

  return (
    <>
      <Head>
        <script
          id="gapi"
          src="https://apis.google.com/js/client:platform.js"
          async
          defer
        />
        <title>Coradion</title>
      </Head>
      <Aside>
        <IconButton>
          <CoradionLogo />
        </IconButton>
        <IconButton>👤</IconButton>
        <IconButton>➕</IconButton>
      </Aside>
      <Main>
        <Card>Grocery list</Card>
      </Main>
      {/*      <StackedColorSquare>
        <CoradionLogo size="61.8%" />
        <WordMark>coradion</WordMark>
        <FlexDiv>
          <h2>Log In</h2>
          <IconButton onClick={handleClick}>
            <GoogleLogo />
          </IconButton>
        </FlexDiv>
      </StackedColorSquare>*/}
    </>
  );
};

export default IndexPage;
