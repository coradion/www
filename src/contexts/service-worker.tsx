import {
  ComponentType,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { AppProps } from "next/app";
import { Workbox } from "workbox-window";
import { WorkboxMessageEvent } from "workbox-window/utils/WorkboxEvent";

type ServiceWorker = {
  user: any;
};

const initialState = {
  workbox: null,
  user: null,
};

const ServiceWorkerContext = createContext<ServiceWorker>(initialState);

export const useServiceWorker = () => {
  const context = useContext(ServiceWorkerContext);
  if (context === null)
    throw new Error("`useServiceWorker` does not have a provider");
  return context;
};

type WithPageProps = <T>(
  Component: ComponentType<AppProps<T>>
) => ComponentType<AppProps<T>>;

const reducers = {
  setUser: (state, user) => ({ ...state, user }),
  createTask: ({ workbox }, payload) => {
    if (workbox === null) throw new Error("workbox not defined");
    return workbox.messageSW({ type: "createTask", payload });
  },
};

/**
 * @todo The name of this needs to be improved
 */
const selectReducer = (state, { type, payload }) => {
  const { [type]: reducer = null } = reducers;
  return reducer !== null ? reducer(state, payload) : undefined;
};

const init = (state) =>
  typeof window === "undefined"
    ? state
    : {
        ...state,
        workbox: new Workbox("/_next/static/chunks/service.worker.js"),
      };

export const withServiceWorker: WithPageProps = (Component) => (props) => {
  const [state, dispatch] = useReducer(selectReducer, initialState, init);
  useEffect(() => {
    if (state.workbox === null) return;
    const eventReducer = ({ data, ...restOfData }: WorkboxMessageEvent) => {
      console.log(restOfData);
      if (data.type === "authStateChanged") {
        dispatch({ type: "setUser", payload: data.payload });
      }
    };
    state.workbox.addEventListener("message", eventReducer);
    state.workbox.register().then(async () => {
      await state.workbox.update();
      const newUser = await state.workbox.messageSW({ type: "getUser" });
      dispatch({ type: "setUser", payload: newUser });
    });

    return () => {
      state.workbox.removeEventListener("message", eventReducer);
      dispatch({ type: "setUser", payload: null });
    };
  }, []);
  const { user } = state;
  return (
    <ServiceWorkerContext.Provider value={{ user, dispatch }}>
      <Component {...props} />
    </ServiceWorkerContext.Provider>
  );
};
