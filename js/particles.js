/* ==========================================================================
   ROMANTIC PARTICLES & CANVAS ENGINE
   ========================================================================== */

class ParticleEngine {
  constructor() {
    this.canvas = document.getElementById('particle-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.confetti = [];
    this.stars = [];
    this.shootingStars = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.isCelebration = false;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.createBackgroundStars(70);
    this.createFloatingHearts(25);
    this.setupCursorEffects();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createBackgroundStars(count) {
    this.stars = [];
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }
  }

  createFloatingHearts(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 14 + 10,
        speedY: Math.random() * 0.8 + 0.3,
        speedX: (Math.random() - 0.5) * 0.5,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 1.5,
        opacity: Math.random() * 0.5 + 0.2,
        color: ['#ff4d79', '#ff85a2', '#ffd166', '#ffccd5'][Math.floor(Math.random() * 4)]
      });
    }
  }

  setupCursorEffects() {
    let throttle = 0;
    const createSparkle = (x, y) => {
      if (Date.now() - throttle < 60) return;
      throttle = Date.now();

      const el = document.createElement('div');
      el.className = 'heart-cursor-spark';
      const symbols = ['💖', '✨', '🌸', '💕', '⭐'];
      el.innerText = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      document.body.appendChild(el);

      setTimeout(() => el.remove(), 1200);
    };

    window.addEventListener('mousemove', (e) => createSparkle(e.clientX, e.clientY));
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        createSparkle(e.touches[0].clientX, e.touches[0].clientY);
      }
    });
  }

  triggerConfettiBurst(x = this.width / 2, y = this.height / 2) {
    this.isCelebration = true;
    const colors = ['#ff2d60', '#ff85a2', '#ffd166', '#ffffff', '#ff99c8', '#a0c4ff'];
    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 12 + 4;
      this.confetti.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 3,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 15,
        gravity: 0.25,
        drag: 0.96,
        opacity: 1,
        isHeart: Math.random() > 0.4
      });
    }
  }

  drawHeart(x, y, size, color, opacity, rotation = 0) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate((rotation * Math.PI) / 180);
    this.ctx.fillStyle = color;
    this.ctx.globalAlpha = opacity;
    this.ctx.beginPath();
    const topCurveHeight = size * 0.3;
    this.ctx.moveTo(0, topCurveHeight);
    this.ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    this.ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size * 1.3);
    this.ctx.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
    this.ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
    this.ctx.fill();
    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Twinkling Stars
    this.stars.forEach(star => {
      star.twinklePhase += star.twinkleSpeed;
      const currentOpacity = star.opacity + Math.sin(star.twinklePhase) * 0.3;
      this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(1, currentOpacity))})`;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // 2. Draw Floating Hearts
    this.particles.forEach(p => {
      p.y -= p.speedY;
      p.x += Math.sin(p.y * 0.01) * p.speedX;
      p.rotation += p.rotSpeed;

      if (p.y < -30) {
        p.y = this.height + 20;
        p.x = Math.random() * this.width;
      }

      this.drawHeart(p.x, p.y, p.size, p.color, p.opacity, p.rotation);
    });

    // 3. Draw & Update Confetti if Celebration
    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const c = this.confetti[i];
      c.x += c.vx;
      c.y += c.vy;
      c.vy += c.gravity;
      c.vx *= c.drag;
      c.vy *= c.drag;
      c.rotation += c.rotSpeed;
      c.opacity -= 0.007;

      if (c.opacity <= 0 || c.y > this.height + 50) {
        this.confetti.splice(i, 1);
        continue;
      }

      if (c.isHeart) {
        this.drawHeart(c.x, c.y, c.size, c.color, c.opacity, c.rotation);
      } else {
        this.ctx.save();
        this.ctx.translate(c.x, c.y);
        this.ctx.rotate((c.rotation * Math.PI) / 180);
        this.ctx.fillStyle = c.color;
        this.ctx.globalAlpha = c.opacity;
        this.ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.6);
        this.ctx.restore();
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

window.particleEngine = null;
window.addEventListener('DOMContentLoaded', () => {
  window.particleEngine = new ParticleEngine();
});
