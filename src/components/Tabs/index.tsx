import { uiStore, tabs, type Tab } from "@store/uiStore";
import mod from "@utils/mod";
import clsx from "clsx";
import { useCallback, useEffect, useMemo } from "react";
import { useStore } from "zustand";
import ControlTab from "./ControlTab";
import EffectTab from "./EffectTab";
import GradientTab from "./GradientTab";

export default function TabsComponent() {
  const tab = useStore(uiStore, (state) => state.tab);
  const setTab = useStore(uiStore, (state) => state.setTab);

  const TabComponent = useMemo(() => {
    switch (tab) {
      case "control":
        return <ControlTab />;
      case "color":
        return <GradientTab />;
      case "effect":
        return <EffectTab />;
      default:
        return null;
    }
  }, [tab]);

  return (
    <div className="grid h-full grid-rows-[auto_1fr] gap-4 p-4">
      <TabsRadio tab={tab ?? "control"} onChange={setTab} />
      {TabComponent}
    </div>
  );
}

function TabsRadio(props: { tab: Tab; onChange: (tab: Tab) => void }) {
  const handleMove = useCallback(
    (offset: number) => {
      const currentIndex = tabs.indexOf(props.tab);
      const index = mod(currentIndex + offset, tabs.length);
      props.onChange(tabs[index]);
    },
    [props],
  );

  const handleKeyboard = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "[") handleMove(-1);
      if (event.key === "]") handleMove(1);
    },
    [handleMove],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboard);
    return () => {
      document.removeEventListener("keydown", handleKeyboard);
    };
  }, [handleKeyboard]);

  return (
    <div className="grid grid-cols-3 gap-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => props.onChange(tab)}
          className={clsx(
            "corner-bevel grid h-12 w-full min-w-0 place-items-center rounded-tl-lg rounded-br-lg px-2 py-2 outline-0",
            {
              "bg-slate-600 text-white": props.tab !== tab,
              "bg-slate-300 text-black": props.tab === tab,
            },
          )}
        >
          <span className="w-full text-center text-base font-semibold leading-none">
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </span>
        </button>
      ))}
    </div>
  );
}
