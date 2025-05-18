import type { AppProps } from "next/app";
import type { ComponentType, ElementType } from "react";

export type WithAppProps = <T>(
  Component: ElementType<AppProps<T>>,
) => ComponentType<AppProps<T>>;
