import { CRGB, Pc } from "@api/Transmitter";
import { EFFECTS } from "../../types/effects";
import { getColorFromGradient } from "../../types/gradients";
import type { Group } from "../../types/groups";
import type { Player } from "../Player";
import type { TransmitQueueItem } from "./transmitQueue";

/**
 * Handles updating the visual and preparing transmit queue item.
 * @param group Group containing the visual to update
 * @param deltaTime Elapsed time since last frame in milliseconds
 * @returns Transmit queue item for the visual update
 */
export default function renderFrame(this: Player, group: Group): TransmitQueueItem | null {
  const tl = this.timelines[group.id];

  // Merge active visuals
  const visualColors: CRGB[][] = [];

  for (let i = 0; i < tl.items.length; i++) {
    const { gradient, effect } = group.visuals[i];
    const item = tl.items[i];
    if (tl.elapsed < item.start || tl.elapsed > item.end) continue;

    visualColors.push(CRGB.createArray(Pc.NUM_LEDS, new CRGB(0, 0, 0)));

    const percent = (tl.elapsed - item.start) / (item.end - item.start);

    for (let ledIndex = 0; ledIndex < Pc.NUM_LEDS; ledIndex++) {
      let color: CRGB;
      const led = ledIndex / Pc.NUM_LEDS;
      color = getColorFromGradient(led, gradient);
      color = CRGB.multiply(color, EFFECTS[effect].get(led, percent));
      visualColors[visualColors.length - 1][ledIndex] = color;
    }
  }

  // Blend colors from active visuals
  const colors = blendModeOverlay(visualColors);

  return { channelId: group.channelId, colors: colors };
}

function blendModeOverlay(colors: CRGB[][]): CRGB[] {
  const blendedColors: CRGB[] = CRGB.createArray(Pc.NUM_LEDS, new CRGB(0, 0, 0));

  for (let ledIndex = 0; ledIndex < Pc.NUM_LEDS; ledIndex++) {
    let r = 0;
    let g = 0;
    let b = 0;
    for (let visualIndex = 0; visualIndex < colors.length; visualIndex++) {
      r += colors[visualIndex][ledIndex].r;
      g += colors[visualIndex][ledIndex].g;
      b += colors[visualIndex][ledIndex].b;
    }
    blendedColors[ledIndex] = new CRGB(r, g, b);
  }

  return blendedColors;
}

// function blendModeMultiply(colors: CRGB[][]): CRGB[] {
//   const blendedColors: CRGB[] = CRGB.createArray(Pc.NUM_LEDS, new CRGB(255, 255, 255));
//   for (let ledIndex = 0; ledIndex < Pc.NUM_LEDS; ledIndex++) {
//     let r = 255;
//     let g = 255;
//     let b = 255;
//     for (let visualIndex = 0; visualIndex < colors.length; visualIndex++) {
//       r = (r * colors[visualIndex][ledIndex].r) / 255;
//       g = (g * colors[visualIndex][ledIndex].g) / 255;
//       b = (b * colors[visualIndex][ledIndex].b) / 255;
//     }
//     blendedColors[ledIndex] = new CRGB(r, g, b);
//   }

//   return blendedColors;
// }
