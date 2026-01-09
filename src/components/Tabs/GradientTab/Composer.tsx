import type { Stop } from "@hooks/useAnimator/types/gradients";
import { CRGB } from "@api/Transmitter";
import { AnimatePresence, motion, Reorder } from "motion/react";
import { useStore } from "zustand";
import { animeStore } from "@store/animeStore";
import { useShallow } from "zustand/shallow";
import { uiStore } from "@store/uiStore";
import { PRESET_COLORS_HEX } from "@utils/colors";

export default function Composer(props: { visualId: number }) {
  const gradient = useStore(
    animeStore,
    useShallow((state) => {
      const group = state.groups.findIndex((g) => g.id === state.editableGroupId);
      if (group === -1) return [];
      const visual = state.groups[group].visuals.find((v) => v.id === props.visualId);
      if (!visual) return [];
      return visual.gradient;
    }),
  );

  const setGradient = useStore(animeStore, (state) => state.setGradient);
  const addGradientStop = useStore(animeStore, (state) => state.addGradientStop);

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
  const updateGradientStop = useStore(animeStore, (state) => state.updateGradientStop);
  const removeGradientStop = useStore(animeStore, (state) => state.removeGradientStop);
  const recentColors = useStore(uiStore, (state) => state.recentColors);
  const pushRecentColor = useStore(uiStore, (state) => state.pushRecentColor);

  const handleRemove = () => removeGradientStop(props.stop.id);
  const setStopColor = (hex: string) => {
    try {
      updateGradientStop(props.stop.id, CRGB.fromHexString(hex));
      pushRecentColor(hex);
    } catch {
      // Ignore invalid color values to avoid crashing the UI.
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => setStopColor(e.target.value);

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
      <div className="flex items-center gap-3">
        <input
          className="aspect-square h-10 w-10"
          type="color"
          value={props.stop.color.toHexString()}
          onChange={handleColorChange}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Pick color"
        />

        <div className="flex flex-col gap-2">
          <span className="select-text font-mono text-white">{props.stop.color.toHexString()}</span>

          <div className="grid grid-cols-4 gap-2">
            {PRESET_COLORS_HEX.map((hex) => (
              <Swatch
                key={hex}
                hex={hex}
                active={hex === props.stop.color.toHexString()}
                onPick={setStopColor}
                label="Preset color"
              />
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm text-white/80">Recent</span>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => {
                const hex = recentColors[i];
                if (!hex) {
                  return <div key={`recent-empty-${i}`} className="h-8 w-8 rounded-md border-2 border-white/20" />;
                }

                return (
                  <Swatch
                    key={`recent-${hex}`}
                    hex={hex}
                    active={hex === props.stop.color.toHexString()}
                    onPick={setStopColor}
                    label="Recent color"
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {props.canRemove !== false ? (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="grid h-10 w-10 place-items-center rounded-xl border-2 text-2xl leading-none text-white"
            onClick={handleRemove}
            aria-label="Remove gradient stop"
            title="Remove"
          >
            ×
          </motion.button>
        ) : (
          <div className="h-10 w-10" />
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
}

function Swatch(props: {
  hex: string;
  active: boolean;
  onPick: (hex: string) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      className={
        "h-8 w-8 rounded-md border-2 border-white focus:outline-none focus:ring-2 focus:ring-white " +
        (props.active ? "ring-2 ring-white" : "")
      }
      style={{ backgroundColor: props.hex }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        props.onPick(props.hex);
      }}
      aria-label={`${props.label}: ${props.hex}`}
      title={props.hex}
    />
  );
}
