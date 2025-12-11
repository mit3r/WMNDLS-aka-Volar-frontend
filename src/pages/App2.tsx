import { Pc, Message, CRGB } from "@api/Transmitter";
import { useTransmitter } from "@hooks/useTransmitter";
import { useCallback, useEffect, useRef, useState } from "react";

const MAX_STRESS_TEST_SENDS = 50; // per second

function App() {
  const [red, setRed] = useState(255);
  const [green, setGreen] = useState(255);
  const [blue, setBlue] = useState(255);
  const [rgbFormat, setRgbFormat] = useState<Pc.MessageColorType>(Pc.MessageType.COLORS24);

  const [devices, setDevices] = useState<number>(1);

  const colors = useRef<CRGB[]>(new Array(Pc.NUM_LEDS).fill(0).map(() => new CRGB(0, 0, 0))); // 24 LEDs, 3 bytes each (RGB)

  const message = useRef(new Message());
  const { status, connect, disconnect, sendMessage } = useTransmitter();

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  const handleSend = useCallback(() => {
    message.current.reset();
    message.current.bOrder = 23;
    message.current.bType = rgbFormat;

    const cols = colors.current;
    for (let i = 0; i < Pc.NUM_LEDS; i++) {
      cols[i].red = red;
      cols[i].green = green;
      cols[i].blue = blue;
    }

    // console.log(cols);

    for (let i = 0; i < devices; i++) message.current.setColorChannel(i as Pc.Channel, cols);

    sendMessage(message.current);
  }, [rgbFormat, sendMessage, red, green, blue, devices]);

  const stressTestInterval = useRef<number | null>(null);
  const handleStressTestToggle = () => {
    if (stressTestInterval.current) {
      clearInterval(stressTestInterval.current);
      stressTestInterval.current = null;
    } else {
      stressTestInterval.current = window.setInterval(handleSend, 1000 / MAX_STRESS_TEST_SENDS);
    }
  };

  const animateInterval = useRef<number | null>(null);
  const animateIndex = useRef(0);

  const handleAnimate = () => {
    if (animateInterval.current) {
      clearInterval(animateInterval.current);
      animateInterval.current = null;
    }
    animateInterval.current = window.setInterval(() => {
      animateIndex.current = (animateIndex.current + 1) % Pc.NUM_LEDS;
      const idx = animateIndex.current;

      for (let i = 0; i < Pc.NUM_LEDS; i++) {
        if (i === idx) {
          colors.current[i].red = red;
          colors.current[i].green = green;
          colors.current[i].blue = blue;
        } else {
          colors.current[i].red = 0;
          colors.current[i].green = 0;
          colors.current[i].blue = 0;
        }
      }

      handleSend();
    }, 1000 / 30);
  };

  return (
    <>
      <div>WMLDS</div>

      <button className="p-2 border-2" onClick={connect}>
        Connect
      </button>
      <button className="p-2 border-2" onClick={disconnect}>
        Disconnect
      </button>

      {status === "connected" && (
        <div className="flex flex-col w-full gap-1">
          <label htmlFor="rgbformat">Select RGB format</label>
          <select
            id="rgbformat"
            value={rgbFormat}
            onChange={(e) => setRgbFormat(Number(e.target.value) as Pc.MessageColorType)}
          >
            <option value={Pc.MessageType.COLORS24}>24 bit</option>
            <option value={Pc.MessageType.COLORS16}>16 bit</option>
            <option value={Pc.MessageType.COLORS8}>8 bit</option>
          </select>

          <label htmlFor="">Devices number</label>
          <input
            className="p-2 border-2"
            type="number"
            min={0}
            max={4}
            value={devices}
            onChange={(e) => setDevices(Number(e.target.value))}
          />

          <label htmlFor="red">Red</label>
          <input id="red" type="range" min="0" max="255" value={red} onChange={(e) => setRed(Number(e.target.value))} />

          <label htmlFor="green">Green</label>
          <input
            id="green"
            type="range"
            min="0"
            max="255"
            value={green}
            onChange={(e) => setGreen(Number(e.target.value))}
          />
          <label htmlFor="blue">Blue</label>
          <input
            className="p-2 border-2"
            id="blue"
            type="range"
            min="0"
            max="255"
            value={blue}
            onChange={(e) => setBlue(Number(e.target.value))}
          />

          <button className="p-2 border-2" onClick={handleSend}>
            Send
          </button>

          <button className="p-2 border-2" onClick={handleStressTestToggle}>
            Toggle stress test
          </button>

          <button className="p-2 border-2" onClick={handleAnimate}>
            Animate
          </button>
        </div>
      )}
    </>
  );
}

export default App;
