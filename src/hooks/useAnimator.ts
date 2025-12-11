import { MAX_FPS_LIMIT } from "@api/Animator";
import { EffectRepeat, EffectsFrameFunctions } from "@api/Animator/effect";
import { getColorFromGradient } from "@api/Animator/gradient";
import { Message, Pc, transmitter, type CRGB } from "@api/Transmitter";
import { effectStore } from "@store/effectStore";
import { gradientStore } from "@store/gradientStore";
import { optionsStore } from "@store/optionsStore";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useStore } from "zustand";
import { useTransmitter } from "@hooks/useTransmitter";

export default function useAnimator() {
  const { status } = useTransmitter();
  const gradients = useStore(gradientStore, (state) => state.gradients);
  const effects = useStore(effectStore, (state) => state.effects);
  const options = useStore(optionsStore, (state) => state.options);

  const millis = useMemo(
    () => 1 / MAX_FPS_LIMIT[options.rgbFormat][options.multicastChannelsNum],
    [options.rgbFormat, options.multicastChannelsNum],
  );

  const period = 10; // 10 seconds
  const periodStartTimestamp = useRef<number>(0);

  const handleFrame = useCallback(() => {
    const timestamp = Date.now();
    const periodOffset = (timestamp - periodStartTimestamp.current) / (1000 * period); // in [0,1]
    if (periodOffset >= 1) periodStartTimestamp.current = timestamp;

    // TODO: include pushes

    // Get all channels which want to update at this frame (repeat !== 0)

    const queue: { id: Pc.Channel; colors: CRGB[] }[] = [];

    for (let i = 0; i < options.multicastChannelsNum; i++) {
      const effect = effects[i as Pc.Channel];

      // skip if no repeat
      if (effect.repeat === EffectRepeat.NO_REPEAT) continue;

      // compute colors for each LED
      const colors: CRGB[] = [];
      for (let l = 0; l < Pc.NUM_LEDS; l++) {
        const color = getColorFromGradient(gradients[i as Pc.Channel], l / Pc.NUM_LEDS);
        const final = EffectsFrameFunctions[effect.type](l, color, periodOffset);
        colors.push(final);
      }

      // enqueue channel update
      queue.push({ id: i as Pc.Channel, colors });
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
  }, [effects, gradients, options.multicastChannelsNum, options.rgbFormat]);

  useEffect(() => {
    if (status !== "connected") return console.warn("Transmitter not connected");

    const interval = setInterval(handleFrame, 1000 * millis);
    return () => clearInterval(interval);
  }, [handleFrame, millis, status]);
}
