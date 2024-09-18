"use client";

import { FunctionComponent } from "react";
import styled from "styled-components";
import Head from "next/head";
import { useCurrent } from "../hooks/useCurrent";

const Main = styled.main`
  flex: 1;
  display: flex;
  justify-content: start;
  align-items: start;
`;

const IndexPage: FunctionComponent = () => {
  const tasks = useCurrent("Tasks");
  return (
    <>
      <Head>
        <title>Coradion</title>
      </Head>
      <Main />
      <pre>{JSON.stringify(tasks, null, 2)}</pre>
    </>
  );
};

export default IndexPage;
