/* ==========================================================================
   PROPOSAL INTERACTION ENGINE (Touch & Mobile Enhanced)
   ========================================================================== */

class ProposalEngine {
  constructor() {
    this.btnNo = document.getElementById('btn-no');
    this.btnYes = document.getElementById('btn-yes');
    this.noQuip = document.getElementById('no-quip-toast');
    this.celebrationModal = document.getElementById('celebration-modal');
    this.celebrationClose = document.getElementById('celebration-close-btn');
    this.arena = document.getElementById('proposal-arena');
    
    this.noAttempts = 0;
    this.yesScale = 1;
    this.quips = [
      "Wait, reconsider! 🥺",
      "Is your finger slipping? 😜",
      "Wrong button silly! 💕",
      "There's only one choice! ✨",
      "Nice try, but you're mine! 🥰",
      "Error 404: 'No' not found! 💖",
      "My heart only hears YES! 🌹",
      "You're stuck with me forever! 💍"
    ];

    this.init();
  }

  init() {
    if (!this.btnNo || !this.btnYes) return;

    // Mouse hover (Desktop)
    this.btnNo.addEventListener('mouseenter', (e) => this.dodge(e));
    
    // Touch start & Touch move (Mobile Phones & Tablets)
    const handleTouch = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.dodge(e);
    };

    this.btnNo.addEventListener('touchstart', handleTouch, { passive: false });
    this.btnNo.addEventListener('pointerdown', handleTouch);
    this.btnNo.addEventListener('click', (e) => {
      e.preventDefault();
      this.dodge(e);
    });

    // YES Button Click Handler
    this.btnYes.addEventListener('click', () => this.sayYes());

    // Close Celebration Modal
    if (this.celebrationClose) {
      this.celebrationClose.addEventListener('click', () => {
        this.celebrationModal.classList.remove('active');
      });
    }
  }

  dodge(e) {
    this.noAttempts++;
    
    // Trigger mobile haptic feedback if supported
    if (navigator.vibrate) {
      try {
        navigator.vibrate(40);
      } catch (err) {}
    }

    // Play chime sound
    if (window.romanticAudio) {
      window.romanticAudio.playChime();
    }

    // Calculate safe boundaries inside the arena box
    const arenaRect = this.arena.getBoundingClientRect();
    const btnRect = this.btnNo.getBoundingClientRect();

    const isMobile = window.innerWidth <= 600;
    const maxX = isMobile 
      ? Math.max(50, (arenaRect.width - btnRect.width) / 2 - 10)
      : Math.max(90, (arenaRect.width - btnRect.width) / 2);
    const maxY = isMobile ? 45 : 65;

    let randomX = (Math.random() - 0.5) * 2 * maxX;
    let randomY = (Math.random() - 0.5) * 2 * maxY;

    // Ensure it doesn't land on same spot
    if (Math.abs(randomX) < 30) randomX = randomX >= 0 ? 50 : -50;

    this.btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;

    // Show playful cute quip
    const randomQuip = this.quips[this.noAttempts % this.quips.length];
    this.noQuip.innerText = randomQuip;
    this.noQuip.classList.add('show');

    // Grow the YES button so she's guided naturally to YES!
    this.yesScale = Math.min(1.6, 1 + this.noAttempts * 0.07);
    this.btnYes.style.transform = `scale(${this.yesScale})`;

    setTimeout(() => {
      this.noQuip.classList.remove('show');
    }, 1600);
  }

  sayYes() {
    // Haptic burst on phone
    if (navigator.vibrate) {
      try {
        navigator.vibrate([100, 50, 100, 50, 150]);
      } catch (err) {}
    }

    // 1. Play Grand Fanfare & Start Romantic Melody
    if (window.romanticAudio) {
      window.romanticAudio.playGrandFanfare();
      if (!window.romanticAudio.isPlaying) {
        window.romanticAudio.start();
        const musicBtn = document.getElementById('music-toggle-btn');
        if (musicBtn) {
          musicBtn.classList.add('playing');
          musicBtn.innerHTML = '🎵 <span class="audio-waves"><span></span><span></span><span></span></span>';
        }
      }
    }

    // 2. Trigger Multiple Heart Confetti Bursts
    if (window.particleEngine) {
      const triggerMultipleBursts = (count = 5) => {
        for (let i = 0; i < count; i++) {
          setTimeout(() => {
            const rx = Math.random() * window.innerWidth;
            const ry = Math.random() * (window.innerHeight * 0.65);
            window.particleEngine.triggerConfettiBurst(rx, ry);
          }, i * 300);
        }
      };
      triggerMultipleBursts(6);
    }

    // 3. Open Celebration Modal
    setTimeout(() => {
      this.celebrationModal.classList.add('active');
    }, 350);
  }
}

window.proposalEngine = null;
window.addEventListener('DOMContentLoaded', () => {
  window.proposalEngine = new ProposalEngine();
});
