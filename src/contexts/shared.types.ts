import { AppProps } from "next/app";
import { ComponentType, ElementType } from "react";

export type WithAppProps = <T>(
  Component: ElementType<AppProps<T>>
) => ComponentType<AppProps<T>>;
