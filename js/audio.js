/* ==========================================================================
   ROMANTIC AUDIO ENGINE (Web Audio Synthesizer & Sound Effects)
   ========================================================================== */

class RomanticAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.loopTimeout = null;
    this.masterGain = null;
    this.customAudio = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.35;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.init();
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  start() {
    this.init();
    this.isPlaying = true;
    this.playChordProgression();
  }

  stop() {
    this.isPlaying = false;
    if (this.loopTimeout) {
      clearTimeout(this.loopTimeout);
    }
  }

  // Plays a soothing romantic note with envelope & warm harmonics
  playNote(frequency, duration, delay = 0, type = 'sine') {
    if (!this.isPlaying && delay > 0) return;
    this.init();

    setTimeout(() => {
      if (!this.isPlaying && delay > 0) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
        
        // Gentle Attack & Decay Envelope
        const now = this.ctx.currentTime;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.2, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(now);
        osc.stop(now + duration + 0.1);
      } catch (e) {
        console.error("Audio error", e);
      }
    }, delay * 1000);
  }

  // Romantic arpeggiated piano/bell melody progression (C - Am - F - G)
  playChordProgression() {
    if (!this.isPlaying) return;

    // Frequencies (Hz)
    const notes = {
      C3: 130.81, E3: 164.81, G3: 196.00, B3: 246.94,
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880.00
    };

    // Progression pattern: 4 chords with soft arpeggios
    const pattern = [
      // Chord 1: C Major 7 (Dreamy)
      { note: notes.C3, time: 0.0, dur: 3.5 },
      { note: notes.G3, time: 0.3, dur: 2.5 },
      { note: notes.E4, time: 0.6, dur: 2.0 },
      { note: notes.B4, time: 0.9, dur: 2.0 },
      { note: notes.C5, time: 1.2, dur: 2.5 },
      { note: notes.E5, time: 1.6, dur: 2.0 },

      // Chord 2: A Minor 9
      { note: notes.A4 / 4, time: 2.2, dur: 3.5 },
      { note: notes.E3, time: 2.5, dur: 2.5 },
      { note: notes.C4, time: 2.8, dur: 2.0 },
      { note: notes.G4, time: 3.1, dur: 2.0 },
      { note: notes.B4, time: 3.4, dur: 2.0 },
      { note: notes.E5, time: 3.8, dur: 2.5 },

      // Chord 3: F Major 7
      { note: notes.F4 / 4, time: 4.4, dur: 3.5 },
      { note: notes.C3 * 1.33, time: 4.7, dur: 2.5 },
      { note: notes.A4 / 2, time: 5.0, dur: 2.0 },
      { note: notes.E4, time: 5.3, dur: 2.0 },
      { note: notes.G4, time: 5.6, dur: 2.0 },
      { note: notes.C5, time: 6.0, dur: 2.5 },

      // Chord 4: G Sus 4 to G Major
      { note: notes.G3 / 2, time: 6.6, dur: 3.5 },
      { note: notes.D4, time: 6.9, dur: 2.5 },
      { note: notes.G4, time: 7.2, dur: 2.0 },
      { note: notes.C5, time: 7.5, dur: 2.0 },
      { note: notes.B4, time: 7.9, dur: 2.2 },
      { note: notes.D5, time: 8.3, dur: 2.5 }
    ];

    pattern.forEach(p => {
      this.playNote(p.note, p.dur, p.time, 'sine');
    });

    // Schedule next loop smoothly
    this.loopTimeout = setTimeout(() => {
      if (this.isPlaying) {
        this.playChordProgression();
      }
    }, 8900);
  }

  // Play magical chime when interacting with secrets
  playChime() {
    this.init();
    const chimes = [523.25, 659.25, 783.99, 1046.50];
    chimes.forEach((f, idx) => {
      this.playNote(f, 0.8, idx * 0.1, 'triangle');
    });
  }

  // Play celebration fanfare when she says YES!
  playGrandFanfare() {
    this.init();
    const fanfare = [
      { f: 523.25, t: 0.0, d: 0.3 }, // C5
      { f: 659.25, t: 0.2, d: 0.3 }, // E5
      { f: 783.99, t: 0.4, d: 0.4 }, // G5
      { f: 1046.50, t: 0.7, d: 1.8 }, // C6
      { f: 1318.51, t: 0.9, d: 2.0 }, // E6
      { f: 1567.98, t: 1.1, d: 2.5 }  // G6
    ];
    fanfare.forEach(item => {
      this.playNote(item.f, item.d, item.t, 'triangle');
    });
  }
}

window.romanticAudio = new RomanticAudioEngine();
