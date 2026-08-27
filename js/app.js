/* ==========================================================================
   APP CONTROLLER & INTRO LOADING CONTROLLER (With Pakeeza & Rehan)
   ========================================================================== */

function getFourMonthsAgoDate() {
  const d = new Date();
  d.setMonth(d.getMonth() - 4);
  return d.toISOString().split('T')[0];
}

const DEFAULT_CONFIG = {
  herName: "Pakeeza",
  yourName: "Rehan",
  proposalType: "Pakeeza, Will you be mine forever?",
  startDate: getFourMonthsAgoDate(),
  customNote: "4 beautiful months together, and every second with you feels like a dream come true. You make my world infinitely brighter and more beautiful, Pakeeza."
};

class AppController {
  constructor() {
    this.config = this.loadConfig();
    this.initElements();
    this.bindEvents();
    this.applyConfig();
    this.startLoveCounter();
    this.runPreloader();
  }

  loadConfig() {
    try {
      const saved = localStorage.getItem('proposal_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.herName === "My Love" || parsed.herName === "Bella" || parsed.herName === "Apkeeza") parsed.herName = "Pakeeza";
        if (parsed.yourName === "Yours Forever" || parsed.yourName === "Alexander") parsed.yourName = "Rehan";
        if (!parsed.proposalType || parsed.proposalType === "Will you be my girlfriend?") parsed.proposalType = "Pakeeza, Will you be mine forever?";
        if (!parsed.startDate || parsed.startDate === "2024-01-01") parsed.startDate = getFourMonthsAgoDate();
        if (parsed.customNote && (parsed.customNote.includes("Bella") || parsed.customNote.includes("Apkeeza"))) {
          parsed.customNote = parsed.customNote.replace(/Bella|Apkeeza/g, "Pakeeza");
        }
        return { ...DEFAULT_CONFIG, ...parsed };
      }
      return { ...DEFAULT_CONFIG };
    } catch (e) {
      return { ...DEFAULT_CONFIG };
    }
  }

  saveConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem('proposal_config', JSON.stringify(this.config));
    this.applyConfig();
  }

  initElements() {
    this.preloader = document.getElementById('romantic-preloader');
    this.preloaderFill = document.getElementById('preloader-progress-fill');
    this.preloaderPercent = document.getElementById('preloader-percentage');
    this.preloaderMsg = document.getElementById('preloader-dynamic-msg');
    this.preloaderBtn = document.getElementById('preloader-enter-btn');

    this.heroStage = document.getElementById('hero-stage');
    this.storyStage = document.getElementById('story-stage');
    this.envelopeWrapper = document.getElementById('envelope-wrapper');
    this.openCtaBtn = document.getElementById('open-story-cta');
    this.musicToggleBtn = document.getElementById('music-toggle-btn');
    this.settingsToggleBtn = document.getElementById('settings-toggle-btn');
    this.customizerDrawer = document.getElementById('customizer-drawer');
    this.drawerCloseBtn = document.getElementById('drawer-close-btn');
    this.customizerForm = document.getElementById('customizer-form');

    // Populating customizer fields
    document.getElementById('input-her-name').value = this.config.herName;
    document.getElementById('input-your-name').value = this.config.yourName;
    document.getElementById('input-proposal-text').value = this.config.proposalType;
    document.getElementById('input-start-date').value = this.config.startDate;
    document.getElementById('input-custom-note').value = this.config.customNote;
  }

  bindEvents() {
    // Tap anywhere on preloader to dismiss once loaded or anytime
    if (this.preloader) {
      this.preloader.addEventListener('click', () => {
        this.dismissPreloader();
      });
      this.preloader.addEventListener('touchstart', () => {
        this.dismissPreloader();
      }, { passive: true });
    }

    // Envelope unsealing
    const handleOpen = () => this.unlockStory();
    if (this.envelopeWrapper) this.envelopeWrapper.addEventListener('click', handleOpen);
    if (this.openCtaBtn) this.openCtaBtn.addEventListener('click', handleOpen);

    // Music toggle
    if (this.musicToggleBtn) {
      this.musicToggleBtn.addEventListener('click', () => {
        const isPlaying = window.romanticAudio.toggle();
        this.musicToggleBtn.classList.toggle('playing', isPlaying);
        this.musicToggleBtn.innerHTML = isPlaying 
          ? '🎵 <span class="audio-waves"><span></span><span></span><span></span></span>' 
          : '🔇';
      });
    }

    // Customizer Drawer
    if (this.settingsToggleBtn) {
      this.settingsToggleBtn.addEventListener('click', () => {
        this.customizerDrawer.classList.toggle('open');
      });
    }

    if (this.drawerCloseBtn) {
      this.drawerCloseBtn.addEventListener('click', () => {
        this.customizerDrawer.classList.remove('open');
      });
    }

    // Customizer Form Submit
    if (this.customizerForm) {
      this.customizerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const updated = {
          herName: document.getElementById('input-her-name').value.trim() || DEFAULT_CONFIG.herName,
          yourName: document.getElementById('input-your-name').value.trim() || DEFAULT_CONFIG.yourName,
          proposalType: document.getElementById('input-proposal-text').value.trim() || DEFAULT_CONFIG.proposalType,
          startDate: document.getElementById('input-start-date').value || DEFAULT_CONFIG.startDate,
          customNote: document.getElementById('input-custom-note').value.trim() || DEFAULT_CONFIG.customNote
        };
        this.saveConfig(updated);
        this.customizerDrawer.classList.remove('open');

        if (window.romanticAudio) window.romanticAudio.playChime();
      });
    }

    // Reason card click micro-chimes
    document.querySelectorAll('.reason-box').forEach(box => {
      box.addEventListener('click', () => {
        if (window.romanticAudio) window.romanticAudio.playChime();
        if (window.particleEngine) {
          const rect = box.getBoundingClientRect();
          window.particleEngine.triggerConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
      });
    });
  }

  applyConfig() {
    document.querySelectorAll('.display-her-name').forEach(el => el.innerText = this.config.herName);
    document.querySelectorAll('.display-your-name').forEach(el => el.innerText = this.config.yourName);
    document.querySelectorAll('.display-proposal-text').forEach(el => el.innerText = this.config.proposalType);
    document.querySelectorAll('.display-custom-note').forEach(el => el.innerText = this.config.customNote);

    const certNames = document.getElementById('cert-names');
    if (certNames) certNames.innerText = `${this.config.herName} & ${this.config.yourName}`;
  }

  runPreloader() {
    if (!this.preloader) return;

    const messages = [
      "Please wait a moment, Pakeeza... ❤️",
      "Gathering the brightest stars... ✨",
      "Collecting our precious memories... 📸",
      "Crafting something special from the heart... 🌹",
      "Everything is ready for you, Pakeeza... 💖"
    ];

    let progress = 0;
    let msgIndex = 0;

    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 6) + 4;
      if (progress > 100) progress = 100;

      if (this.preloaderFill) this.preloaderFill.style.width = `${progress}%`;
      if (this.preloaderPercent) this.preloaderPercent.innerText = `${progress}%`;

      // Update message along checkpoints
      if (progress > 20 && msgIndex === 0) { msgIndex = 1; this.setPreloadMsg(messages[1]); }
      if (progress > 50 && msgIndex === 1) { msgIndex = 2; this.setPreloadMsg(messages[2]); }
      if (progress > 75 && msgIndex === 2) { msgIndex = 3; this.setPreloadMsg(messages[3]); }
      if (progress >= 100 && msgIndex === 3) {
        msgIndex = 4;
        this.setPreloadMsg(messages[4]);
        clearInterval(interval);

        if (this.preloaderBtn) {
          this.preloaderBtn.classList.add('ready');
        }

        // Automatically transition into the main page after 1.2 seconds!
        setTimeout(() => {
          this.dismissPreloader();
        }, 1200);
      }
    }, 120);
  }

  setPreloadMsg(text) {
    if (!this.preloaderMsg) return;
    this.preloaderMsg.style.opacity = 0;
    setTimeout(() => {
      this.preloaderMsg.innerText = text;
      this.preloaderMsg.style.opacity = 1;
    }, 200);
  }

  dismissPreloader() {
    if (window.romanticAudio) {
      window.romanticAudio.playChime();
    }
    if (window.particleEngine) {
      window.particleEngine.triggerConfettiBurst(window.innerWidth / 2, window.innerHeight / 2);
    }
    if (this.preloader) {
      this.preloader.classList.add('fade-out');
    }
  }

  unlockStory() {
    if (this.envelopeWrapper) {
      this.envelopeWrapper.classList.add('unsealing');
    }

    if (window.romanticAudio) {
      window.romanticAudio.playChime();
      if (!window.romanticAudio.isPlaying) {
        window.romanticAudio.start();
        if (this.musicToggleBtn) {
          this.musicToggleBtn.classList.add('playing');
          this.musicToggleBtn.innerHTML = '🎵 <span class="audio-waves"><span></span><span></span><span></span></span>';
        }
      }
    }

    setTimeout(() => {
      this.heroStage.style.display = 'none';
      this.storyStage.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 700);
  }

  startLoveCounter() {
    const update = () => {
      const start = new Date(this.config.startDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, now - start);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      document.querySelectorAll('.count-days, #count-days').forEach(el => el.innerText = String(days).padStart(2, '0'));
      document.querySelectorAll('.count-hours, #count-hours').forEach(el => el.innerText = String(hours).padStart(2, '0'));
      document.querySelectorAll('.count-mins, #count-mins').forEach(el => el.innerText = String(minutes).padStart(2, '0'));
      document.querySelectorAll('.count-secs, #count-secs').forEach(el => el.innerText = String(seconds).padStart(2, '0'));
    };

    update();
    setInterval(update, 1000);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
});
