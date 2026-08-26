/**
 * Scene Director & Script Timeline Controller
 * Manages typing effects, scene transitions, photo gallery slideshow, typewriter personal letter, and canvas particle modes.
 */

class SceneDirector {
    constructor() {
        this.currentSceneIndex = -1;
        this.scenes = [
            { id: 'scene-1', duration: 5000, particleMode: 'dust' },
            { id: 'scene-2', duration: 6000, particleMode: 'dust' },
            { id: 'scene-3', duration: 6500, particleMode: 'dust' },
            { id: 'scene-4', duration: 7000, particleMode: 'dust' },
            { id: 'scene-5', duration: 7000, particleMode: 'dust' },
            { id: 'scene-6', duration: 7000, particleMode: 'dust' },
            { id: 'scene-7', duration: 6000, particleMode: 'bokeh' },
            { id: 'scene-8', duration: 7000, particleMode: 'bokeh' },
            { id: 'scene-9', duration: 7500, particleMode: 'heart' },
            { id: 'scene-10', duration: 6500, particleMode: 'dust' },
            { id: 'scene-11', duration: 7500, particleMode: 'confetti' },
            { id: 'scene-12', duration: 12000, particleMode: 'bokeh' }, // Photo Showcase
            { id: 'scene-13', duration: 60000, particleMode: 'bokeh' }, // Personal Letter (STAYS 1 FULL MINUTE)
            { id: 'scene-ps', duration: 7500, particleMode: 'confetti' }
        ];

        this.isPlaying = false;
        this.isPaused = false;
        this.sceneTimer = null;
        this.typeTimer = null;
        this.photoTimer = null;
        this.totalDuration = 153; // ~153 seconds total (~2.5 minutes)
        this.elapsedTime = 0;
        this.tickTimer = null;
    }

    start() {
        this.isPlaying = true;
        this.isPaused = false;
        this.elapsedTime = 0;
        window.audioEngine.startBackgroundScore();
        this.startTickCounter();
        this.jumpToScene(0);
    }

    pause() {
        this.isPaused = true;
        if (this.sceneTimer) clearTimeout(this.sceneTimer);
        if (this.typeTimer) clearTimeout(this.typeTimer);
        if (this.photoTimer) clearInterval(this.photoTimer);
    }

    resume() {
        if (!this.isPaused) return;
        this.isPaused = false;
        this.jumpToScene(this.currentSceneIndex);
    }

    startTickCounter() {
        if (this.tickTimer) clearInterval(this.tickTimer);
        this.tickTimer = setInterval(() => {
            if (this.isPlaying && !this.isPaused) {
                this.elapsedTime += 0.5;
                if (window.appController) {
                    window.appController.updateProgress(this.elapsedTime, this.totalDuration);
                }
            }
        }, 500);
    }

    jumpToScene(index) {
        if (index < 0 || index >= this.scenes.length) return;

        // Clear ongoing timers
        if (this.sceneTimer) clearTimeout(this.sceneTimer);
        if (this.typeTimer) clearTimeout(this.typeTimer);
        if (this.photoTimer) clearInterval(this.photoTimer);

        // Hide previous scenes
        document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));

        this.currentSceneIndex = index;
        const current = this.scenes[index];
        const sceneEl = document.getElementById(current.id);

        if (sceneEl) sceneEl.classList.add('active');

        // Set audio and particle mode
        window.audioEngine.setSceneIndex(index);
        window.particleEngine.setMode(current.particleMode);

        // Execute specific scene animation logic
        this.runSceneLogic(index);

        // Update dropdown UI
        if (window.appController) {
            window.appController.updateSceneDropdown(index);
        }

        // Schedule next scene if playing
        if (this.isPlaying && !this.isPaused) {
            this.sceneTimer = setTimeout(() => {
                if (index < this.scenes.length - 1) {
                    this.jumpToScene(index + 1);
                } else {
                    this.finish();
                }
            }, current.duration);
        }
    }

    runSceneLogic(index) {
        switch(index) {
            case 0: // SCENE 1: Mystery Begins
                this.typewriter('scene1-text', 'Initializing a special message...', 70, () => {
                    setTimeout(() => {
                        this.typewriter('scene1-text', 'Please wait...', 70);
                    }, 1200);
                });
                break;

            case 1: // SCENE 2: Search
                const searchEl = document.getElementById('search-input-display');
                const statusEl = document.getElementById('search-status');
                if (searchEl) searchEl.textContent = '';
                if (statusEl) statusEl.textContent = '';

                this.typewriter('search-input-display', 'Someone who made a difference...', 65, () => {
                    setTimeout(() => {
                        if (statusEl) statusEl.textContent = 'Searching...';
                        setTimeout(() => {
                            if (statusEl) statusEl.textContent = 'Found.';
                        }, 1200);
                    }, 800);
                });
                break;

            case 2: // SCENE 3: First Clue
                break;

            case 3: // SCENE 4: Second Surprise
                const chips = document.querySelectorAll('#scene-4 .word-chip');
                const nameEl = document.getElementById('scene4-name');
                if (nameEl) nameEl.classList.remove('show');
                chips.forEach(c => c.classList.remove('visible'));

                chips.forEach((chip, i) => {
                    setTimeout(() => {
                        chip.classList.add('visible');
                    }, (i + 1) * 800);
                });

                setTimeout(() => {
                    chips.forEach(c => c.classList.remove('visible'));
                    setTimeout(() => {
                        if (nameEl) nameEl.classList.add('show');
                    }, 600);
                }, 4000);
                break;

            case 4: // SCENE 5: Memory Effect
                const memLines = document.querySelectorAll('#scene-5 .mem-line');
                memLines.forEach(l => l.classList.remove('visible'));

                memLines.forEach((line, i) => {
                    setTimeout(() => {
                        line.classList.add('visible');
                    }, (i + 1) * 1100);
                });
                break;

            case 5: // SCENE 6: Bigger Mystery
                const qEl = document.getElementById('scene6-question');
                const nameTypeEl = document.getElementById('scene6-typing-name');
                if (qEl) qEl.textContent = '';
                if (nameTypeEl) nameTypeEl.textContent = '';

                this.typewriter('scene6-question', 'Who is this message for?', 60, () => {
                    setTimeout(() => {
                        this.typewriter('scene6-typing-name', 'R...', 150, () => {
                            setTimeout(() => {
                                nameTypeEl.textContent = '';
                                this.typewriter('scene6-typing-name', 'Ra...', 150, () => {
                                    setTimeout(() => {
                                        nameTypeEl.textContent = '';
                                        this.typewriter('scene6-typing-name', 'Raina Mam ❤️', 120);
                                    }, 400);
                                });
                            }, 400);
                        });
                    }, 800);
                });
                break;

            case 6: // SCENE 7: Golden Reveal
                const t1 = document.getElementById('s7-text1');
                const t2 = document.getElementById('s7-text2');
                const hero = document.getElementById('s7-hero-name');

                if (t1) t1.style.opacity = '0';
                if (t2) t2.style.opacity = '0';
                if (hero) hero.classList.remove('show');

                setTimeout(() => { if (t1) t1.style.opacity = '1'; }, 400);
                setTimeout(() => { if (t2) t2.style.opacity = '1'; }, 1600);
                setTimeout(() => { if (hero) hero.classList.add('show'); }, 2800);
                break;

            case 7: // SCENE 8: Message
                const qLines = document.querySelectorAll('#scene-8 .quote-line');
                qLines.forEach(q => q.style.opacity = '0');
                qLines.forEach((q, i) => {
                    setTimeout(() => { q.style.opacity = '1'; }, (i + 1) * 1100);
                });
                break;

            case 8: // SCENE 9: Gift Box
                const giftBox = document.getElementById('gift-box');
                const virtues = document.querySelectorAll('#scene-9 .virtue');
                if (giftBox) giftBox.classList.remove('open');
                virtues.forEach(v => v.style.opacity = '0');

                setTimeout(() => {
                    if (giftBox) giftBox.classList.add('open');
                    setTimeout(() => {
                        virtues.forEach((v, i) => {
                            setTimeout(() => { v.style.opacity = '1'; }, i * 400);
                        });
                    }, 800);
                }, 1000);
                break;

            case 9: // SCENE 10: Candle
                window.audioEngine.playHeartbeatSound();
                const candleP1 = document.getElementById('s10-p1');
                const candleP2 = document.getElementById('s10-p2');
                if (candleP1) candleP1.style.opacity = '0';
                if (candleP2) candleP2.style.opacity = '0';

                setTimeout(() => { if (candleP1) candleP1.style.opacity = '1'; }, 1200);
                setTimeout(() => { if (candleP2) candleP2.style.opacity = '1'; }, 2800);
                break;

            case 10: // SCENE 11: Celebration
                break;

            case 11: // SCENE 12: Photo Showcase Slideshow
                const photos = [
                    document.getElementById('photo-card-1'),
                    document.getElementById('photo-card-2'),
                    document.getElementById('photo-card-3')
                ];
                photos.forEach(p => p.classList.remove('active-photo'));

                let currentPhoto = 0;
                photos[0].classList.add('active-photo');

                this.photoTimer = setInterval(() => {
                    photos[currentPhoto].classList.remove('active-photo');
                    currentPhoto = (currentPhoto + 1) % photos.length;
                    photos[currentPhoto].classList.add('active-photo');
                    window.audioEngine.playSparkleSound();
                }, 4000);
                break;

            case 12: // SCENE 13: Heartfelt Personal Letter (Types out and STAYS 1 FULL MINUTE!)
                const p1 = "Some people enter our lives as teachers, but slowly become a beautiful part of our memories. You are one such person to me. ❤️";
                const p2 = "Your words, your kindness, the way you encourage, and even the little moments spent around you have a special place in my heart. Maybe I can never completely express how much those moments mean to me.";
                const p3 = "On your birthday, I don't wish you just success or happiness… I wish that life gives you back all the happiness and warmth you have unknowingly given to others. ✨";
                const p4 = "May every dream in your heart find its way to reality, may your smile always remain genuine, and may you always be surrounded by people who value you as much as you deserve.";
                const p5 = "Happy Birthday, Raina Mam. 🎂💐❤️";
                const p6 = "No matter how much time passes or how far life takes us, some people remain special—not because they stayed forever, but because they left a beautiful mark on our hearts.\nYou will always be one of those people for me. 🌸❤️";
                const signText = "With love, Swathi ❤️";

                // Clear previous contents
                ['let-p1', 'let-p2', 'let-p3', 'let-p4', 'let-p5', 'let-p6', 'let-sign'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.textContent = '';
                });

                // Typewriter sequence
                this.typewriter('let-p1', p1, 25, () => {
                    this.typewriter('let-p2', p2, 22, () => {
                        this.typewriter('let-p3', p3, 22, () => {
                            this.typewriter('let-p4', p4, 22, () => {
                                this.typewriter('let-p5', p5, 30, () => {
                                    this.typewriter('let-p6', p6, 22, () => {
                                        this.typewriter('let-sign', signText, 40);
                                    });
                                });
                            });
                        });
                    });
                });
                break;

            case 13: // SCENE PS: Final 5-Second Surprise
                window.audioEngine.playSparkleSound();
                break;
        }
    }

    typewriter(elementId, text, speed, callback) {
        const el = document.getElementById(elementId);
        if (!el) return;
        el.textContent = '';
        let i = 0;

        const type = () => {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                if (i % 3 === 0) window.audioEngine.playTypeSound();
                i++;
                this.typeTimer = setTimeout(type, speed);
            } else if (callback) {
                callback();
            }
        };
        type();
    }

    finish() {
        this.isPlaying = false;
        if (this.tickTimer) clearInterval(this.tickTimer);
    }
}

window.sceneDirector = new SceneDirector();
