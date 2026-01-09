import { transmitter } from "@api/Transmitter";
import { AnimatePresence, motion } from "motion/react";
import { useState, useSyncExternalStore } from "react";

export default function PortModal() {
  const [error, setError] = useState<string | null>(null);

  const last = transmitter.getLastPortInfo();

  const status = useSyncExternalStore(transmitter.subscribe.bind(transmitter), transmitter.getStatus.bind(transmitter));

  const handleReconnectLast = async () =>
    transmitter.connect().catch(() => setError("Failed to connect to last transmitter device"));

  const handleChoosePort = async () =>
    transmitter.connectWithPicker().catch(() => setError("Failed to connect to chosen transmitter port"));

  if (status === "connected") {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute z-10 w-svw h-svh grid place-items-center top-0 left-0 backdrop-blur-xs backdrop-brightness-75"
      >
        <div className="flex flex-col items-center gap-4 p-7 rounded-2xl bg-gray-400">
          <h1 className="text-xl">Please connect your transmitter port.</h1>

          {last && (
            <p className="text-sm text-black/70">
              Last device: VID {last.usbVendorId ?? "?"} / PID {last.usbProductId ?? "?"}
            </p>
          )}

          {last ? (
            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={handleReconnectLast}
                className="px-4 py-2 rounded-2xl bg-blue-950 text-xl text-white cursor-pointer hover:scale-105 hover:bg-blue-900 transition-all active:scale-95"
              >
                Reconnect last
              </button>
              <button
                onClick={handleChoosePort}
                className="px-4 py-2 rounded-2xl bg-gray-800 text-xl text-white cursor-pointer hover:scale-105 transition-all active:scale-95"
              >
                Connect (choose port)
              </button>
            </div>
          ) : (
            <button
              onClick={handleChoosePort}
              className="px-4 py-2 rounded-2xl bg-blue-950 text-2xl text-white cursor-pointer hover:scale-105 hover:bg-blue-900 transition-all active:scale-95"
            >
              Connect
            </button>
          )}

          {error && <p className="text-red-600">{error}</p>}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
