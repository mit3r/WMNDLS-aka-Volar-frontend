import Message from "./Message";

export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";
export type TransmitterListener = (status: ConnectionStatus) => void;

class Transmitter {
  private port: SerialPort | null = null;
  private writer: WritableStreamDefaultWriter | null = null;
  private reader: ReadableStreamDefaultReader | null = null;
  private status: ConnectionStatus = "disconnected";
  private listeners: TransmitterListener[] = [];

  // Singleton instance
  private static instance: Transmitter;

  private constructor() {}

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
            console.log("Received:", line.replace(/\r$/, ""));
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
      this.port = await navigator.serial.requestPort();

      await this.port.open({ baudRate });

      const writable = this.port.writable;
      if (!writable) throw new Error("Port not writable");

      this.writer = writable.getWriter();

      if (this.port.readable) {
        this.reader = this.port.readable.getReader();
        this.readLoop();
      }

      this.setStatus("connected");

      // Handle disconnection from the device side (e.g. unplugged)
      this.port.addEventListener("disconnect", () => {
        this.disconnect();
      });
    } catch (error) {
      console.error("Failed to connect:", error);
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
