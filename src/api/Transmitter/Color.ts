export class CRGB {
  private limit(value: number): number {
    return Math.max(0, Math.min(255, Math.round(value)));
  }

  private _red: number = 0;
  private _green: number = 0;
  private _blue: number = 0;

  constructor(r: number = 0, g: number = 0, b: number = 0) {
    this.red = this.limit(r);
    this.green = this.limit(g);
    this.blue = this.limit(b);
  }

  set red(value: number) {
    this._red = this.limit(value);
  }

  set green(value: number) {
    this._green = this.limit(value);
  }

  set blue(value: number) {
    this._blue = this.limit(value);
  }

  get red(): number {
    return this._red;
  }

  get green(): number {
    return this._green;
  }

  get blue(): number {
    return this._blue;
  }

  set r(value: number) {
    this.red = value;
  }

  set g(value: number) {
    this.green = value;
  }

  set b(value: number) {
    this.blue = value;
  }

  get r(): number {
    return this._red;
  }

  get g(): number {
    return this._green;
  }

  get b(): number {
    return this._blue;
  }

  get RGB24(): Uint8Array {
    return new Uint8Array([this._red, this._green, this._blue]);
  }

  get RGB16(): Uint8Array {
    const r = (this._red >> 3) & 0x1f;
    const g = (this._green >> 2) & 0x3f;
    const b = (this._blue >> 3) & 0x1f;
    const value = (r << 11) | (g << 5) | b;
    return new Uint8Array([value & 0xff, value >> 8]);
  }

  get RGB8(): Uint8Array {
    const r = (this._red >> 5) & 0x07;
    const g = (this._green >> 5) & 0x07;
    const b = (this._blue >> 6) & 0x03;
    return new Uint8Array([(r << 5) | (g << 2) | b]);
  }

  toBytes(n: 1 | 2 | 3): Uint8Array {
    if (n === 3) return this.RGB24;
    if (n === 2) return this.RGB16;
    return this.RGB8;
  }

  toHexString(): string {
    const r = this._red.toString(16).padStart(2, "0");
    const g = this._green.toString(16).padStart(2, "0");
    const b = this._blue.toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  }
  static fromHexString(str: string): CRGB {
    const hex = str.split(/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/).slice(1, -1);
    if (hex.length !== 3) throw new Error("Invalid hex color string");

    return new CRGB(...hex.map((c) => parseInt(c, 16)));
  }

  static blend(a: CRGB, b: CRGB): CRGB {
    return new CRGB((a.red + b.red) >> 1, (a.green + b.green) >> 1, (a.blue + b.blue) >> 1);
  }

  static createArray(length: number, fill?: CRGB): CRGB[] {
    return Array(length)
      .fill(null)
      .map(() => (fill ? new CRGB(fill.r, fill.g, fill.b) : new CRGB()));
  }
}
