import { MAX_FPS_LIMIT } from "@api/Animator";
import { useTransmitter } from "@hooks/useTransmitter";
import { animeStore } from "@store/animeStore";
import { optionsStore } from "@store/optionsStore";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useStore } from "zustand/react";
import { useShallow } from "zustand/shallow";
import { Player } from "./Player";

let counter = 0;

export default function useAnimator() {
  const { status } = useTransmitter();

  const options = useStore(optionsStore, (state) => state.options);
  const millis = useMemo(() => 1000 / MAX_FPS_LIMIT[options.rgbFormat], [options.rgbFormat]);

  const groups = useStore(
    animeStore,
    useShallow((state) => state.groups),
  );

  useEffect(() => {
    const it = setInterval(() => {
      console.log("FPS:", counter);
      counter = 0;
    }, 1000);

    return () => clearInterval(it);
  }, []);

  const player = useRef<Player>(null);
  const playerSetup = useCallback(() => {
    if (player.current === null) player.current = new Player();
    player.current.setup(groups);
  }, [groups]);

  const playerLoop = useCallback(() => {
    if (player.current === null) return;
    player.current.loop(groups);
    counter++;
  }, [groups]);

  const playerTeardown = useCallback(() => {
    if (player.current === null) return;
    player.current.teardown();
    player.current = null;
  }, []);

  useEffect(() => {
    if (status !== "connected") return;

    playerSetup();
    const it = setInterval(playerLoop, millis);

    return () => {
      clearInterval(it);
      playerTeardown();
    };
  }, [millis, groups, status, playerSetup, playerLoop, playerTeardown]);
}
