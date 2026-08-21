import { PHI, ratio } from '../math/fibonacci.js';

// ─── Musical scales ──────────────────────────────────────────────────

const BASE_FREQ = 220; // A3

const SCALE_MAP: Record<string, number[]> = {
  pentatonicMinor: [0, 3, 5, 7, 10],
  pentatonicMajor: [0, 2, 4, 7, 9],
  naturalMinor: [0, 2, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  blues: [0, 3, 5, 6, 7, 10],
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  chords: [0, 4, 7, 12, 16, 19],
  glissando: [],
};

const NOTE_NAMES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

// ─── Harmonic model (piano-like) ─────────────────────────────────────

interface HarmonicSpec {
  mult: number;
  gain: number;
  decay: number;
  detuneCents: number;
}

const HARMONICS: HarmonicSpec[] = [
  { mult: 1, gain: 1.0, decay: 2.0, detuneCents: 2 },
  { mult: 2, gain: 0.5, decay: 1.2, detuneCents: 0 },
  { mult: 3, gain: 0.2, decay: 0.8, detuneCents: 0 },
  { mult: 4, gain: 0.1, decay: 0.5, detuneCents: 0 },
  { mult: 5, gain: 0.04, decay: 0.3, detuneCents: 0 },
];

const ATTACK_NOISE_DURATION = 0.005;
const ATTACK_NOISE_GAIN = 0.15;

// ─── Style presets ───────────────────────────────────────────────────

export interface StylePreset {
  id: string;
  name: string;
  scale: string;
  tempoMs: number;
  dynamics: boolean;
  subGain: number;
  warmth: number;
}

const PRESETS: StylePreset[] = [
  {
    id: 'melancholic',
    name: 'Melancólica (Einaudi)',
    scale: 'naturalMinor',
    tempoMs: 140,
    dynamics: true,
    subGain: 0.025,
    warmth: 0.6,
  },
  {
    id: 'classic',
    name: 'Clásica (Beethoven)',
    scale: 'naturalMinor',
    tempoMs: 100,
    dynamics: true,
    subGain: 0.015,
    warmth: 0.8,
  },
  {
    id: 'serenade',
    name: 'Serenata (Debussy)',
    scale: 'lydian',
    tempoMs: 200,
    dynamics: true,
    subGain: 0.01,
    warmth: 0.4,
  },
];

// ─── Dynamics by distance to φ ───────────────────────────────────────

/** Converges to φ → notes stabilise on a single pitch (consonant). */
function dynamicsFromError(err: number): number {
  if (err > 0.3) return 0.1; // far from φ — loud, rich
  if (err > 0.1) return 0.07;
  if (err > 0.03) return 0.05;
  return 0.03; // essentially at φ — quiet, still
}

function dynamicsLabel(err: number): string {
  if (err > 0.3) return 'f';
  if (err > 0.1) return 'mf';
  if (err > 0.03) return 'mp';
  return 'p';
}

// ─── Sonifier class ──────────────────────────────────────────────────

export type MusicalMode = keyof typeof SCALE_MAP;

export class Sonifier {
  private n = 233;
  private ratios: number[] = []; // F(k)/F(k-1) for k = 2..n
  private stepIndex = 0;

  // Audio nodes — created once in initAudio()
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private harmonicOscs: OscillatorNode[] = [];
  private harmonicGains: GainNode[] = [];
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private subGain: GainNode | null = null;

  // State
  private timerId: number | null = null;
  private _musicalMode: MusicalMode = 'pentatonicMinor';
  private _dynamicsOn = true;
  private _subWarmth = 0.02;
  private _warmth = 0.6;

  // Scale cache
  private builtScale: number[] = [];

  isPlaying = false;
  tempoMs = 140;
  lastNote = '—';
  lastFreq = 0;
  lastDynamics = '';
  onNotePlayed?: (note: string) => void;

  // ── Getters/Setters ──────────────────────────────────────────────

  get musicalMode(): MusicalMode {
    return this._musicalMode;
  }
  set musicalMode(mode: MusicalMode) {
    this._musicalMode = mode;
    this.buildScaleCache();
  }

  get dynamicsEnabled(): boolean {
    return this._dynamicsOn;
  }
  set dynamicsEnabled(v: boolean) {
    this._dynamicsOn = v;
  }

  // ── Scale builder ────────────────────────────────────────────────

  private buildScaleCache(): void {
    const semitones = SCALE_MAP[this._musicalMode];
    if (!semitones || semitones.length === 0) {
      this.builtScale = [];
      return;
    }
    const notes: number[] = [];
    for (let oct = 3; oct <= 5; oct++) {
      for (const s of semitones) {
        notes.push(BASE_FREQ * Math.pow(2, (s + (oct - 3) * 12) / 12));
      }
    }
    this.builtScale = notes;
  }

  // ── Public API ───────────────────────────────────────────────────

  setN(n: number): void {
    this.n = Math.max(3, n);
    this.rebuildRatios();
  }

  private rebuildRatios(): void {
    const out: number[] = [];
    for (let k = 2; k <= this.n; k++) {
      out.push(ratio(k));
    }
    this.ratios = out;
  }

  setTempo(ms: number): void {
    this.tempoMs = Math.max(40, Math.min(600, ms));
    if (this.isPlaying && this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = window.setInterval(() => this.tick(), this.tempoMs);
    }
  }

  applyPreset(presetId: string): void {
    const p = PRESETS.find((pr) => pr.id === presetId);
    if (!p) return;
    this._musicalMode = p.scale as MusicalMode;
    this.tempoMs = p.tempoMs;
    this._dynamicsOn = p.dynamics;
    this._subWarmth = p.subGain;
    this._warmth = p.warmth;
    this.buildScaleCache();
    if (this.isPlaying && this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = window.setInterval(() => this.tick(), this.tempoMs);
    }
  }

  togglePlay(): boolean {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
    return this.isPlaying;
  }

  start(): void {
    this.initAudio();
    this.isPlaying = true;
    this.buildScaleCache();
    this.rebuildRatios();
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setTargetAtTime(0.08, this.audioCtx.currentTime, 0.03);
    }
    this.stepIndex = 0;
    if (this.timerId !== null) window.clearInterval(this.timerId);
    this.timerId = window.setInterval(() => this.tick(), this.tempoMs);
  }

  stop(): void {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setTargetAtTime(0.0, this.audioCtx.currentTime, 0.05);
    }
  }

  // ── Audio initialization (multi-harmonic piano) ──────────────────

  private initAudio(): void {
    if (this.audioCtx) {
      if (this.audioCtx.state === 'suspended') void this.audioCtx.resume();
      return;
    }
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    this.audioCtx = new Ctx();

    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.value = 0;
    this.masterGain.connect(this.audioCtx.destination);

    for (let i = 0; i < HARMONICS.length; i++) {
      const spec = HARMONICS[i]!;
      const osc = this.audioCtx.createOscillator();
      osc.type = 'sine';
      if (spec.detuneCents !== 0) osc.detune.value = spec.detuneCents;

      const gain = this.audioCtx.createGain();
      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();

      this.harmonicOscs.push(osc);
      this.harmonicGains.push(gain);
    }

    const bufferSize = Math.floor(this.audioCtx.sampleRate * 0.05);
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    this.noiseGain = this.audioCtx.createGain();
    this.noiseGain.gain.value = 0;
    this.noiseGain.connect(this.masterGain);

    this.subGain = this.audioCtx.createGain();
    this.subGain.gain.value = 0;
    this.subOsc = this.audioCtx.createOscillator();
    this.subOsc.type = 'triangle';
    this.subOsc.connect(this.subGain);
    this.subGain.connect(this.masterGain);
    this.subOsc.start();

    if (this.audioCtx.state === 'suspended') void this.audioCtx.resume();
  }

  // ── Note playback with piano envelope ────────────────────────────

  private playNote(freq: number, dynGain: number): void {
    if (!this.audioCtx || !this.masterGain) return;
    const now = this.audioCtx.currentTime;
    const noteLen = this.tempoMs / 1000;
    const attackTime = 0.003;
    const decayTime = 0.05;
    const sustainLevel = 0.65;

    for (let i = 0; i < HARMONICS.length; i++) {
      const spec = HARMONICS[i]!;
      const activeGain = spec.gain * dynGain * this._warmth;
      const harmonicGain = this.harmonicGains[i]!;
      const osc = this.harmonicOscs[i]!;

      osc.frequency.setValueAtTime(freq * spec.mult, now);

      harmonicGain.gain.cancelScheduledValues(now);
      harmonicGain.gain.setValueAtTime(0.0, now);
      harmonicGain.gain.linearRampToValueAtTime(activeGain * 1.2, now + attackTime);
      harmonicGain.gain.exponentialRampToValueAtTime(
        Math.max(0.0001, activeGain * sustainLevel * (1 - i * 0.18)),
        now + decayTime,
      );
      harmonicGain.gain.exponentialRampToValueAtTime(
        Math.max(0.0001, activeGain * 0.05),
        now + Math.min(noteLen, spec.decay),
      );
      harmonicGain.gain.linearRampToValueAtTime(0.0, now + noteLen);
    }

    if (this.noiseGain && this.audioCtx) {
      this.noiseGain.gain.cancelScheduledValues(now);
      this.noiseGain.gain.setValueAtTime(0.0, now);
      this.noiseGain.gain.linearRampToValueAtTime(ATTACK_NOISE_GAIN * dynGain, now + 0.001);
      this.noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + ATTACK_NOISE_DURATION);
      this.noiseNode?.stop(now);
      this.noiseNode = this.audioCtx.createBufferSource();
      const bufSize = Math.floor(this.audioCtx.sampleRate * 0.05);
      const buf = this.audioCtx.createBuffer(1, bufSize, this.audioCtx.sampleRate);
      const d = buf.getChannelData(0);
      for (let j = 0; j < bufSize; j++) d[j] = Math.random() * 2 - 1;
      this.noiseNode.buffer = buf;
      this.noiseNode.connect(this.noiseGain!);
      this.noiseNode.start(now);
    }

    if (this.subOsc) this.subOsc.frequency.setValueAtTime(freq / 2, now);
    if (this.subGain) {
      this.subGain.gain.cancelScheduledValues(now);
      this.subGain.gain.setValueAtTime(this._subWarmth, now);
      this.subGain.gain.exponentialRampToValueAtTime(0.0001, now + noteLen * 0.7);
    }
  }

  // ── Tick: map ratio → note ───────────────────────────────────────

  private tick(): void {
    if (!this.isPlaying) return;

    const rawVal = this.ratios[this.stepIndex % this.ratios.length] ?? PHI;
    this.stepIndex++;

    // Ratios live in [1, 2]; φ ≈ 1.618 → norm ≈ 0.618 (a fixed pitch).
    const norm = Math.max(0, Math.min(1, (rawVal - 1) / (2 - 1)));

    let freq: number;
    let noteName: string;

    if (this.builtScale.length > 0) {
      const idx = Math.min(
        this.builtScale.length - 1,
        Math.round(norm * (this.builtScale.length - 1)),
      );
      freq = this.builtScale[idx] ?? 220;
      const scale = SCALE_MAP[this._musicalMode]!;
      const octave = 3 + Math.floor(idx / scale.length);
      const noteIdx = idx % scale.length;
      noteName = NOTE_NAMES[(scale[noteIdx]! + 9) % 12]! + octave;
    } else {
      freq = 160 + norm * 940;
      noteName = `${freq.toFixed(0)} Hz`;
    }

    // Dynamics from distance to φ (converges to piano near φ).
    const err = Math.abs(rawVal - PHI);
    const dynGain = this._dynamicsOn ? dynamicsFromError(err) : 0.06;
    this.lastDynamics = dynamicsLabel(err);

    this.lastNote = noteName;
    this.lastFreq = Math.round(freq);
    this.onNotePlayed?.(`${noteName} · ${Math.round(freq)} Hz · ${this.lastDynamics}`);

    this.playNote(freq, dynGain);
  }
}
