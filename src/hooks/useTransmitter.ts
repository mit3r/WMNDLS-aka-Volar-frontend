import { useSyncExternalStore } from "react";
import { Message, transmitter } from "../api/Transmitter";

export function useTransmitter() {
  const status = useSyncExternalStore(
    (callback) => transmitter.subscribe(callback),
    () => transmitter.getStatus()
  );

  return {
    status,
    connect: () => transmitter.connect(),
    disconnect: () => transmitter.disconnect(),
    sendMessage: (msg: Message) => transmitter.sendMessage(msg),
  };
}
