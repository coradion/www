import { ComponentType, createContext, useContext } from "react";
import { AppProps } from "next/app";

const PagePropsContext = createContext<AppProps | null>(null);

export const usePageProps = () => {
  const context = useContext(PagePropsContext);
  if (context === null)
    throw new Error("`usePageProps` does not have a provider");
  return context;
};

type WithPageProps = <T>(
  Component: ComponentType<AppProps<T>>
) => ComponentType<AppProps<T>>;

export const withPageProps: WithPageProps = (Component) => (props) =>
  (
    <PagePropsContext.Provider value={props.pageProps}>
      <Component {...props} />
    </PagePropsContext.Provider>
  );
