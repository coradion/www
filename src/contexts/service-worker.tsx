import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Workbox } from "workbox-window";
import { WorkboxMessageEvent } from "workbox-window/utils/WorkboxEvent";
import {WithAppProps} from "./shared.types";

type ServiceWorkerState = Workbox;

// const reducers = {
//   setUser: (state: ServiceWorkerState, user: any) => {
//     state.user = user;
//     return state;
//   },
//   createTask: (state: ServiceWorkerState, payload: any) => {
//     void state.workbox.messageSW({type: "createTask", payload});
//     return state;
//   },
// } as const;

// type Reducers = typeof reducers;
//
// type ReducerKeys = keyof Reducers;

// type DispatchParams = {
//   [K in ReducerKeys]: {type: K, payload: Parameters<Reducers[K]>[1]}
// }[ReducerKeys]

const ServiceWorkerContext = createContext<ServiceWorkerState | null>(null);

export const useServiceWorker = () => {
  const context = useContext(ServiceWorkerContext);
  // if (context === null)
  //   throw new Error("`useServiceWorker` does not have a provider");
  return context;
};



const onActivated = async () => {
  console.log("activated")
}

const onWaiting = async () => {
  console.log("waiting")
}

export const withServiceWorker: WithAppProps = (Component) => (props) => {
  const [workbox, setWorkbox] = useState<Workbox | null>(null);
  useEffect(() => {
    if(workbox !== null) return;
    const newWorkbox = new Workbox("/_next/static/chunks/service.worker.js", { scope: "/"});
    const onMessage = ({ data }: WorkboxMessageEvent) => {
      console.log("gotMessage", data);
    };

    newWorkbox.addEventListener("message", onMessage);
    newWorkbox.addEventListener("activated", onActivated);
    const events = [
      "activating", "controlling", "installed", "installing", "redundant", "waiting"
    ] as const

    events.forEach(event => {
      newWorkbox.addEventListener(event, console.log)
    })

    newWorkbox.active.then(() => console.log("active promise"))
    newWorkbox.controlling.then(() => console.log("controlling promise"))

    newWorkbox.register().then(async (result) => {
      await newWorkbox.update();
      console.log("service worker registered", result)
      setWorkbox(newWorkbox);
    }).catch(console.error);

    return () => {
      newWorkbox.removeEventListener("message", onMessage);
      newWorkbox.removeEventListener("activated", onActivated);
      newWorkbox.removeEventListener("waiting", onWaiting);

      events.forEach(event => {
        newWorkbox.removeEventListener(event, console.log)
      })

      setWorkbox(null);
    };
  }, []);
  return (
    <ServiceWorkerContext.Provider value={workbox}>
      <Component {...props} />
    </ServiceWorkerContext.Provider>
  );
};
