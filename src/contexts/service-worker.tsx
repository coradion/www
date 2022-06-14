import {
  createContext, Dispatch,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { Workbox } from "workbox-window";
import { WorkboxMessageEvent } from "workbox-window/utils/WorkboxEvent";
import {WithAppProps} from "./shared.types";

type ServiceWorkerState = {
  user: any;
  dispatch: Dispatch<DispatchParams>;
};

const ServiceWorkerContext = createContext<ServiceWorkerState | null>(null);

export const useServiceWorker = () => {
  const context = useContext(ServiceWorkerContext);
  if (context === null)
    throw new Error("`useServiceWorker` does not have a provider");
  return context;
};

const reducers = {
  setUser: (state: ServiceWorkerState, user: any) => ({ ...state, user }),
  createTask: ({ workbox }: any, payload: any) => {
    if (workbox === null) throw new Error("workbox not defined");
    return workbox.messageSW({ type: "createTask", payload });
  },
} as const;

type Reducers = typeof reducers;

type ReducerKeys = keyof Reducers;

type DispatchParams = {
  [K in ReducerKeys]: {type: K, payload: Parameters<Reducers[K]>[1]}
}[ReducerKeys]

/**
 * @todo The name of this needs to be improved
 */
const selectReducer = (state: ServiceWorkerState, { type, payload }: DispatchParams) => {
  const { [type]: reducer = null } = reducers;
  return reducer !== null ? reducer(state, payload) : undefined;
};

const init = (state: ServiceWorkerState) =>
  typeof window === "undefined"
    ? state
    : {
        ...state,
        workbox: new Workbox("/_next/static/chunks/service.worker.js"),
      };

export const withServiceWorker: WithAppProps = (Component) => (props) => {
  const [state, dispatch] = useReducer(selectReducer, {}, init);
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
