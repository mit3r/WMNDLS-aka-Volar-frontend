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

  multiplyBy(factor: number): void {
    this._red = this.limit(this._red * factor);
    this._green = this.limit(this._green * factor);
    this._blue = this.limit(this._blue * factor);
  }

  get RGB16(): Uint8Array {
    const r = (this._red >> 3) & 0x1f; // 5 bitów
    const g = (this._green >> 2) & 0x3f; // 6 bitów
    const b = (this._blue >> 3) & 0x1f; // 5 bitów
    const value = (b << 11) | (g << 5) | r;

    return new Uint8Array([value & 0xff, value >> 8]);
  }

  get RGB8(): Uint8Array {
    const r = (this._red >> 5) & 0x07; // 3 bity
    const g = (this._green >> 5) & 0x07; // 3 bity
    const b = (this._blue >> 6) & 0x03; // 2 bity
    return new Uint8Array([(b << 6) | (g << 3) | r]);
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

  static multiply(color: CRGB, factor: number): CRGB {
    return new CRGB(color.red * factor, color.green * factor, color.blue * factor);
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
