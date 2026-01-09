import Message from "./Message";

export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";
export type TransmitterListener = (status: ConnectionStatus) => void;

type LastPortInfo = {
  usbVendorId?: number;
  usbProductId?: number;
  baudRate: number;
  savedAt: number;
};

const LAST_PORT_STORAGE_KEY = "volar:lastSerialPort";

class Transmitter {
  private order: number = 1;
  private port: SerialPort | null = null;
  private writer: WritableStreamDefaultWriter | null = null;
  private reader: ReadableStreamDefaultReader | null = null;
  private status: ConnectionStatus = "disconnected";
  private listeners: TransmitterListener[] = [];

  // Singleton instance
  private static instance: Transmitter;

  private constructor(private debug: boolean = false) {}

  private readLastPortInfo(): LastPortInfo | null {
    try {
      const raw = localStorage.getItem(LAST_PORT_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as LastPortInfo;
      if (!parsed || typeof parsed !== "object") return null;
      if (typeof parsed.baudRate !== "number") return null;
      return parsed;
    } catch {
      return null;
    }
  }

  private saveLastPortInfo(port: SerialPort, baudRate: number) {
    try {
      const info = (port as unknown as { getInfo?: () => { usbVendorId?: number; usbProductId?: number } }).getInfo?.();
      const payload: LastPortInfo = {
        usbVendorId: info?.usbVendorId,
        usbProductId: info?.usbProductId,
        baudRate,
        savedAt: Date.now(),
      };
      localStorage.setItem(LAST_PORT_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage errors
    }
  }

  public getLastPortInfo(): LastPortInfo | null {
    return this.readLastPortInfo();
  }

  private async connectPort(port: SerialPort, baudRate: number) {
    this.port = port;
    await this.port.open({ baudRate });

    const writable = this.port.writable;
    if (!writable) throw new Error("Port not writable");
    this.writer = writable.getWriter();

    if (this.port.readable) {
      this.reader = this.port.readable.getReader();
      this.readLoop();
    }

    this.setStatus("connected");
    this.saveLastPortInfo(this.port, baudRate);

    // Handle disconnection from the device side (e.g. unplugged)
    this.port.addEventListener("disconnect", () => {
      this.disconnect();
    });
  }

  private async tryConnectLastPort(baudRate: number): Promise<boolean> {
    const last = this.readLastPortInfo();
    if (!last) return false;
    if (!last.usbVendorId || !last.usbProductId) return false;

    try {
      const ports = await navigator.serial.getPorts();
      const match = ports.find((p) => {
        const info = (p as unknown as { getInfo?: () => { usbVendorId?: number; usbProductId?: number } }).getInfo?.();
        return info?.usbVendorId === last.usbVendorId && info?.usbProductId === last.usbProductId;
      });

      if (!match) return false;
      await this.connectPort(match, baudRate);
      return true;
    } catch (e) {
      if (this.debug) console.warn("Failed to connect last port", e);
      return false;
    }
  }

  public static getInstance(): Transmitter {
    if (!Transmitter.instance) {
      Transmitter.instance = new Transmitter();
    }
    return Transmitter.instance;
  }

  public getStatus(): ConnectionStatus {
    return this.status;
  }

  public subscribe(listener: TransmitterListener): () => void {
    this.listeners.push(listener);
    listener(this.status); // Initial call
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private setStatus(status: ConnectionStatus) {
    this.status = status;
    this.listeners.forEach((l) => l(status));
  }

  private async readLoop() {
    if (!this.reader) return;
    const decoder = new TextDecoder();
    let buffer = "";
    try {
      while (true) {
        const { value, done } = await this.reader.read();
        if (done) break;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            if (this.debug) console.log("Received:", line.replace(/\r$/, ""));
          }
        }
      }
    } catch (e) {
      console.error("Read loop error", e);
    }
  }

  public async connect(baudRate: number = 115200) {
    if (this.status === "connected") return;

    if (!("serial" in navigator)) {
      console.error("Web Serial API not supported in this browser.");
      this.setStatus("error");
      return;
    }

    try {
      this.setStatus("connecting");
      const connectedLast = await this.tryConnectLastPort(baudRate);
      if (!connectedLast) {
        const picked = await navigator.serial.requestPort();
        await this.connectPort(picked, baudRate);
      }
    } catch (error) {
      console.error("Failed to connect:", error);
      this.setStatus("error");
    }
  }

  public async connectWithPicker(baudRate: number = 115200) {
    if (this.status === "connected") return;

    if (!("serial" in navigator)) {
      console.error("Web Serial API not supported in this browser.");
      this.setStatus("error");
      return;
    }

    try {
      this.setStatus("connecting");
      const picked = await navigator.serial.requestPort();
      await this.connectPort(picked, baudRate);
    } catch (error) {
      console.error("Failed to connect (picker):", error);
      this.setStatus("error");
    }
  }

  public async disconnect() {
    if (this.reader) {
      try {
        await this.reader.cancel();
        await this.reader.releaseLock();
      } catch (e) {
        console.error("Error releasing reader lock", e);
      }
      this.reader = null;
    }

    if (this.writer) {
      try {
        await this.writer.releaseLock();
      } catch (e) {
        console.error("Error releasing lock", e);
      }
      this.writer = null;
    }

    if (this.port) {
      try {
        await this.port.close();
      } catch (e) {
        console.error("Error closing port", e);
      }
      this.port = null;
    }
    this.setStatus("disconnected");
  }

  public async sendMessage(msg: Message) {
    if (this.status !== "connected" || !this.writer) {
      console.warn("Transmitter not connected");
      return;
    }

    try {
      msg.bOrder = this.order++;
      const { buffer } = msg.getBinary();
      await this.writer.write(buffer);
    } catch (error) {
      console.error("Failed to send message:", error);
      // Optionally transition to error state if write fails repeatedly
    }
  }
}

export const transmitter = Transmitter.getInstance();
export default Transmitter;
