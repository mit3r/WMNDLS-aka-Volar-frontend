import type Message from "./Message";
import { HeaderOffsets, HeaderSize } from "./Protocol";

function printBytes(
  bytes: Uint8Array,
  format: "bin" | "hex" = "hex",
  reverse: boolean = true,
  size: boolean = true
): string {
  let output = "";
  if (reverse) bytes = bytes.reverse();
  for (let i = 0; i < bytes.length; i++) {
    if (format === "bin") output += "0b" + bytes[i].toString(2).padStart(8, "0") + " ";

    if (format === "hex") output += "0x" + bytes[i].toString(16).padStart(2, "0").toUpperCase() + " ";
  }
  return output.trim() + (reverse ? " (r)" : "") + (size ? ` | ${bytes.length}B` : "");
}

export function prettyPrintMessage(msg: Message): void {
  const { buffer, length } = msg.getBinary();

  const view = new DataView(buffer, 0, length);

  console.log("Binary Data:", printBytes(new Uint8Array(buffer, 0, length), "hex", false, true));
  let output = "Message header:\n";
  output += `  Network ID: 0x${view.getUint32(HeaderOffsets.networkId, true).toString(16).toUpperCase()}\n`;
  output += `  Length: ${view.getUint8(HeaderOffsets.length)} bytes\n`;
  output += `  Order: ${view.getUint16(HeaderOffsets.order, true)}\n`;
  output += `  Type: ${view.getUint8(HeaderOffsets.type)}\n`;
  output += `  Channels: ${view.getUint8(HeaderOffsets.channels).toString(2).padStart(8, "0")}\n`;

  output += "Payload:\n";
  const payloadBytes = new Uint8Array(buffer, HeaderSize, length - HeaderSize);
  output += `  ${printBytes(payloadBytes, "bin", true, true)}\n`;

  console.log(output);
}
