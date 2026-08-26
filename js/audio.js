/**
 * Web Audio API Procedural Sound Engine
 * Generates piano, ambient string pads, typing clicks, heartbeat, and sparkle chimes dynamically.
 */

class AudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.isPlaying = false;
        this.masterGain = null;
        this.bgMusicTimer = null;
        this.currentSceneIndex = 0;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.initialized = true;
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.8, this.ctx.currentTime);
        }
        return this.isMuted;
    }

    /**
     * Synthesize a gentle piano note
     * @param {number} freq Frequency in Hz
     * @param {number} duration Duration in seconds
     * @param {number} time Start time offset
     * @param {number} gain Gain volume
     */
    playPianoNote(freq, duration = 2.5, timeOffset = 0, gainVal = 0.3) {
        if (!this.initialized || this.isMuted) return;
        const now = this.ctx.currentTime + timeOffset;

        // Oscillator 1: Fundamental Sine
        const osc1 = this.ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, now);

        // Oscillator 2: Overtone Triangle
        const osc2 = this.ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 2, now);

        // Envelope Gain
        const noteGain = this.ctx.createGain();
        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.linearRampToValueAtTime(gainVal, now + 0.05); // quick attack
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration); // smooth decay

        // Filter for warm sound
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(300, now + duration);

        osc1.connect(noteGain);
        osc2.connect(noteGain);
        noteGain.connect(filter);
        filter.connect(this.masterGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + duration);
        osc2.stop(now + duration);
    }

    /**
     * Synthesize background ambient chord progressions according to video scene intensity
     */
    startBackgroundScore() {
        if (!this.initialized) this.init();
        this.resume();
        this.isPlaying = true;
        this.scheduleNextChord();
    }

    scheduleNextChord() {
        if (!this.isPlaying) return;

        // Frequencies for emotional chords: Cmaj9, Am9, Fmaj7, Gsus4
        const chordProgressions = [
            // Mystery Intro (Scene 1-3)
            [261.63, 329.63, 392.00, 493.88], // Cmaj7
            [220.00, 261.63, 329.63, 392.00], // Am7
            [174.61, 220.00, 261.63, 329.63], // Fmaj7
            [196.00, 261.63, 293.66, 392.00], // Gsus4

            // Warm Building (Scene 4-6)
            [261.63, 329.63, 392.00, 523.25], // C add9
            [220.00, 329.63, 392.00, 523.25], // Am9
            [174.61, 261.63, 329.63, 440.00], // Fmaj9
            [196.00, 246.94, 293.66, 392.00], // G major

            // Emotional Reveal (Scene 7-11)
            [523.25, 659.25, 783.99, 987.77], // High Cmaj7
            [440.00, 523.25, 659.25, 783.99], // High Am7
            [349.23, 440.00, 523.25, 659.25], // High Fmaj7
            [392.00, 493.88, 587.33, 783.99]  // High G
        ];

        let chordSet = chordProgressions[0];
        if (this.currentSceneIndex >= 3 && this.currentSceneIndex <= 5) {
            chordSet = chordProgressions[1];
        } else if (this.currentSceneIndex >= 6) {
            chordSet = chordProgressions[2];
        }

        // Arpeggiate piano chord
        chordSet.forEach((freq, idx) => {
            const delay = idx * 0.4;
            this.playPianoNote(freq, 4.0, delay, 0.25);
        });

        // Add soft warm string pad for scene 7 onwards
        if (this.currentSceneIndex >= 6) {
            this.playPadChord(chordSet[0] / 2, chordSet[1] / 2, 4.5);
        }

        // Repeat chord loop every 4.2 seconds
        this.bgMusicTimer = setTimeout(() => {
            this.scheduleNextChord();
        }, 4200);
    }

    playPadChord(freq1, freq2, duration) {
        if (!this.initialized || this.isMuted) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq1, now);

        const padFilter = this.ctx.createBiquadFilter();
        padFilter.type = 'lowpass';
        padFilter.frequency.setValueAtTime(450, now);

        const padGain = this.ctx.createGain();
        padGain.gain.setValueAtTime(0.001, now);
        padGain.gain.linearRampToValueAtTime(0.12, now + 1.5);
        padGain.gain.linearRampToValueAtTime(0.001, now + duration);

        osc.connect(padFilter);
        padFilter.connect(padGain);
        padGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + duration);
    }

    // Sound FX: Keyboard Typing Tick
    playTypeSound() {
        if (!this.initialized || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800 + Math.random() * 300, now);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.04);
    }

    // Sound FX: Heartbeat Pulse (Scene 10)
    playHeartbeatSound() {
        if (!this.initialized || this.isMuted) return;
        const now = this.ctx.currentTime;

        const playThump = (timeOffset) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + timeOffset;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(60, t);
            osc.frequency.exponentialRampToValueAtTime(25, t + 0.15);

            gain.gain.setValueAtTime(0.6, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(t);
            osc.stop(t + 0.25);
        };

        playThump(0);
        playThump(0.28); // Double heartbeat beat (thump-thump)
    }

    // Sound FX: Sparkle Burst Chime
    playSparkleSound() {
        if (!this.initialized || this.isMuted) return;
        const notes = [1046.50, 1318.51, 1567.98, 2093.00];
        notes.forEach((freq, index) => {
            this.playPianoNote(freq, 2.0, index * 0.1, 0.15);
        });
    }

    stopBackgroundScore() {
        this.isPlaying = false;
        if (this.bgMusicTimer) clearTimeout(this.bgMusicTimer);
    }

    setSceneIndex(idx) {
        this.currentSceneIndex = idx;
    }
}

window.audioEngine = new AudioEngine();
