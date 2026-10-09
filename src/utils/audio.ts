// Web Audio API synthesizer for romantic music box and tactile interaction sounds

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isPlayingMusic = false;
  private musicInterval: number | null = null;
  private masterGain: GainNode | null = null;
  private musicVolume = 0.3;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a soft tactile sound for opening the envelope / wax seal crack
  public playWaxSealCrack() {
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      
      // Noise burst for the crack
      const bufferSize = this.ctx.sampleRate * 0.12;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.03));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.1);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(now);

      // Add a warm resonant chime
      this.playNote(523.25, 0.4, 0.2, 'sine'); // C5
      setTimeout(() => this.playNote(659.25, 0.6, 0.2, 'sine'), 80); // E5
      setTimeout(() => this.playNote(783.99, 0.8, 0.2, 'sine'), 160); // G5
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Play a gentle note with gentle chime harmonics
  public playNote(freq: number, duration = 1.2, volume = 0.25, type: OscillatorType = 'sine') {
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      // subtle harmonic overtone for harp/celesta feel
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, now);

      noteGain.gain.setValueAtTime(volume * this.musicVolume, now);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(noteGain);
      osc2.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + duration);
      osc2.stop(now + duration);
    } catch {
      // Ignore
    }
  }

  // Soft romantic music box arpeggio melody (Canon / Waltz inspired)
  public toggleMusic(onState?: boolean): boolean {
    this.initCtx();
    const shouldPlay = onState !== undefined ? onState : !this.isPlayingMusic;

    if (shouldPlay) {
      if (this.isPlayingMusic) return true;
      this.isPlayingMusic = true;

      // Romantic notes in Hz (C major / A minor soothing progression)
      // C4, E4, G4, B4, C5, E5, D5, B4, A4, C5, E5...
      const melody = [
        261.63, 329.63, 392.00, 523.25, 659.25, 523.25, 392.00, 329.63,
        220.00, 261.63, 329.63, 440.00, 523.25, 440.00, 329.63, 261.63,
        174.61, 220.00, 261.63, 349.23, 440.00, 349.23, 261.63, 220.00,
        196.00, 246.94, 293.66, 392.00, 493.88, 392.00, 293.66, 246.94
      ];

      let noteIndex = 0;
      const playNext = () => {
        if (!this.isPlayingMusic) return;
        const note = melody[noteIndex % melody.length];
        this.playNote(note, 1.8, 0.18, 'sine');
        
        // Occasional soft bass chord on start of bar
        if (noteIndex % 8 === 0) {
          const bass = melody[noteIndex] / 2;
          this.playNote(bass, 3.0, 0.14, 'triangle');
        }

        noteIndex++;
      };

      playNext();
      this.musicInterval = window.setInterval(playNext, 460);
      return true;
    } else {
      this.isPlayingMusic = false;
      if (this.musicInterval) {
        clearInterval(this.musicInterval);
        this.musicInterval = null;
      }
      return false;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlayingMusic;
  }

  public setVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
  }
}

export const soundEngine = new SoundEngine();
