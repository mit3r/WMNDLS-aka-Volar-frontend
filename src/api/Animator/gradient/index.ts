import { CRGB } from "@api/Transmitter";

export type Stop = {
  id: number;
  color: CRGB;
};

export type Gradient = Stop[];

/**
 *
 * @param gradient list of color stops
 * @param offset position from 0 to 1
 */
export function getColorFromGradient(gradient: Gradient, offset: number): CRGB {
  if (gradient.length === 0) throw new Error("Gradient has no stops");

  if (gradient.length === 1) return gradient[0].color;

  if (offset <= 0) return gradient[0].color;
  if (offset >= 1) return gradient[gradient.length - 1].color;

  const scaledPosition = offset * (gradient.length - 1);
  const index = Math.floor(scaledPosition);
  const t = scaledPosition - index;

  const startColor = gradient[index].color;
  const endColor = gradient[index + 1].color;

  return new CRGB(
    Math.round(startColor.red + (endColor.red - startColor.red) * t),
    Math.round(startColor.green + (endColor.green - startColor.green) * t),
    Math.round(startColor.blue + (endColor.blue - startColor.blue) * t),
  );
}
