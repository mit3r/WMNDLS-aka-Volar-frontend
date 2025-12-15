import { MAX_FPS_LIMIT } from "@api/Animator";
import { effectsInstances } from "@api/Animator/effect";
import { getColorFromGradient } from "@api/Animator/gradient";
import { CRGB, Message, Pc, transmitter } from "@api/Transmitter";
import { useTransmitter } from "@hooks/useTransmitter";
import { optionsStore } from "@store/optionsStore";
import { visualStore } from "@store/visualStore";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useStore } from "zustand";

type CRGBSum = {
  r_sum: number;
  g_sum: number;
  b_sum: number;
  count: number;
}

export default function useAnimator() {
  const { status } = useTransmitter();

  const visuals = useStore(visualStore, (state) => state.visuals);
  const channels = useStore(visualStore, (state) => state.channels);
  const gradients = useStore(visualStore, (state) => state.gradients);
  const effects = useStore(visualStore, (state) => state.effects);

  const setEffectsRepeat = useStore(visualStore, (state) => state.setEffectRepeat);  

  const options = useStore(optionsStore, (state) => state.options);

  const millis = useMemo(
    () => 1 / MAX_FPS_LIMIT[options.rgbFormat][options.multicastChannelsNum],
    [options.rgbFormat, options.multicastChannelsNum],
  );

  const lastFrameTimestamp = useRef<number>(0);

  const handleFrame = useCallback(() => {
    const elapsedTime = (Date.now() - lastFrameTimestamp.current) / 1000;
    lastFrameTimestamp.current = Date.now();

    const channelsToVisuals = new Map<Pc.Channel, number[]>();
    for (const channelId of Object.values(channels)) 
      channelsToVisuals.set(channelId as Pc.Channel, []);
    
    for (const visual of visuals) {
      if (!channelsToVisuals.has(channels[visual])) continue;
      channelsToVisuals.get(channels[visual])!.push(visual);
    }

    const queue: { id: Pc.Channel, colors: CRGB[] }[] = [];

    for (const [channelId, visuals] of channelsToVisuals) {
      const colors: CRGBSum[] = Array(Pc.NUM_LEDS).fill(null).map(() => ({
          r_sum: 0,
          g_sum: 0,
          b_sum: 0,
          count: 0,
      }));

      for (const visualId of visuals) {
        const effect = effectsInstances[effects[visualId].type];

        // TODO: handle repeat changes
        // if (effects[visualId].repeat === EffectRepeat.NO_REPEAT)
        //   setEffectsRepeat(EffectRepeat.NO_REPEAT);

        visualStore.getState().moveProgress(visualId, elapsedTime / effect.basePeriod);

        // for each progress instance
        for (const progress of visualStore.getState().progresses[visualId]) {
          // generate colors for all LEDs
          for (let ledIndex = 0; ledIndex < Pc.NUM_LEDS; ledIndex++) {
            const ledOffset = ledIndex / Pc.NUM_LEDS;

            let color = getColorFromGradient(ledOffset, gradients[visualId]);
            color = effect.requestFrame(ledOffset, color, progress);

            colors[ledIndex].r_sum += color.r;
            colors[ledIndex].g_sum += color.g;
            colors[ledIndex].b_sum += color.b;
            colors[ledIndex].count += 1;
          }
        }
      }

      // enqueue channel update
      queue.push({ id: channelId, colors: colors.map(c => new CRGB(
        c.r_sum / c.count,
        c.g_sum / c.count,
        c.b_sum / c.count,
      ))});

      while (queue.length > 0) {
        const msg = new Message();
        msg.bType = options.rgbFormat;

        // fill message with as many channels as possible
        const howMuchToSend = Math.min(queue.length, Pc.PayloadMaxChannels[options.rgbFormat]);

        for (let i = 0; i < howMuchToSend; i++) {
          const { id, colors } = queue.pop()!;
          msg.setColorChannel(id, colors);
          console.log("Sending animator frame to ", id);
        }

        transmitter.sendMessage(msg);
      }
    }
  }, [channels, effects, gradients, options.rgbFormat, setEffectsRepeat, visuals]);

  useEffect(() => {
    if (status !== "connected") return console.warn("Transmitter not connected");

    // console.log("Animator started");

    const interval = setInterval(handleFrame, 1000 * millis);
    return () => clearInterval(interval);
  }, [handleFrame, millis, status]);
}
