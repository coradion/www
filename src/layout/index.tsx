import Head from "next/head";
import React, { type ReactNode } from "react";
import { SideButtons } from "./side-buttons";

type Props = {
  children?: ReactNode;
  title?: string;
};

export const Layout = ({
  children,
  title = "This is the default title",
}: Props) => (
  <>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    {children}
    <SideButtons />
  </>
);
