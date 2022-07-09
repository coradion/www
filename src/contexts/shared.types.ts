import {AppProps} from "next/app";
import {ElementType} from "react";

export type WithAppProps = <T>(
  Component: ElementType<AppProps<T>>
) => ElementType<AppProps<T>>;
