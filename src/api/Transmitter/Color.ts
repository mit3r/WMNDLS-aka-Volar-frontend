export class CRGB {
  constructor(public red: number = 0, public green: number = 0, public blue: number = 0) {}

  get RGB24(): Uint8Array {
    return new Uint8Array([this.red, this.green, this.blue]);
  }

  get RGB16(): Uint8Array {
    const r = (this.red >> 3) & 0x1f;
    const g = (this.green >> 2) & 0x3f;
    const b = (this.blue >> 3) & 0x1f;
    const value = (r << 11) | (g << 5) | b;
    return new Uint8Array([value & 0xff, value >> 8]);
  }

  get RGB8(): Uint8Array {
    const r = (this.red >> 5) & 0x07;
    const g = (this.green >> 5) & 0x07;
    const b = (this.blue >> 6) & 0x03;
    return new Uint8Array([(r << 5) | (g << 2) | b]);
  }

  toBytes(n: 1 | 2 | 3): Uint8Array {
    if (n === 3) return this.RGB24;
    if (n === 2) return this.RGB16;
    return this.RGB8;
  }

  toHexString(): string {
    const r = this.red.toString(16).padStart(2, "0");
    const g = this.green.toString(16).padStart(2, "0");
    const b = this.blue.toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  }
  static fromHexString(str: string): CRGB {
    const hex = str.split(/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/).slice(1, -1);
    if (hex.length !== 3) throw new Error("Invalid hex color string");

    return new CRGB(...hex.map((c) => parseInt(c, 16)));
  }
}
