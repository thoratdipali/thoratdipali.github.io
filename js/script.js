/**
 * Proposal Website — script.js
 * ============================
 * Sections:
 *  A. Configuration — EDIT THIS SECTION to customize the site
 *  B. Utility helpers
 *  C. Ambient canvas (floating hearts/petals)
 *  D. Lock screen logic
 *  E. Story sequence logic
 *  F. Proposal section logic (letter animation, No-button dodge)
 *  G. Celebration (canvas confetti + staged reveals)
 *  H. Global init
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   A. CONFIGURATION — EDIT THIS SECTION
   ═══════════════════════════════════════════════════════════════ */

const CONFIG = {

  /**
   * LOCK SCREEN
   * -----------
   * The "correct" password — a secret romantic code.
   * Change this to your chosen password/phrase.
   */
  CORRECT_PASSWORD: '09061970',   // ← CHANGE THIS to your secret code

  /**
   * LOCK SCREEN MESSAGES
   */
  LOCK_HEADING: 'A Little Secret Awaits You…',
  LOCK_SUBTEXT: 'Only someone special knows the way in.',
  LOCK_PLACEHOLDER: 'Enter the secret code',
  LOCK_BUTTON_TEXT: 'Unlock ✨',
  
  LOCK_ERROR_MESSAGES: [
    "romati 11042000 ❤️",
    "Think of our special date, my love 💕",
    "Remember the day that changed everything 💛",
    "Our beginning… try that date, sweetheart ✨",
    "The day we became 'us'… romati 11042000 💝",
  ],
  
  LOCK_SUCCESS_MESSAGE: 'You found your way in… ❤️',
  LOCK_COOLDOWN_SECONDS: 5,

  /**
   * HER NAME — used in the proposal text and celebration.
   */
  HER_NAME: 'Dipali',

  /**
   * SENDER NAME — appears as the signature in Celebration.
   */
  SENDER_NAME: 'Kunal',

  /**
   * STORY CHAPTERS — 10 entries, one per chapter.
   * Each has: title, label (Roman numeral), and text.
   * To update: just edit the "text" field of each chapter.
   * Photos map to img/photo1.jpg … img/photo10.jpg automatically.
   */
  CHAPTERS: [
    {
      label: 'Chapter I',
      title: 'The First Meeting',
      text: `I didn't know what was happening that day. I just knew something
             was different — the way you laughed, the way you spoke, the way
             the room felt a little less ordinary when you were in it.
             I didn't know yet. But something in me quietly did.`,
    },
    {
      label: 'Chapter II',
      title: 'The Nerves',
      text: `I rehearsed things to say. I typed and deleted messages more times
             than I'll ever admit. You made me nervous in the very best way —
             the kind that tells you something real is beginning,
             even before you have the words for it.`,
    },
    {
      label: 'Chapter III',
      title: 'The First Spark',
      text: `There was a moment — a laugh, or maybe the tail end of a late
             conversation — when I stopped pretending this was nothing.
             Something had quietly caught fire, and I think we both felt it
             at the same time, and didn't say anything, and that said everything.`,
    },
    {
      label: 'Chapter IV',
      title: 'Getting Closer',
      text: `I learned you: your habits, your humour, the face you make when
             you're about to say something sharp and funny. The inside jokes were
             forming before I even noticed. The world started sorting itself
             into before-you and after-you.`,
    },
    {
      label: 'Chapter V',
      title: 'Through the Distance',
      text: `There were harder days — stretched schedules, missed calls, the
             peculiar ache of wanting someone nearby when they can't be.
             But you showed me that the hard parts don't break what's real.
             They just show you what it's made of.`,
    },
    {
      label: 'Chapter VI',
      title: 'Becoming a Team',
      text: `There was a shift — subtle and then sudden — from "I" to "we."
             Showing up for the hard days. Holding space when it was needed.
             Realising that "home" had quietly become a person, not a place.`,
    },
    {
      label: 'Chapter VII',
      title: 'The Adventures',
      text: `Every trip, every spontaneous plan, every moment we decided to
             just go — you make ordinary places feel worth remembering.
             I'd go anywhere with you. I plan to.`,
    },
    {
      label: 'Chapter VIII',
      title: 'The Quiet Moments',
      text: `The unremarkable ones are the ones I love most. A lazy afternoon.
             A long call about nothing. The silence that doesn't need filling.
             In the quiet, I found my favourite place in the world —
             being near you.`,
    },
    {
      label: 'Chapter IX',
      title: 'The Realisation',
      text: `It wasn't one moment — it was the accumulation of a hundred small ones.
             And then one day, it was just clear: I don't want to do this life
             with anyone else. I want to do it with you.`,
    },
    {
      label: 'Chapter X',
      title: 'Today, Looking Forward',
      text: `Here we are. All those chapters — every nervous moment, every quiet
             afternoon, every hard day we figured out together — they've all been
             leading here. And now, there's just one thing left to ask…`,
    },
  ],

  /**
   * PROPOSAL QUESTION — the line drawn letter-by-letter.
   */
  PROPOSAL_QUESTION: 'Will you marry me?',

  /**
   * CELEBRATION TEXT — three paragraphs shown after "Yes".
   * Update to personalise the closing message.
   */
  CELEB_PARAGRAPHS: [
    `From the first nervous message to a hundred quiet evenings —
     from every chapter we lived and every one we haven't written yet —
     thank you for being the story I never want to finish.`,

    `You are my favourite adventure, my favourite silence,
     my favourite reason to come home.
     Now we get to build the rest of it, together.`,

    `All my love, always.`,
  ],

  /**
   * NO-BUTTON DODGE MESSAGES — cycling witty messages shown when
   * she moves toward the No button. Keep them playful, never mean.
   */
  NO_DODGE_MESSAGES: [
    "That button doesn't want to be pressed 😄",
    "Oh no you don't…",
    "Not so fast! 🥰",
    "Nope, nope, nope…",
    "This one's shy.",
    "Close, but I believe in you. Try Yes. 💛",
  ],

  /**
   * FINAL DECISION SECTION
   */
  FINAL_QUESTION: 'So… what do you say?',
  FINAL_SUBTEXT: 'This is your moment. Take all the time you need.',
  
  FINAL_YES_MESSAGE: 'You've made me the happiest person alive. This is just the beginning of our forever. ❤️',
  
  FINAL_NO_MESSAGE_HEADING: 'I Understand, and I Respect Your Heart',
  FINAL_NO_MESSAGE: `Dipali,

Thank you for being honest with me. I know this wasn't an easy decision, and I respect your feelings completely. You've always been someone I admire — your strength, your kindness, the way you see the world.

If this isn't our time, then maybe we'll find each other again in another life, another universe, where everything aligns the way it should.

I'll always treasure the moments we shared, the conversations that felt like coming home, and the way you made ordinary days feel extraordinary.

You deserve all the happiness in the world. I hope you find someone who loves you the way you deserve to be loved — completely, unconditionally, and without hesitation.

Thank you for everything. For the memories, the laughter, the lessons. For being you.

Until we meet again, in this life or the next.

With love and respect always,
— Kunal`,

  VIDEO_FILE: 'video/proposal.mp4',  // ← Path to your video file
};

/* ═══════════════════════════════════════════════════════════════
   B. UTILITY HELPERS
   ═══════════════════════════════════════════════════════════════ */

/** Returns true if prefers-reduced-motion is set */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Throttle a function call */
function throttle(fn, ms) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn.apply(this, args);
    }
  };
}

/** Clamp a number between min and max */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/** Random number in [min, max) */
function rand(min, max) {
  return Math.random() * (max - min) + min;
}


/* ═══════════════════════════════════════════════════════════════
   C. AMBIENT CANVAS — floating hearts / petals
   ═══════════════════════════════════════════════════════════════ */

const Ambient = (() => {
  const canvas  = document.getElementById('ambientCanvas');
  const ctx     = canvas.getContext('2d');
  let W, H;
  let particles = [];
  let animFrame;
  let mouseX = 0.5, mouseY = 0.5; // normalised [0,1]
  let active = false;

  const HEART_COUNT = 22;
  const PETAL_COUNT = 10;

  /** Draw a heart shape centred at (x,y) with given size */
  function drawHeart(x, y, size, alpha, color) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle   = color;
    ctx.beginPath();
    // Simple heart parametric
    ctx.moveTo(x, y + size * 0.35);
    ctx.bezierCurveTo(
      x, y,
      x - size * 0.6, y,
      x - size * 0.6, y - size * 0.35
    );
    ctx.bezierCurveTo(
      x - size * 0.6, y - size * 0.75,
      x, y - size * 0.75,
      x, y - size * 0.35
    );
    ctx.bezierCurveTo(
      x, y - size * 0.75,
      x + size * 0.6, y - size * 0.75,
      x + size * 0.6, y - size * 0.35
    );
    ctx.bezierCurveTo(
      x + size * 0.6, y,
      x, y,
      x, y + size * 0.35
    );
    ctx.fill();
    ctx.restore();
  }

  /** Draw an ellipse petal */
  function drawPetal(x, y, w, h, rotation, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = '#C9A76A';
    ctx.beginPath();
    ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function createParticle(type) {
    const isHeart = type === 'heart';
    return {
      type,
      x: rand(0, W),
      y: rand(-H * 0.1, H * 1.1),
      size: isHeart ? rand(6, 14) : rand(4, 10),
      speedY: rand(0.2, 0.7) * (isHeart ? 0.8 : 0.5),
      speedX: rand(-0.15, 0.15),
      drift:  rand(-0.003, 0.003),      // gentle horizontal drift
      phase:  rand(0, Math.PI * 2),     // for sine wave movement
      alpha:  rand(0.05, 0.18),
      alphaTarget: rand(0.06, 0.20),
      rotation: rand(0, Math.PI * 2),
      rotSpeed: rand(-0.004, 0.004),
      color: isHeart
        ? (Math.random() > 0.5 ? '#7A1F35' : '#C9A76A')
        : '#C9A76A',
      w: rand(3, 7),
      h: rand(6, 12),
    };
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < HEART_COUNT; i++) {
      particles.push(createParticle('heart'));
    }
    for (let i = 0; i < PETAL_COUNT; i++) {
      particles.push(createParticle('petal'));
    }
  }

  function tick(t) {
    if (!active) return;
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      // Gentle sine drift + mouse parallax with React-style easing
      const sineOffset = Math.sin(t * 0.0008 + p.phase) * 1.5;
      const parallaxX  = (mouseX - 0.5) * 20;
      const parallaxY  = (mouseY - 0.5) * 15;

      // Apply React-spring style easing
      p.x += p.speedX + p.drift + sineOffset * 0.02;
      p.y -= p.speedY;
      p.rotation += p.rotSpeed;

      // Soft alpha breathing with cubic easing
      const alphaDiff = p.alphaTarget - p.alpha;
      p.alpha += alphaDiff * 0.012;
      if (Math.abs(alphaDiff) < 0.002) {
        p.alphaTarget = rand(0.06, 0.25);
      }

      // Reset if drifted off screen
      if (p.y < -40) {
        p.y = H + 30;
        p.x = rand(0, W);
      }
      if (p.x < -40) p.x = W + 30;
      if (p.x > W + 40) p.x = -30;

      const drawX = p.x + parallaxX;
      const drawY = p.y + parallaxY;

      if (p.type === 'heart') {
        drawHeart(drawX, drawY, p.size, p.alpha, p.color);
      } else {
        drawPetal(drawX, drawY, p.w, p.h, p.rotation, p.alpha * 0.8);
      }
    }

    animFrame = requestAnimationFrame(tick);
  }

  function start() {
    if (active) return;
    active = true;
    animFrame = requestAnimationFrame(tick);
  }

  function stop() {
    active = false;
    cancelAnimationFrame(animFrame);
    ctx.clearRect(0, 0, W, H);
  }

  /** Slow down hearts for the proposal moment */
  function slowDown() {
    particles.forEach(p => {
      p.speedY *= 0.3;
      p.speedX *= 0.3;
      p.alpha  *= 0.4;
    });
  }

  /** Restore normal speed */
  function normalSpeed() {
    particles.forEach(p => {
      p.speedY = rand(0.2, 0.7) * (p.type === 'heart' ? 0.8 : 0.5);
      p.speedX = rand(-0.15, 0.15);
    });
  }

  // Track mouse / touch for parallax
  document.addEventListener('mousemove', throttle((e) => {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;
  }, 50));

  document.addEventListener('touchmove', throttle((e) => {
    if (e.touches.length > 0) {
      mouseX = e.touches[0].clientX / window.innerWidth;
      mouseY = e.touches[0].clientY / window.innerHeight;
    }
  }, 50), { passive: true });

  window.addEventListener('resize', throttle(resize, 200));

  return { init, start, stop, slowDown, normalSpeed };
})();


/* ═══════════════════════════════════════════════════════════════
   D. LOCK SCREEN — ROMANTIC PASSWORD
   ═══════════════════════════════════════════════════════════════ */

const LockScreen = (() => {
  let errorIndex = 0;
  let cooldownActive = false;

  /* ── Set text content ── */
  function setText() {
    const headingEl = document.getElementById('lockHeading');
    const subtextEl = document.getElementById('lockSubtext');
    const passwordInput = document.getElementById('passwordInput');
    const unlockBtn = document.getElementById('unlockBtn');
    
    if (headingEl) headingEl.textContent = CONFIG.LOCK_HEADING;
    if (subtextEl) subtextEl.textContent = CONFIG.LOCK_SUBTEXT;
    if (passwordInput) passwordInput.placeholder = CONFIG.LOCK_PLACEHOLDER;
    if (unlockBtn) {
      const btnText = unlockBtn.querySelector('.btn-text');
      if (btnText) btnText.textContent = CONFIG.LOCK_BUTTON_TEXT;
    }
  }

  /* ── Error state ── */
  function showError() {
    if (cooldownActive) return;

    const card = document.getElementById('locketCard');
    const msgEl = document.getElementById('lockMessage');
    const msgText = document.getElementById('lockMsgText');

    const msg = CONFIG.LOCK_ERROR_MESSAGES[errorIndex % CONFIG.LOCK_ERROR_MESSAGES.length];
    errorIndex++;

    if (card) {
      card.classList.remove('shake');
      void card.offsetWidth;
      card.classList.add('shake');
      card.addEventListener('animationend', () => {
        card.classList.remove('shake');
      }, { once: true });
    }

    if (msgText) msgText.textContent = msg;
    if (msgEl) msgEl.classList.add('visible');

    startCooldown();
  }

  /* ── Cooldown mechanism ── */
  function startCooldown() {
    const unlockBtn = document.getElementById('unlockBtn');
    const passwordInput = document.getElementById('passwordInput');
    const msgEl = document.getElementById('lockMessage');
    
    cooldownActive = true;
    if (unlockBtn) unlockBtn.disabled = true;
    if (passwordInput) passwordInput.disabled = true;

    let timeLeft = CONFIG.LOCK_COOLDOWN_SECONDS;
    const btnText = unlockBtn ? unlockBtn.querySelector('.btn-text') : null;
    const originalBtnText = btnText ? btnText.textContent : 'Unlock ✨';

    const countdownInterval = setInterval(() => {
      if (btnText) btnText.textContent = `Wait ${timeLeft}s...`;
      timeLeft--;

      if (timeLeft < 0) {
        clearInterval(countdownInterval);
        cooldownActive = false;
        if (unlockBtn) {
          unlockBtn.disabled = false;
          unlockBtn.style.opacity = '1';
          unlockBtn.style.cursor = 'pointer';
        }
        if (passwordInput) passwordInput.disabled = false;
        if (btnText) btnText.textContent = originalBtnText;
        if (msgEl) msgEl.classList.remove('visible');
      }
    }, 1000);
  }

  /* ── Wax seal crack ── */
  function crackSeal() {
    const sealCracks = document.getElementById('sealCracks');
    if (sealCracks) {
      sealCracks.style.transition = 'opacity 0.3s ease';
      sealCracks.style.opacity = '1';
    }
  }

  /* ── Full unlock sequence ── */
  function unlock() {
    const screen = document.getElementById('lockScreen');
    const successEl = document.getElementById('lockSuccess');
    
    crackSeal();
    
    if (successEl) {
      const successText = successEl.querySelector('.lock-success-text');
      if (successText) successText.textContent = CONFIG.LOCK_SUCCESS_MESSAGE;
    }
    
    setTimeout(() => {
      if (successEl) successEl.classList.add('visible');
      if (screen) {
        screen.style.background = 'linear-gradient(135deg, rgba(250,243,232,1) 0%, rgba(228,200,150,0.4) 50%, rgba(250,243,232,1) 100%)';
      }
    }, 400);
    
    setTimeout(() => {
      if (screen) screen.classList.add('unlocking');
      Story.init();
      Story.show();
    }, 2200);
    
    setTimeout(() => {
      if (screen) screen.remove();
    }, 3200);
  }

  /* ── Validate password ── */
  function validate() {
    if (cooldownActive) return;

    const passwordInput = document.getElementById('passwordInput');
    const unlockBtn = document.getElementById('unlockBtn');
    
    if (!passwordInput) return;

    const entered = passwordInput.value.trim().toLowerCase();
    if (!entered) return;

    const correct = CONFIG.CORRECT_PASSWORD.toLowerCase();

    if (entered === correct) {
      if (unlockBtn) unlockBtn.disabled = true;
      passwordInput.disabled = true;
      unlock();
    } else {
      passwordInput.value = '';
      showError();
    }
  }

  /* ── Public init ── */
  function init() {
    const unlockBtn = document.getElementById('unlockBtn');
    const passwordInput = document.getElementById('passwordInput');
    
    if (!unlockBtn || !passwordInput) {
      console.error('LockScreen: Required elements not found');
      return;
    }
    
    setText();
    
    unlockBtn.disabled = false;
    unlockBtn.addEventListener('click', validate);
    
    passwordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !cooldownActive) {
        validate();
      }
    });

    function syncBtnState() {
      const isEmpty = passwordInput.value.trim().length === 0;
      unlockBtn.style.opacity = (isEmpty || cooldownActive) ? '0.5' : '1';
      unlockBtn.style.cursor  = (isEmpty || cooldownActive) ? 'not-allowed' : 'pointer';
    }

    passwordInput.addEventListener('input',  syncBtnState);
    passwordInput.addEventListener('keyup',  syncBtnState);
    passwordInput.addEventListener('change', syncBtnState);
    syncBtnState(); // set initial state
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════════
   E. STORY SEQUENCE
   ═══════════════════════════════════════════════════════════════ */

const Story = (() => {
  const section      = document.getElementById('storySection');
  const slides       = Array.from(document.querySelectorAll('.story-slide'));
  const progressFill = document.getElementById('progressFill');
  const progressDots = document.getElementById('progressDots');
  const progressLabel= document.getElementById('progressLabel');
  const prevBtn      = document.getElementById('prevBtn');
  const nextBtn      = document.getElementById('nextBtn');
  const transitionSeal = document.getElementById('transitionSeal');
  const musicToggle  = document.getElementById('musicToggle');
  const bgAudio      = document.getElementById('bgAudio');

  let current = 0;
  const total = slides.length;

  /** Build progress dots */
  function buildDots() {
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.className = 'progress-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-hidden', 'true');
      progressDots.appendChild(dot);
    }
  }

  /** Update progress indicator */
  function updateProgress() {
    const pct = ((current + 1) / total) * 100;
    progressFill.style.width = `${pct}%`;

    const dots = progressDots.querySelectorAll('.progress-dot');
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.classList.toggle('done',   i < current);
    });

    progressLabel.textContent = `Chapter ${current + 1} of ${total}`;
    prevBtn.disabled = current === 0;

    // Last slide: show transition seal, change next button text
    if (current === total - 1) {
      nextBtn.querySelector('span').textContent = 'The question…';
      transitionSeal.classList.add('visible');
    } else {
      nextBtn.querySelector('span').textContent = 'Continue the story';
      transitionSeal.classList.remove('visible');
    }
  }

  /** Show a specific slide index with enter/exit animation */
  function goTo(index, direction = 'forward') {
    if (index < 0 || index >= total) return;

    const outSlide = slides[current];
    const inSlide  = slides[index];

    // Exit current
    outSlide.classList.remove('active', 'entering');
    outSlide.classList.add('exiting');
    outSlide.addEventListener('animationend', () => {
      outSlide.classList.remove('exiting');
      outSlide.style.display = 'none';
    }, { once: true });

    // Slight delay before showing new slide
    setTimeout(() => {
      current = index;
      inSlide.style.display = '';   // un-hide (display comes from .active)
      inSlide.classList.add('active', 'entering');
      inSlide.classList.remove('exiting');

      // Remove 'entering' after animation so CSS transitions don't fight
      inSlide.addEventListener('animationend', () => {
        inSlide.classList.remove('entering');
      }, { once: true });

      updateProgress();

      // Tilt effect (mouse-aware) — initialise for this slide's photo
      initTiltEffect(inSlide.querySelector('.slide-photo'));
    }, 320);
  }

  /** Subtle 3D tilt on photo with mouse/touch proximity - React-style smooth */
  function initTiltEffect(img) {
    if (!img || prefersReducedMotion()) return;

    const frame = img.closest('.slide-photo-frame');
    if (!frame) return;

    let currentRotX = 0;
    let currentRotY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let rafId = null;

    function lerp(start, end, factor) {
      return start + (end - start) * factor;
    }

    function animate() {
      // React-spring style interpolation
      currentRotX = lerp(currentRotX, targetRotX, 0.15);
      currentRotY = lerp(currentRotY, targetRotY, 0.15);

      img.style.transform =
        `perspective(800px) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg) scale(1.05)`;

      // Continue animation if not at target
      if (Math.abs(currentRotX - targetRotX) > 0.01 || Math.abs(currentRotY - targetRotY) > 0.01) {
        rafId = requestAnimationFrame(animate);
      }
    }

    function onMove(clientX, clientY) {
      const rect   = frame.getBoundingClientRect();
      const centreX = rect.left + rect.width / 2;
      const centreY = rect.top  + rect.height / 2;
      targetRotX = clamp((clientY - centreY) / rect.height * -8, -6, 6);
      targetRotY = clamp((clientX - centreX) / rect.width  *  8, -6, 6);

      if (!rafId) {
        rafId = requestAnimationFrame(animate);
      }
    }

    function onLeave() {
      targetRotX = 0;
      targetRotY = 0;
      if (!rafId) {
        rafId = requestAnimationFrame(animate);
      }
    }

    // Remove old listeners by cloning (simple way)
    const newImg = img.cloneNode(true);
    img.parentNode.replaceChild(newImg, img);

    frame.addEventListener('mousemove', throttle((e) => {
      onMove(e.clientX, e.clientY);
    }, 16)); // ~60fps

    frame.addEventListener('mouseleave', onLeave);

    frame.addEventListener('touchmove', throttle((e) => {
      if (e.touches.length > 0) onMove(e.touches[0].clientX, e.touches[0].clientY);
    }, 16), { passive: true });

    frame.addEventListener('touchend', onLeave);
  }

  /** Music toggle */
  function initMusic() {
    musicToggle.addEventListener('click', () => {
      if (bgAudio.paused) {
        bgAudio.play().catch(() => {/* autoplay blocked silently */});
        musicToggle.classList.add('playing');
        musicToggle.setAttribute('aria-label', 'Pause background music');
      } else {
        bgAudio.pause();
        musicToggle.classList.remove('playing');
        musicToggle.setAttribute('aria-label', 'Play background music');
      }
    });

    // Hide toggle if no audio source
    if (!bgAudio.querySelector('source') && !bgAudio.src) {
      musicToggle.style.display = 'none';
    }
  }

  function next() {
    if (current < total - 1) {
      goTo(current + 1);
    } else {
      // Move to proposal
      Proposal.show();
    }
  }

  function prev() {
    if (current > 0) goTo(current - 1);
  }

  function init() {
    buildDots();
    initMusic();

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!section.classList.contains('hidden')) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next();
        if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   prev();
      }
    });
  }

  function show() {
    section.classList.remove('hidden');

    // Show first slide
    slides[0].classList.add('active');
    initTiltEffect(slides[0].querySelector('.slide-photo'));
    updateProgress();

    // Start ambient
    Ambient.start();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  return { init, show };
})();


/* ═══════════════════════════════════════════════════════════════
   F. PROPOSAL SECTION
   ═══════════════════════════════════════════════════════════════ */

const Proposal = (() => {
  const section       = document.getElementById('proposalSection');
  const questionEl    = document.getElementById('proposalQuestion');
  const buttonsEl     = document.getElementById('proposalButtons');
  const noBtn         = document.getElementById('noBtn');
  const noOops        = document.getElementById('noOops');
  const yesBtn        = document.getElementById('yesBtn');

  let dodgeCount   = 0;
  let noBtnFixed   = false;
  let oopsTimer    = null;

  /** Animate the proposal question letter by letter with React-style stagger */
  function animateQuestion() {
    const text  = CONFIG.PROPOSAL_QUESTION;
    questionEl.innerHTML = '';

    const chars = [...text];
    chars.forEach((ch, i) => {
      const span = document.createElement('span');
      span.className   = 'char';
      span.textContent = ch === ' ' ? '\u00A0' : ch;   // non-breaking space
      span.setAttribute('aria-hidden', 'true');
      questionEl.appendChild(span);

      // React-spring inspired stagger with variable easing
      const baseDelay = 400;
      const stagger = i * 65;
      const delay = baseDelay + stagger + (Math.random() * 20); // slight randomness
      
      setTimeout(() => {
        span.style.transition = 'opacity 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        span.classList.add('visible');
      }, delay);
    });

    // Screen-reader full text
    questionEl.setAttribute('aria-label', text);
  }

  /** Get the current screen-safe bounding area for the No button dodge */
  function safeArea() {
    return {
      minX: 10,
      minY: 10,
      maxX: window.innerWidth  - noBtn.offsetWidth  - 10,
      maxY: window.innerHeight - noBtn.offsetHeight - 10,
    };
  }

  /** Move No button to a random visible position with React-spring style motion */
  function dodgeNoBtn(e) {
    if (prefersReducedMotion()) return; // just don't dodge

    dodgeCount++;

    // Convert to fixed positioning once
    if (!noBtnFixed) {
      const rect    = noBtn.getBoundingClientRect();
      noBtn.style.position = 'fixed';
      noBtn.style.left     = rect.left + 'px';
      noBtn.style.top      = rect.top  + 'px';
      noBtn.style.zIndex   = '200';
      noBtn.style.margin   = '0';
      // React-spring style cubic-bezier for bouncy feel
      noBtn.style.transition = 'left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.3s ease';
      noBtnFixed = true;
    }

    // Add shake effect
    noBtn.style.transform = 'scale(0.95) rotate(-5deg)';
    setTimeout(() => {
      noBtn.style.transform = 'scale(1) rotate(0deg)';
    }, 150);

    const area   = safeArea();
    let newX, newY;
    let attempts = 0;
    const cursorX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : area.maxX / 2);
    const cursorY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : area.maxY / 2);

    // Pick a position that is at least 180px from cursor for better UX
    do {
      newX = rand(area.minX, area.maxX);
      newY = rand(area.minY, area.maxY);
      attempts++;
    } while (
      attempts < 25 &&
      Math.hypot(newX - cursorX, newY - cursorY) < 180
    );

    noBtn.style.left = newX + 'px';
    noBtn.style.top  = newY + 'px';

    // Show playful message with animation
    const msg = CONFIG.NO_DODGE_MESSAGES[dodgeCount % CONFIG.NO_DODGE_MESSAGES.length];
    noOops.textContent = msg;
    noOops.style.animation = 'bounceInTop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both';
    noOops.classList.add('visible');

    clearTimeout(oopsTimer);
    oopsTimer = setTimeout(() => {
      noOops.classList.remove('visible');
    }, 2200);
  }

  function init() {
    // No button events — dodge on hover (mouse) and tap-start (touch)
    noBtn.addEventListener('mouseenter', dodgeNoBtn);
    noBtn.addEventListener('touchstart', dodgeNoBtn, { passive: true });

    // No click does nothing (shouldn't be reachable, but just in case)
    noBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dodgeNoBtn(e);
    });

    // Yes button → celebration
    yesBtn.addEventListener('click', () => {
      Celebration.show();
    });
  }

  function show() {
    Ambient.slowDown();

    // Hide story section
    const storySection = document.getElementById('storySection');
    storySection.style.transition = 'opacity 0.7s ease';
    storySection.style.opacity    = '0';

    setTimeout(() => {
      storySection.classList.add('hidden');
      section.classList.remove('hidden');
      section.style.opacity = '0';
      section.style.transition = 'opacity 0.9s ease';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          section.style.opacity = '1';
        });
      });

      // Slight delay before animating the question
      setTimeout(() => {
        animateQuestion();
        // Show buttons after question is done drawing
        const questionDuration = 600 + (CONFIG.PROPOSAL_QUESTION.length * 75) + 300;
        setTimeout(() => {
          buttonsEl.style.animation = 'fadeInUp 0.7s ease both';
          buttonsEl.style.opacity   = '1';
        }, questionDuration);
      }, 500);

    }, 700);

    init();
  }

  return { show };
})();


/* ═══════════════════════════════════════════════════════════════
   G. CELEBRATION
   ═══════════════════════════════════════════════════════════════ */

const Celebration = (() => {
  const section  = document.getElementById('celebrationSection');
  const canvas   = document.getElementById('confettiCanvas');
  const ctx      = canvas.getContext('2d');

  let W, H;
  let confetti   = [];
  let animFrame;
  let isRunning  = false;

  // Confetti particle colours
  const COLORS = [
    '#C9A76A', '#E4C896', '#F0DFB8',
    '#7A1F35', '#9A2B42', '#FAF3E8',
    '#D4AF6A', '#B8862A',
  ];

  // Petal / heart shapes mixed in
  function createConfettiParticle() {
    return {
      x:       rand(0, W),
      y:       rand(-H * 0.2, -10),
      w:       rand(6, 14),
      h:       rand(4, 10),
      color:   COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha:   rand(0.6, 1),
      speedX:  rand(-1.5, 1.5),
      speedY:  rand(2, 5),
      spin:    rand(-0.08, 0.08),
      rotation: rand(0, Math.PI * 2),
      type:    Math.random() > 0.7 ? 'heart' : 'rect',
      size:    rand(5, 12),
    };
  }

  function spawnBurst(count) {
    canvas.width  = W = window.innerWidth;
    canvas.height = H = window.innerHeight;
    for (let i = 0; i < count; i++) {
      confetti.push(createConfettiParticle());
    }
  }

  function drawConfettiHeart(p) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle   = p.color;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.beginPath();
    const s = p.size;
    ctx.moveTo(0, s * 0.3);
    ctx.bezierCurveTo(0, 0, -s*0.5, 0, -s*0.5, -s*0.3);
    ctx.bezierCurveTo(-s*0.5, -s*0.65, 0, -s*0.65, 0, -s*0.3);
    ctx.bezierCurveTo(0, -s*0.65, s*0.5, -s*0.65, s*0.5, -s*0.3);
    ctx.bezierCurveTo(s*0.5, 0, 0, 0, 0, s*0.3);
    ctx.fill();
    ctx.restore();
  }

  function tick() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, W, H);

    confetti.forEach((p, i) => {
      p.x        += p.speedX;
      p.y        += p.speedY;
      p.rotation += p.spin;
      p.speedY   += 0.04; // gravity
      p.speedX   *= 0.995; // gentle air resistance
      p.alpha    -= 0.003;

      if (p.type === 'heart') {
        drawConfettiHeart(p);
      } else {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle   = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      // Remove faded or off-screen particles
      if (p.alpha <= 0 || p.y > H + 40) {
        confetti.splice(i, 1);
      }
    });

    if (confetti.length > 0) {
      animFrame = requestAnimationFrame(tick);
    } else {
      isRunning = false;
      ctx.clearRect(0, 0, W, H);
    }
  }

  function startConfetti() {
    isRunning = true;
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;

    // Initial big burst
    spawnBurst(180);
    animFrame = requestAnimationFrame(tick);

    // Smaller follow-up bursts
    const intervals = [800, 1600, 2400];
    intervals.forEach(delay => {
      setTimeout(() => spawnBurst(80), delay);
    });
  }

  function show() {
    // Hide proposal section
    const proposalSection = document.getElementById('proposalSection');
    proposalSection.style.transition = 'opacity 0.6s ease';
    proposalSection.style.opacity    = '0';

    setTimeout(() => {
      proposalSection.classList.add('hidden');
      section.classList.remove('hidden');
      section.style.opacity = '0';
      section.style.transition = 'opacity 1s ease';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          section.style.opacity = '1';
        });
      });

      // Start confetti and restore ambient hearts to normal
      if (!prefersReducedMotion()) {
        startConfetti();
      }
      Ambient.normalSpeed();

      // Inject celebration copy from config
      injectCelebContent();

      // After celebration animations, show final decision
      setTimeout(() => {
        FinalDecision.show();
      }, 8000); // Wait 8 seconds after celebration starts

    }, 600);
  }

  /** Inject dynamic content from CONFIG into celebration section */
  function injectCelebContent() {
    // Update signature
    const sig = document.querySelector('.celeb-signature');
    if (sig) sig.textContent = CONFIG.SENDER_NAME;

    // Update paragraphs
    const paras = document.querySelectorAll('.celeb-para');
    CONFIG.CELEB_PARAGRAPHS.forEach((text, i) => {
      if (paras[i]) paras[i].textContent = text;
    });
  }

  return { show };
})();


/* ═══════════════════════════════════════════════════════════════
   H. FINAL DECISION
   ═══════════════════════════════════════════════════════════════ */

const FinalDecision = (() => {
  const section = document.getElementById('finalSection');
  const yesBtn = document.getElementById('finalYesBtn');
  const noBtn = document.getElementById('finalNoBtn');
  const questionEl = document.getElementById('finalQuestion');
  const subtextEl = document.getElementById('finalSubtext');

  function show() {
    // Hide celebration section
    const celebSection = document.getElementById('celebrationSection');
    celebSection.style.transition = 'opacity 0.8s ease';
    celebSection.style.opacity = '0';

    setTimeout(() => {
      celebSection.classList.add('hidden');
      section.classList.remove('hidden');
      section.style.opacity = '0';
      section.style.transition = 'opacity 1s ease';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          section.style.opacity = '1';
        });
      });

      // Set text from config
      questionEl.textContent = CONFIG.FINAL_QUESTION;
      subtextEl.textContent = CONFIG.FINAL_SUBTEXT;

      // Button event listeners
      yesBtn.addEventListener('click', handleYes);
      noBtn.addEventListener('click', handleNo);

    }, 800);
  }

  function handleYes() {
    yesBtn.disabled = true;
    noBtn.disabled = true;
    YesResponse.show();
  }

  function handleNo() {
    yesBtn.disabled = true;
    noBtn.disabled = true;
    NoResponse.show();
  }

  return { show };
})();


/* ═══════════════════════════════════════════════════════════════
   I. YES RESPONSE (Video)
   ═══════════════════════════════════════════════════════════════ */

const YesResponse = (() => {
  const section = document.getElementById('yesSection');
  const messageEl = document.getElementById('yesMessage');
  const videoEl = document.getElementById('proposalVideo');

  function show() {
    // Hide final section
    const finalSection = document.getElementById('finalSection');
    finalSection.style.transition = 'opacity 0.8s ease';
    finalSection.style.opacity = '0';

    setTimeout(() => {
      finalSection.classList.add('hidden');
      section.classList.remove('hidden');
      section.style.opacity = '0';
      section.style.transition = 'opacity 1s ease';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          section.style.opacity = '1';
        });
      });

      // Set message from config
      messageEl.textContent = CONFIG.FINAL_YES_MESSAGE;

      // Set video source
      const source = videoEl.querySelector('source');
      if (source) {
        source.src = CONFIG.VIDEO_FILE;
        videoEl.load();
      }

    }, 800);
  }

  return { show };
})();


/* ═══════════════════════════════════════════════════════════════
   J. NO RESPONSE (Emotional farewell)
   ═══════════════════════════════════════════════════════════════ */

const NoResponse = (() => {
  const section = document.getElementById('noSection');
  const headingEl = document.getElementById('noHeading');
  const letterEl = document.getElementById('noLetter');

  function show() {
    // Hide final section
    const finalSection = document.getElementById('finalSection');
    finalSection.style.transition = 'opacity 0.8s ease';
    finalSection.style.opacity = '0';

    setTimeout(() => {
      finalSection.classList.add('hidden');
      section.classList.remove('hidden');
      section.style.opacity = '0';
      section.style.transition = 'opacity 1s ease';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          section.style.opacity = '1';
        });
      });

      // Set content from config
      headingEl.textContent = CONFIG.FINAL_NO_MESSAGE_HEADING;
      letterEl.textContent = CONFIG.FINAL_NO_MESSAGE;

    }, 800);
  }

  return { show };
})();


/* ═══════════════════════════════════════════════════════════════
   K. GLOBAL INIT
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialise ambient canvas but don't start it yet (lock screen first)
  if (!prefersReducedMotion()) {
    Ambient.init();
    // Start at a very low opacity for the lock screen
    Ambient.start();
    // Dim it way down during lock — will feel more present after unlock
    document.getElementById('ambientCanvas').style.opacity = '0.5';
  }

  // Initialise lock screen
  LockScreen.init();

  // Initialise Proposal (needs to be ready when Story ends)
  Proposal.init();

  // Story.init() is called by LockScreen after unlock
});
