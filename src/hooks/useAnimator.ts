import { MAX_FPS_LIMIT } from "@api/Animator";
import { effectsInstances } from "@api/Animator/effect";
import { getColorFromGradient } from "@api/Animator/gradient";
import { CRGB, Message, Pc, transmitter } from "@api/Transmitter";
import { useTransmitter } from "@hooks/useTransmitter";
import { optionsStore } from "@store/optionsStore";
import { visualStore, type Visual } from "@store/visualStore";
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
  const options = useStore(optionsStore, (state) => state.options);

  const millis = useMemo(
    () => 1 / MAX_FPS_LIMIT[options.rgbFormat][options.multicastChannelsNum],
    [options.rgbFormat, options.multicastChannelsNum],
  );

  const lastFrameTimestamp = useRef<number>(0);

  const handleFrame = useCallback(() => {
    const elapsedTime = (Date.now() - lastFrameTimestamp.current) / 1000;
    lastFrameTimestamp.current = Date.now();


    const channelsToVisuals = new Map<Pc.Channel, Visual[]>();
    for (let channelId = 0; channelId < options.multicastChannelsNum; channelId++) 
      channelsToVisuals.set(channelId as Pc.Channel, []);
    
    for (const visual of visuals) {
      if (!channelsToVisuals.has(visual.channelId)) continue;
      channelsToVisuals.get(visual.channelId)!.push(visual);
    }

    const queue: { id: Pc.Channel; colors: CRGB[] }[] = [];

    for (const [channelId, visuals] of channelsToVisuals) {

      for (const visual of visuals) {
        const effectConfig = visual.effect;
        const effect = effectsInstances[effectConfig.type];
        const colors: CRGBSum[] = Array(Pc.NUM_LEDS).fill(null).map(() => ({
          r_sum: 0,
          g_sum: 0,
          b_sum: 0,
          count: 0,
        }));

        visualStore.getState().moveProgress(visual.id, elapsedTime / effect.basePeriod);

        // for each progress instance
        for (const progress of visualStore.getState().visuals[visual.id].progresses) {
          // generate colors for all LEDs
          for (let ledIndex = 0; ledIndex < Pc.NUM_LEDS; ledIndex++) {
            const ledOffset = ledIndex / Pc.NUM_LEDS;
            let color = getColorFromGradient(ledOffset, visual.gradient);
            color = effect.requestFrame(ledOffset, color, progress);

            colors[ledIndex].r_sum += color.r;
            colors[ledIndex].g_sum += color.g;
            colors[ledIndex].b_sum += color.b;
            colors[ledIndex].count += 1;
          }
        }

        // enqueue channel update
        queue.push({ id: channelId, colors: colors.map(c => new CRGB(
          c.r_sum / c.count,
          c.g_sum / c.count,
          c.b_sum / c.count,
        ))
        });        
      }

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
    }
  }, [options.multicastChannelsNum, options.rgbFormat, visuals]);

  useEffect(() => {
    if (status !== "connected") return console.warn("Transmitter not connected");

    // console.log("Animator started");

    const interval = setInterval(handleFrame, 1000 * millis);
    return () => clearInterval(interval);
  }, [handleFrame, millis, status]);
}
