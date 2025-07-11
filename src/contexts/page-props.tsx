"use client";

import type { AppProps } from "next/app";
import {
  createContext,
  type FunctionComponent,
  type PropsWithChildren,
  useContext,
} from "react";

const PagePropsContext = createContext<AppProps | null>(null);

export const usePageProps = () => {
  const context = useContext(PagePropsContext);

  if (context === null)
    throw new Error("`usePageProps` does not have a provider");
  return context;
};

export const PagePropsContextProvider: FunctionComponent<
  PropsWithChildren<AppProps>
> = ({ children, ...props }) => (
  <PagePropsContext.Provider value={props}>
    {children}
  </PagePropsContext.Provider>
);
