/**
 * Dynamic Canvas Particle System
 * Manages dust motes, bokeh particles, heart shape particle assembly, candle flame physics, and confetti.
 */

class ParticleEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mode = 'dust'; // Modes: 'dust', 'bokeh', 'heart', 'candle', 'confetti'
        this.width = 0;
        this.height = 0;
        this.animFrame = null;
        this.active = true;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.loop();
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    setMode(newMode) {
        this.mode = newMode;
        this.particles = [];

        if (newMode === 'dust') {
            this.createDustParticles(40);
        } else if (newMode === 'bokeh') {
            this.createBokehParticles(60);
        } else if (newMode === 'heart') {
            this.createHeartParticles(100);
        } else if (newMode === 'confetti') {
            this.createConfettiParticles(120);
        }
    }

    createDustParticles(count) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 2 + 0.5,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                alpha: Math.random() * 0.5 + 0.2
            });
        }
    }

    createBokehParticles(count) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 14 + 4,
                vx: (Math.random() - 0.5) * 0.6,
                vy: -Math.random() * 1.2 - 0.3,
                alpha: Math.random() * 0.6 + 0.2,
                color: `hsla(${40 + Math.random() * 15}, 85%, 65%, `
            });
        }
    }

    createHeartParticles(count) {
        // Parametric equations for a heart shape: x = 16 sin^3(t), y = 13 cos(t) - 5 cos(2t) - 2 cos(3t) - cos(4t)
        const centerX = this.width / 2;
        const centerY = this.height / 2 - 20;

        for (let i = 0; i < count; i++) {
            const t = (i / count) * Math.PI * 2;
            const hx = 16 * Math.pow(Math.sin(t), 3);
            const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

            const targetX = centerX + hx * 12;
            const targetY = centerY + hy * 12;

            this.particles.push({
                x: centerX + (Math.random() - 0.5) * 300,
                y: centerY + (Math.random() - 0.5) * 300,
                targetX: targetX,
                targetY: targetY,
                radius: Math.random() * 3 + 1.5,
                alpha: Math.random() * 0.8 + 0.2,
                color: '#ffd700'
            });
        }
    }

    createConfettiParticles(count) {
        const colors = ['#ffd700', '#e6c278', '#ffffff', '#ffaa44', '#f5cf82'];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height - this.height,
                width: Math.random() * 10 + 6,
                height: Math.random() * 14 + 8,
                vx: (Math.random() - 0.5) * 2,
                vy: Math.random() * 3 + 2,
                rotation: Math.random() * 360,
                vRot: (Math.random() - 0.5) * 5,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
    }

    update() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        if (this.mode === 'dust') {
            this.particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = this.width;
                if (p.x > this.width) p.x = 0;
                if (p.y < 0) p.y = this.height;
                if (p.y > this.height) p.y = 0;

                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 235, 190, ${p.alpha})`;
                this.ctx.fill();
            });
        } else if (this.mode === 'bokeh') {
            this.particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.y < -20) p.y = this.height + 20;

                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = p.color + p.alpha + ')';
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = '#ffd700';
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            });
        } else if (this.mode === 'heart') {
            this.particles.forEach(p => {
                // Smooth interpolation to target heart position
                p.x += (p.targetX - p.x) * 0.04;
                p.y += (p.targetY - p.y) * 0.04;

                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = p.color;
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = '#ffd700';
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            });
        } else if (this.mode === 'confetti') {
            this.particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.vRot;

                if (p.y > this.height) {
                    p.y = -20;
                    p.x = Math.random() * this.width;
                }

                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate((p.rotation * Math.PI) / 180);
                this.ctx.fillStyle = p.color;
                this.ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
                this.ctx.restore();
            });
        }
    }

    loop() {
        if (this.active) {
            this.update();
        }
        this.animFrame = requestAnimationFrame(() => this.loop());
    }
}

window.particleEngine = new ParticleEngine('fx-canvas');
