"use client";

import {
  createContext,
  Dispatch,
  FunctionComponent,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";
import styled from "styled-components";
import { position } from "polished";
import { EditTask } from "../components/edit-task";

type ShadeContext = Dispatch<SetStateAction<boolean>> | null;

const ShadeContext = createContext<ShadeContext>(null);

export const useShade = () => {
  const context = useContext(ShadeContext);

  if (context === null)
    throw new Error(
      "`useShadeContext` was null, wrap any component above with `withShadeContext`",
    );

  return context;
};

type ShadeProps = { open: boolean };

const Shade = styled.div<ShadeProps>`
  ${position("absolute", 0, 0, 0, 0)};
  display: ${(p) => (p.open ? "flex" : "none")};
  backdrop-filter: blur(0.25rem);
  background-color: rgba(0, 0, 0, 0.25);
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

Shade.displayName = "Shade";

export const ShadeContextProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <ShadeContext.Provider value={setOpen}>
      <Shade open={open}>
        <EditTask />
      </Shade>
      {children}
    </ShadeContext.Provider>
  );
};
