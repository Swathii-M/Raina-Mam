/**
 * Main Application Entry Point & UI Controller
 * Binds player controls, keyboard shortcuts, fullscreen toggle, and start screen overlay.
 */

class AppController {
    constructor() {
        this.btnStart = document.getElementById('start-btn');
        this.overlay = document.getElementById('start-overlay');
        this.btnPlayPause = document.getElementById('btn-play-pause');
        this.playIcon = document.getElementById('play-icon');
        this.btnReplay = document.getElementById('btn-replay');
        this.btnMute = document.getElementById('btn-mute');
        this.muteIcon = document.getElementById('mute-icon');
        this.btnFullscreen = document.getElementById('btn-fullscreen');
        this.sceneSelector = document.getElementById('scene-selector');
        this.progressFill = document.getElementById('progress-fill');
        this.progressContainer = document.getElementById('progress-container');
        this.timeCurrent = document.getElementById('time-current');
        this.timeTotal = document.getElementById('time-total');

        this.init();
    }

    init() {
        // Start Experience Button
        if (this.btnStart) {
            this.btnStart.addEventListener('click', () => this.startExperience());
        }

        // Play / Pause Toggle
        if (this.btnPlayPause) {
            this.btnPlayPause.addEventListener('click', () => this.togglePlayPause());
        }

        // Replay Button
        if (this.btnReplay) {
            this.btnReplay.addEventListener('click', () => {
                window.sceneDirector.start();
                this.updatePlayState(true);
            });
        }

        // Mute / Unmute Toggle
        if (this.btnMute) {
            this.btnMute.addEventListener('click', () => {
                const muted = window.audioEngine.toggleMute();
                if (this.muteIcon) {
                    this.muteIcon.textContent = muted ? '🔇' : '🔊';
                }
            });
        }

        // Scene Dropdown Jumper
        if (this.sceneSelector) {
            this.sceneSelector.addEventListener('change', (e) => {
                const sceneIdx = parseInt(e.target.value, 10);
                window.sceneDirector.jumpToScene(sceneIdx);
            });
        }

        // Progress Bar Click Seek
        if (this.progressContainer) {
            this.progressContainer.addEventListener('click', (e) => {
                const rect = this.progressContainer.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = clickX / rect.width;
                const targetScene = Math.floor(ratio * window.sceneDirector.scenes.length);
                window.sceneDirector.jumpToScene(targetScene);
            });
        }

        // Fullscreen Button
        if (this.btnFullscreen) {
            this.btnFullscreen.addEventListener('click', () => this.toggleFullscreen());
        }

        // Keyboard Shortcuts
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.togglePlayPause();
            } else if (e.code === 'KeyM') {
                this.btnMute.click();
            } else if (e.code === 'KeyF') {
                this.toggleFullscreen();
            }
        });
    }

    startExperience() {
        if (this.overlay) {
            this.overlay.classList.remove('active');
        }
        window.sceneDirector.start();
        this.updatePlayState(true);
    }

    togglePlayPause() {
        if (!window.sceneDirector.isPlaying) {
            window.sceneDirector.start();
            this.updatePlayState(true);
        } else if (window.sceneDirector.isPaused) {
            window.sceneDirector.resume();
            this.updatePlayState(true);
        } else {
            window.sceneDirector.pause();
            this.updatePlayState(false);
        }
    }

    updatePlayState(isPlaying) {
        if (this.playIcon) {
            this.playIcon.textContent = isPlaying ? '⏸' : '▶';
        }
    }

    updateProgress(elapsed, total) {
        const percentage = Math.min(100, (elapsed / total) * 100);
        if (this.progressFill) {
            this.progressFill.style.width = `${percentage}%`;
        }

        if (this.timeCurrent) {
            const mins = Math.floor(elapsed / 60);
            const secs = Math.floor(elapsed % 60);
            this.timeCurrent.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }

    updateSceneDropdown(index) {
        if (this.sceneSelector) {
            this.sceneSelector.value = index.toString();
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.warn(`Fullscreen request failed: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.appController = new AppController();
});
