import { MAX_FPS_LIMIT } from "@api/Animator";
import { effectsInstances } from "@api/Animator/effect";
import { getColorFromGradient } from "@api/Animator/gradient";
import { CRGB, Message, Pc, transmitter } from "@api/Transmitter";
import { useTransmitter } from "@hooks/useTransmitter";
import { effectStore } from "@store/effectStore";
import { gradientStore } from "@store/gradientStore";
import { optionsStore } from "@store/optionsStore";
import { progressStore } from "@store/progressStore";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useStore } from "zustand";

export default function useAnimator() {
  const { status } = useTransmitter();
  const gradients = useStore(gradientStore, (state) => state.gradients);
  const effectsConfigs = useStore(effectStore, (state) => state.configs);
  const options = useStore(optionsStore, (state) => state.options);

  const millis = useMemo(
    () => 1 / MAX_FPS_LIMIT[options.rgbFormat][options.multicastChannelsNum],
    [options.rgbFormat, options.multicastChannelsNum],
  );

  const lastFrameTimestamp = useRef<number>(0);

  const handleFrame = useCallback(() => {
    const timestamp = Date.now();
    const elapsedTime = (timestamp - lastFrameTimestamp.current) / 1000; // in seconds
    lastFrameTimestamp.current = timestamp;

    const queue: { id: Pc.Channel; colors: CRGB[] }[] = [];

    for (let channelId = 0; channelId < options.multicastChannelsNum; channelId++) {
      const effectConfig = effectsConfigs[channelId as Pc.Channel];
      const effect = effectsInstances[effectConfig.type];
      const colors: CRGB[] = [...new Array<CRGB>(Pc.NUM_LEDS).fill(new CRGB(0, 0, 0))];

      progressStore.getState().moveProgress(channelId as Pc.Channel, elapsedTime / effect.basePeriod);

      // for each instance
      for (const progress of progressStore.getState().progresses[channelId as Pc.Channel]) {
        // generate colors for all LEDs
        for (let ledIndex = 0; ledIndex < Pc.NUM_LEDS; ledIndex++) {
          const ledOffset = ledIndex / Pc.NUM_LEDS;

          let color = getColorFromGradient(ledOffset, gradients[channelId as Pc.Channel]);
          color = effect.requestFrame(ledOffset, color, progress);

          colors[ledIndex] = CRGB.blend(colors[ledIndex], color)
        }
      }
        // enqueue channel update
        queue.push({ id: channelId as Pc.Channel, colors });
    }

    // transmit all updates
    while (queue.length > 0) {
      const msg = new Message();
      msg.bType = options.rgbFormat;

      // fill message with as many channels as possible
      const howMuchToSend = Math.min(queue.length, Pc.PayloadMaxChannels[options.rgbFormat]);
      for (let i = 0; i < howMuchToSend; i++) {
        const { id, colors } = queue.pop()!;
        msg.setColorChannel(id, colors);
      }

      transmitter.sendMessage(msg);
    }
  }, [effectsConfigs, gradients, options.multicastChannelsNum, options.rgbFormat]);

  useEffect(() => {
    if (status !== "connected") return console.warn("Transmitter not connected");

    const interval = setInterval(handleFrame, 1000 * millis);
    return () => clearInterval(interval);
  }, [handleFrame, millis, status]);
}
