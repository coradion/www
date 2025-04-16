"use client";

import { FunctionComponent } from "react";
import Head from "next/head";
import { useCurrent } from "../hooks/useCurrent";

const IndexPage: FunctionComponent = () => {
  const tasks = useCurrent("Tasks");
  return (
    <>
      <Head>
        <title>Coradion</title>
      </Head>
      <pre>{JSON.stringify(tasks, null, 2)}</pre>
    </>
  );
};

export default IndexPage;
