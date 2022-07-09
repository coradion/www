import { createContext, useContext } from "react";
import { AppProps } from "next/app";
import {WithAppProps} from "./shared.types";

const PagePropsContext = createContext<AppProps | null>(null);

export const usePageProps = () => {
  const context = useContext(PagePropsContext);
  if (context === null)
    throw new Error("`usePageProps` does not have a provider");
  return context;
};

export const withPageProps: WithAppProps = (Component) => (props) =>
  (
    <PagePropsContext.Provider value={props.pageProps}>
      <Component {...props} />
    </PagePropsContext.Provider>
  );
