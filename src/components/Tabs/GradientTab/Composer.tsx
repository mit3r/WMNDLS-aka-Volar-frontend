import type { Stop } from "@api/Animator/gradient";
import { CRGB, type Pc } from "@api/Transmitter";
import { gradientStore } from "@store/gradientStore";
import { AnimatePresence, motion, Reorder } from "motion/react";
import { useStore } from "zustand";

export default function Composer(props: { channelId: Pc.Channel }) {
  const gradient = useStore(gradientStore, (state) => state.gradients[props.channelId]);
  const setGradient = useStore(gradientStore, (state) => state.setGradient);
  const addGradientStop = useStore(gradientStore, (state) => state.addGradientStop);

  // TODO: Height issue when 'remove' button disappears

  return (
    <div className="gap- flex w-full flex-col items-center gap-4 p-2">
      <h2 className="w-full border-t-2 border-b-2 border-white p-2 text-center text-white">Gradient Stops</h2>

      <Reorder.Group
        className="relative grid aspect-[3] w-full grid-cols-1 grid-rows-3 gap-2"
        axis="y"
        values={gradient}
        onReorder={setGradient}
      >
        <AnimatePresence initial={false}>
          {gradient.length < 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="col-start-1 col-end-1 row-start-3 row-end-3 flex w-fit items-center justify-end place-self-end self-center p-2"
            >
              <motion.button
                className="rounded-2xl border-2 border-white px-8 py-2 text-white"
                onClick={addGradientStop}
              >
                Add
              </motion.button>
            </motion.div>
          )}

          {gradient.map((stop, i) => (
            <StopComponent key={stop.id} index={i} stop={stop} canRemove={gradient.length > 1} />
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  );
}

function StopComponent(props: { index: number; stop: Stop; canRemove?: boolean }) {
  const updateGradientStop = useStore(gradientStore, (state) => state.updateGradientStop);
  const removeGradientStop = useStore(gradientStore, (state) => state.removeGradientStop);
  const handleRemove = () => removeGradientStop(props.stop.id);
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateGradientStop(props.stop.id, CRGB.fromHexString(e.target.value));

  return (
    <Reorder.Item
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      key={props.stop.id}
      value={props.stop}
      className="col-start-1 col-end-1 flex items-center justify-between rounded-2xl border-2 bg-gray-600 p-3"
      dragConstraints={{ top: -50, bottom: 50 }}
      dragElastic={0.1}
      style={{ gridRow: `${props.index + 1} / ${props.index + 2}` }}
    >
      <input
        className="aspect-square h-full"
        type="color"
        name=""
        id=""
        value={props.stop.color.toHexString()}
        onChange={handleColorChange}
      />

      <span className="w-full px-4 text-white">{props.stop.color.toHexString()}</span>

      <AnimatePresence initial={false}>
        {props.canRemove !== false && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="rounded-2xl border-2 px-4 py-2 text-white"
            onClick={handleRemove}
          >
            Remove
          </motion.button>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
}
