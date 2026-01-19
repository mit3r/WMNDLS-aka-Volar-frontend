import { transmitter } from "@api/Transmitter";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

export default function PortModal() {
  const [error, setError] = useState<string | null>(null);

  const [rejected, setRejected] = useState<boolean>(false);
  const handleReject = () => setRejected(true);
  const handleUnreject = () => setRejected(false);

  const last = transmitter.getLastPortInfo();

  const status = useSyncExternalStore(transmitter.subscribe.bind(transmitter), transmitter.getStatus.bind(transmitter));

  const handleReconnectLast = async () =>
    transmitter.connect().catch(() => setError("Failed to connect to last transmitter device"));

  const handleChoosePort = async () =>
    transmitter.connectWithPicker().catch(() => setError("Failed to connect to chosen transmitter port"));

  const reconnectBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (reconnectBtn.current) reconnectBtn.current.focus();
  }, [status]);

  if (status === "connected") return null;
  if (rejected) return <ConnectionRejected onUnreject={handleUnreject} />;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute top-0 left-0 z-10 grid h-svh w-svw place-items-center backdrop-blur-xs backdrop-brightness-75"
      >
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-gray-400 p-7">
          <h1 className="text-xl">Please connect your transmitter port.</h1>

          {last && (
            <p className="text-sm text-black/70">
              Last device: VID {last.usbVendorId ?? "?"} / PID {last.usbProductId ?? "?"}
            </p>
          )}

          {last ? (
            <div className="flex w-full flex-col gap-2">
              <button
                ref={reconnectBtn}
                onClick={handleReconnectLast}
                className="cursor-pointer rounded-2xl bg-blue-950 px-4 py-2 text-xl text-white transition-all hover:scale-105 hover:bg-blue-900 active:scale-95"
              >
                Reconnect last
              </button>
              <button
                onClick={handleChoosePort}
                className="cursor-pointer rounded-2xl bg-gray-800 px-4 py-2 text-xl text-white transition-all hover:scale-105 active:scale-95"
              >
                Connect (choose port)
              </button>
            </div>
          ) : (
            <button
              onClick={handleChoosePort}
              className="cursor-pointer rounded-2xl bg-blue-950 px-4 py-2 text-2xl text-white transition-all hover:scale-105 hover:bg-blue-900 active:scale-95"
            >
              Connect
            </button>
          )}

          {error && <p className="text-red-600">{error}</p>}

          <div onClick={handleReject} className="cursor-pointer text-black/50 hover:text-black">
            Close
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ConnectionRejected(props: { onUnreject: () => void }) {
  return (
    <div className="absolute bottom-0 overflow-clip rounded-tr-2xl bg-gray-700/50 p-2 text-center text-white/80 select-none">
      <small className="pointer-events-none">Transmitter port disconnected: </small>
      <small className="cursor-pointer transition-colors hover:text-gray-400" onClick={props.onUnreject}>
        Click to reconnect.
      </small>
    </div>
  );
}