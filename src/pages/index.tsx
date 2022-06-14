// @ts-nocheck

import { FunctionComponent } from "react";
import { CoradionLogo } from "../components/coradion-logo";
import styled from "styled-components";
import Head from "next/head";
import { IconButton } from "../components/icon-button";
import { List } from "../components/cards";
import { ProfileButton } from "../components/profile-button";
import { useShade } from "../contexts/shade";

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

const FlexDiv = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
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
  return (
    <>
      <Head>
        <title>Coradion</title>
      </Head>
      <Main />
    </>
  );
};

export default IndexPage;
