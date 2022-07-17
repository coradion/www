import {useEffect, useState} from "react";
import {useServiceWorker} from "../contexts/service-worker";

export const useCurrent = (channel: "Tasks" | "User") => {
  const workbox = useServiceWorker();
  const [state, setState] = useState(null);

  useEffect(() => {
    if(workbox === null) return;
    const broadcastChannel = new BroadcastChannel(channel);
    broadcastChannel.onmessage = ({ data }) => {
      console.log("got broadcast channel message", data);
      setState(data);
    }

    workbox.messageSW({ type: `get${channel}`, payload: undefined }).then(setState).catch(console.error)

    return () => {
      broadcastChannel.close();
      setState(null);
    }
  }, [workbox])
  return state;
}
