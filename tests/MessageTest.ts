import { CRGB } from "../src/api/Transmitter/Color";
import * as Pc from "../src/api/Transmitter/Protocol";
import Message from "../src/api/Transmitter/Message";

import { assert } from "console";
import { describe, it } from "node:test";
import { equal, throws } from "assert";

describe("Message", async () => {
  it("should create a message", async () => {
    const testMsg = new Message();
    assert(testMsg instanceof Message);
  });

  it("should set message type", async () => {
    const testMsg = new Message();
    testMsg.bType = Pc.MessageType.COLORS16;

    equal(testMsg.bType, Pc.MessageType.COLORS16);
  });

  it("should set color channel", async () => {
    const testMsg = new Message();
    testMsg.bType = Pc.MessageType.COLORS16;
    testMsg.setColorChannel(0, Array(Pc.NUM_LEDS).fill(new CRGB(255, 0, 0)));

    equal(Object.keys(testMsg["channelsColorPayloads"]).length, 1);
  });

  it("should throw error when adding unicast channel after broadcast", async () => {
    const testMsg = new Message();
    testMsg.bType = Pc.MessageType.COLORS16;
    testMsg.setColorChannel(Pc.BROADCAST_CHANNEL, Array(Pc.NUM_LEDS).fill(new CRGB(255, 0, 0)));

    throws(() => {
      testMsg.setColorChannel(1, Array(Pc.NUM_LEDS).fill(new CRGB(0, 255, 0)));
    }, /Cannot set unicast channel when broadcast channel is already set/);
  });

  it("should throw error when adding broadcast channel after unicast", async () => {
    const testMsg = new Message();
    testMsg.bType = Pc.MessageType.COLORS16;
    testMsg.setColorChannel(1, Array(Pc.NUM_LEDS).fill(new CRGB(0, 255, 0)));
    throws(() => {
      testMsg.setColorChannel(Pc.BROADCAST_CHANNEL, Array(Pc.NUM_LEDS).fill(new CRGB(255, 0, 0)));
    }, /Cannot set broadcast channel when other channels are already set/);
  });

  it("should throw error when exceeding max channels", async () => {
    const testMsg = new Message();
    testMsg.bType = Pc.MessageType.COLORS16;
    testMsg.setColorChannel(0, Array(Pc.NUM_LEDS).fill(new CRGB(255, 0, 0)));
    testMsg.setColorChannel(1, Array(Pc.NUM_LEDS).fill(new CRGB(0, 255, 0)));
    throws(() => {
      testMsg.setColorChannel(2, Array(Pc.NUM_LEDS).fill(new CRGB(0, 0, 255)));
    }, /Exceeded maximum number of channels for message type/);
  });

  it("should throw error when colors length is invalid", async () => {
    const testMsg = new Message();
    testMsg.bType = Pc.MessageType.COLORS16;
    throws(() => {
      testMsg.setColorChannel(0, Array(Pc.NUM_LEDS - 1).fill(new CRGB(255, 0, 0)));
    }, /Invalid colors length/);
  });

  it("should throw error when message type is invalid for color payload", async () => {
    const testMsg = new Message();
    testMsg.bType = Pc.MessageType.ORDER;
    throws(() => {
      testMsg.setColorChannel(0, Array(Pc.NUM_LEDS).fill(new CRGB(255, 0, 0)));
    }, /Invalid message type for color payload/);
  });

  it("should get binary data", async () => {
    const testMsg = new Message();
    testMsg.bType = Pc.MessageType.COLORS16;
    testMsg.setColorChannel(0, Array(Pc.NUM_LEDS).fill(new CRGB(255, 0, 0)));
    const { buffer, length } = testMsg.getBinary();

    equal(buffer.byteLength, length);
  });

  it("should throw error when getting binary with no channels set", async () => {
    const testMsg = new Message();
    testMsg.bType = Pc.MessageType.COLORS16;
    throws(() => {
      testMsg.getBinary();
    }, /No channels set in message before building binary/);
  });
});
