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

export const ShadeContextProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <ShadeContext.Provider value={setOpen}>
      <div hidden={!open}>
        <EditTask />
      </div>
      {children}
    </ShadeContext.Provider>
  );
};
