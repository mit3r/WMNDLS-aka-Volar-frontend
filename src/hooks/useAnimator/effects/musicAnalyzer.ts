export type MusicAnalyzerStatus = "off" | "requesting" | "on" | "error" | "unsupported";

type Listener = () => void;

let status: MusicAnalyzerStatus = "off";
let lastError: string | null = null;

let audioContext: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let source: MediaStreamAudioSourceNode | null = null;
let stream: MediaStream | null = null;

let frequencyData: Uint8Array<ArrayBuffer> | null = null;
let lastUpdateAt = 0;

const listeners = new Set<Listener>();

function notify() {
  for (const l of listeners) l();
}

export function subscribeMusicAnalyzer(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getMusicAnalyzerStatus(): MusicAnalyzerStatus {
  return status;
}

export function getMusicAnalyzerError(): string | null {
  return lastError;
}

function setStatus(next: MusicAnalyzerStatus, error?: string) {
  status = next;
  lastError = error ?? null;
  notify();
}

function ensureBrowserSupport(): boolean {
  if (typeof window === "undefined") return false;
  if (!navigator?.mediaDevices?.getUserMedia) return false;
  return true;
}

export async function enableMicrophoneAnalyzer() {
  if (!ensureBrowserSupport()) {
    setStatus("unsupported", "getUserMedia not supported");
    return;
  }

  if (status === "on" || status === "requesting") return;

  try {
    setStatus("requesting");

    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      video: false,
    });

    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!)();
    if (audioContext.state === "suspended") await audioContext.resume();

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.7;

    source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    frequencyData = new Uint8Array<ArrayBuffer>(new ArrayBuffer(analyser.frequencyBinCount));
    lastUpdateAt = 0;

    setStatus("on");
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    setStatus("error", msg);
  }
}

export async function disableMicrophoneAnalyzer() {
  try {
    if (source) {
      try {
        source.disconnect();
      } catch {
        // ignore
      }
    }

    if (stream) {
      for (const track of stream.getTracks()) track.stop();
    }

    if (audioContext) {
      try {
        await audioContext.close();
      } catch {
        // ignore
      }
    }
  } finally {
    audioContext = null;
    analyser = null;
    source = null;
    stream = null;
    frequencyData = null;
    lastUpdateAt = 0;
    setStatus("off");
  }
}

function updateFrequencySnapshotIfNeeded() {
  if (!analyser || !frequencyData) return;

  const now = performance.now();
  // Avoid doing FFT work for every LED; refresh at most ~60fps.
  if (now - lastUpdateAt < 16) return;
  lastUpdateAt = now;

  analyser.getByteFrequencyData(frequencyData);
}

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

/**
 * Returns a normalized (0..1) value for a given LED offset (0..1) mapped to audio frequency spectrum.
 * Uses log mapping to give more resolution to bass frequencies.
 */
export function getMusicSpectrumValue(ledOffset: number): number {
  if (status !== "on" || !analyser || !frequencyData || !audioContext) return 0;

  updateFrequencySnapshotIfNeeded();
  if (!frequencyData) return 0;

  const sampleRate = audioContext.sampleRate;
  const nyquist = sampleRate / 2;

  // Log-frequency mapping feels much better for music.
  const minF = 40;
  const maxF = Math.min(12000, nyquist);
  const t = clamp01(ledOffset);
  const f = minF * Math.pow(maxF / minF, t);

  const bin = Math.floor((f / nyquist) * (frequencyData.length - 1));
  const raw = frequencyData[Math.max(0, Math.min(frequencyData.length - 1, bin))] / 255;

  // Simple noise gate + gentle curve
  // Tuned to be a bit less sensitive: at the same volume as before, LEDs should glow less.
  const noiseGate = 0.08; // was 0.05
  const gated = Math.max(0, raw - noiseGate) / (1 - noiseGate);
  return clamp01(Math.pow(gated, 1.55));
}
