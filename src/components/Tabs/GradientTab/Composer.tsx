import type { Stop } from "@hooks/useAnimator/types/gradients";
import { CRGB } from "@api/Transmitter";
import { AnimatePresence, motion, Reorder } from "motion/react";
import { useStore } from "zustand";
import { animeStore } from "@store/animeStore";
import { useShallow } from "zustand/shallow";
import { uiStore } from "@store/uiStore";
import { PRESET_COLORS_HEX } from "@utils/colors";
import { useMemo, useState, type ChangeEvent } from "react";

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
  const updateGradientStop = useStore(animeStore, (state) => state.updateGradientStop);

  const recentColors = useStore(uiStore, (state) => state.recentColors);
  const pushRecentColor = useStore(uiStore, (state) => state.pushRecentColor);

  const [activeStopId, setActiveStopId] = useState<number | null>(null);

  const effectiveActiveStopId = useMemo(() => {
    if (gradient.length === 0) return null;
    if (activeStopId !== null && gradient.some((s) => s.id === activeStopId)) return activeStopId;
    return gradient[0].id;
  }, [gradient, activeStopId]);

  const activeStop = useMemo(
    () => (effectiveActiveStopId === null ? undefined : gradient.find((s) => s.id === effectiveActiveStopId)),
    [gradient, effectiveActiveStopId],
  );

  const setStopColor = (stopId: number, hex: string) => {
    try {
      updateGradientStop(stopId, CRGB.fromHexString(hex));
    } catch {
      // Ignore invalid color values to avoid crashing the UI.
    }
  };

  const commitRecentColor = (hex: string) => {
    try {
      pushRecentColor(hex);
    } catch {
      // ignore
    }
  };

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
            <StopRow
              key={stop.id}
              index={i}
              stop={stop}
              active={stop.id === effectiveActiveStopId}
              onSelect={() => setActiveStopId(stop.id)}
              canRemove={gradient.length > 1}
            />
          ))}
        </AnimatePresence>
      </Reorder.Group>

      <div className="w-full rounded-2xl border-2 bg-gray-600 p-3">
        <div className="flex items-center justify-between">
          <span className="select-none text-white">Edit stop</span>
          <span className="select-none text-xs text-white/80">Max 3 stops</span>
        </div>

        {activeStop ? (
          <div className="mt-3 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div
                className="relative h-10 w-10 rounded-lg p-[2px]"
                style={{
                  backgroundImage:
                    "conic-gradient(from 180deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
                }}
              >
                <input
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  type="color"
                  value={activeStop.color.toHexString()}
                  onInput={(e: ChangeEvent<HTMLInputElement>) => setStopColor(activeStop.id, e.target.value)}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => commitRecentColor(e.target.value)}
                  aria-label="Pick color"
                />
                <div
                  className="h-full w-full rounded-md border-2 border-white/30"
                  style={{ backgroundColor: activeStop.color.toHexString() }}
                />
              </div>
              <span className="select-text font-mono text-white">{activeStop.color.toHexString()}</span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm text-white/80">Preset</span>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_COLORS_HEX.slice(0, 8).map((hex) => (
                  <Swatch
                    key={hex}
                    hex={hex}
                    active={hex === activeStop.color.toHexString()}
                    onPick={(picked) => {
                      setStopColor(activeStop.id, picked);
                      commitRecentColor(picked);
                    }}
                    label="Preset color"
                  />
                ))}
              </div>
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
                      key={`recent-${hex}-${i}`}
                      hex={hex}
                      active={hex === activeStop.color.toHexString()}
                      onPick={(picked) => {
                        setStopColor(activeStop.id, picked);
                        commitRecentColor(picked);
                      }}
                      label="Recent color"
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <span className="mt-3 block text-sm text-white/80">No stop selected.</span>
        )}
      </div>
    </div>
  );
}

function StopRow(props: {
  index: number;
  stop: Stop;
  active: boolean;
  onSelect: () => void;
  canRemove?: boolean;
}) {
  const removeGradientStop = useStore(animeStore, (state) => state.removeGradientStop);

  const handleRemove = () => removeGradientStop(props.stop.id);

  return (
    <Reorder.Item
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      key={props.stop.id}
      value={props.stop}
      className={
        "col-start-1 col-end-1 flex cursor-pointer items-center justify-between rounded-2xl border-2 bg-gray-600 p-3 " +
        (props.active ? "ring-2 ring-white" : "")
      }
      dragConstraints={{ top: -50, bottom: 50 }}
      dragElastic={0.1}
      style={{ gridRow: `${props.index + 1} / ${props.index + 2}` }}
      onPointerDown={() => props.onSelect()}
    >
      <div className="flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-lg border-2 border-white/30"
          style={{ backgroundColor: props.stop.color.toHexString() }}
          aria-label="Stop color preview"
        />

        <div className="flex flex-col">
          <span className="select-none text-xs text-white/70">Stop {props.index + 1}</span>
          <span className="select-text font-mono text-white">{props.stop.color.toHexString()}</span>
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
      onClick={() => props.onPick(props.hex)}
      aria-label={`${props.label}: ${props.hex}`}
      title={props.hex}
    />
  );
}
