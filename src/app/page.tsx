"use client";

import Head from "next/head";
import type { FunctionComponent } from "react";
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
