import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import styled from "styled-components";
import { position } from "polished";
import { EditTask } from "../components/edit-task";
import {WithAppProps} from "./shared.types";

type ShadeContext = Dispatch<SetStateAction<boolean>> | null;

const shadeContext = createContext<ShadeContext>(null);

export const useShade = () => {
  const context = useContext(shadeContext);

  if (context === null)
    throw new Error(
      "`useShadeContext` was null, wrap any component above with `withShadeContext`"
    );

  return context;
};

const { Provider } = shadeContext;

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

export const withShade: WithAppProps = (Component) => (props) => {
  const [open, setOpen] = useState(false);
  return (
    <Provider value={setOpen}>
      <Shade open={open}>
        <EditTask />
      </Shade>
      <Component {...props} />
    </Provider>
  );
};
