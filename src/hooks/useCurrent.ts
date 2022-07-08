import {useEffect, useState} from "react";
import {useServiceWorker} from "../contexts/service-worker";

export const useCurrent = (channel: "Tasks") => {
  const workbox = useServiceWorker();
  const [state, setState] = useState(null);

  useEffect(() => {
    if(workbox === null) return;
    const broadcastChannel = new BroadcastChannel(channel);
    broadcastChannel.onmessage = ({ data }) => {
      console.log("got broadcast channel message", data);
      setState(data);
    }

    setInterval(() => {
      console.log("sending message to SW")
      workbox.messageSW({ type: `get${channel}`, payload: undefined }).then(({ data }) => setState(data)).catch(console.error)
    }, 5000)

    return () => {
      broadcastChannel.close();
      setState(null);
    }
  }, [workbox])
  return state;
}
