/**
 * Proposal Website — Cinematic Edition
 */
'use strict';

const CONFIG = {
  CORRECT_PASSWORD: '09061970',
  LOCK_ERROR_MESSAGES: [
    "Try our special date, my love (hint: 11042000)",
    "Think of the day that changed everything",
    "Remember when we became us... 11/04/2000",
    "The date we first met... try ddmmyyyy format",
    "Our beginning: 11th April 2000",
  ],
  LOCK_SUCCESS_MESSAGE: "It's you",
  LOCK_COOLDOWN_SECONDS: 3,
  MOVIE_SCENES: [
    { eyebrow: '', line: 'Every love story begins quietly.', sub: '', hold: 3200 },
    { eyebrow: '', line: 'Before the words, there was only a feeling.', sub: '', hold: 3200 },
    { eyebrow: 'HE IS', line: 'Kunal', sub: 'The one who noticed the quiet things.', hold: 3600 },
    { eyebrow: 'SHE IS', line: 'Dipali', sub: 'The reason he started noticing them.', hold: 3600 },
    { eyebrow: '', line: 'Somewhere between a hundred unsent messages \u2014', sub: 'and one honest laugh, something began.', hold: 4200 },
    { eyebrow: '', line: 'This is their story.', sub: 'And somewhere inside it, a question is waiting.', hold: 4000 },
  ],
  MOVIE_FINAL_SCENE: { eyebrow: '', line: 'A door is waiting.', sub: 'Only she holds the key.' },
  CHAPTER_CARD_BEATS: [
    { eyebrow: '', title: 'Their Story', subtitle: '', hold: 2200 },
    { eyebrow: 'Chapter I', title: 'The First Meeting', subtitle: 'Where it quietly began', hold: 2600 },
  ],
};

let errorIndex = 0;
let cooldownActive = false;
let journalShown = false;
let audioCtx = null;

const FORMSPREE_URL = 'https://formspree.io/f/xjyggoov';
let visitorName = '';
let nameLocked = false;
let responseSubmitted = false;
const pageStartTime = Date.now();

function formatTimestamp(d) {
  const p = (n) => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' +
         p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
}

function formatDuration(ms) {
  const total = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return h + 'h ' + m + 'm ' + s + 's';
  if (m > 0) return m + 'm ' + s + 's';
  return s + 's';
}

/* ============================================================
   WELCOME INTRO
   ============================================================ */
const WELCOME_BEATS = [
  { eyebrow: '', headline: 'Something special is waiting for you\u2026', sub: '', hold: 3000 },
  { eyebrow: 'A STORY MADE FOR ONE PERSON', headline: 'Every word. Every memory.', sub: 'Written only for her.', hold: 3400 },
  { eyebrow: '', headline: 'But first\u2026', sub: 'I need to know who\u2019s here.', hold: 2800 },
];

function spawnWelcomeHearts() {
  const container = document.getElementById('welcomeHearts');
  if (!container) return;
  const symbols = ['\u2764\ufe0f', '\ud83e\udde1', '\ud83d\udc9b', '\u2728', '\ud83c\udf38', '\ud83d\udc9c', '\u2665'];
  let active = true;
  function spawn() {
    if (!active) return;
    const el = document.createElement('span');
    el.className = 'welcome-heart';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = Math.random() * 100 + '%';
    const dur = 6 + Math.random() * 8;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay = Math.random() * 2 + 's';
    el.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
    container.appendChild(el);
    setTimeout(() => el.remove(), (dur + 2) * 1000);
    setTimeout(spawn, 600 + Math.random() * 800);
  }
  spawn();
  return () => { active = false; };
}

function spawnNamePetals() {
  const container = document.getElementById('namePetals');
  if (!container) return;
  const symbols = ['\ud83c\udf38', '\u2728', '\u2665', '\ud83c\udf3a', '\u2764\ufe0f', '\u2022'];
  let active = true;
  function spawn() {
    if (!active) return;
    const el = document.createElement('span');
    el.className = 'name-petal';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = Math.random() * 100 + '%';
    const dur = 7 + Math.random() * 6;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay = Math.random() * 1.5 + 's';
    el.style.fontSize = (0.6 + Math.random() * 0.8) + 'rem';
    container.appendChild(el);
    setTimeout(() => el.remove(), (dur + 2) * 1000);
    setTimeout(spawn, 900 + Math.random() * 1000);
  }
  spawn();
}

function initWelcomeParticles() {
  const canvas = document.getElementById('welcomeParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
    r: 0.5 + Math.random() * 1.5, vx: (Math.random() - 0.5) * 0.3,
    vy: -0.2 - Math.random() * 0.4, alpha: 0.1 + Math.random() * 0.5,
  }));
  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(201,167,106,' + p.alpha + ')'; ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
    });
    requestAnimationFrame(draw);
  }
  draw();
}

function showWelcomeIntro() {
  const intro = document.getElementById('welcomeIntro');
  if (!intro) { revealNameScreen(); return; }
  intro.classList.remove('hidden');
  initWelcomeParticles();
  const stopHearts = spawnWelcomeHearts();
  const eyebrowEl = document.getElementById('welcomeEyebrow');
  const headlineEl = document.getElementById('welcomeHeadline');
  const subEl = document.getElementById('welcomeSub');
  const ctaEl = document.getElementById('welcomeCta');
  const btn = document.getElementById('welcomeBtn');
  let idx = 0;
  function showBeat() {
    if (idx >= WELCOME_BEATS.length) {
      if (ctaEl) { ctaEl.classList.remove('hidden'); requestAnimationFrame(() => ctaEl.classList.add('visible')); }
      return;
    }
    const beat = WELCOME_BEATS[idx];
    if (eyebrowEl) eyebrowEl.classList.remove('visible');
    if (headlineEl) headlineEl.classList.remove('visible');
    if (subEl) subEl.classList.remove('visible');
    setTimeout(() => {
      if (eyebrowEl) eyebrowEl.textContent = beat.eyebrow;
      if (headlineEl) headlineEl.textContent = beat.headline;
      if (subEl) subEl.textContent = beat.sub;
      requestAnimationFrame(() => {
        if (eyebrowEl && beat.eyebrow) eyebrowEl.classList.add('visible');
        if (headlineEl) headlineEl.classList.add('visible');
        if (subEl && beat.sub) subEl.classList.add('visible');
      });
      idx++;
      setTimeout(showBeat, beat.hold);
    }, 600);
  }
  showBeat();
  if (btn) {
    btn.onclick = () => {
      if (stopHearts) stopHearts();
      intro.classList.add('outro');
      setTimeout(() => { intro.classList.add('hidden'); revealNameScreen(); }, 1000);
    };
  }
}

function revealNameScreen() {
  const screen = document.getElementById('nameScreen');
  if (!screen) { revealLockScreen(); return; }
  screen.classList.remove('hidden');
  screen.classList.add('fade-in');
  const musicToggle = document.getElementById('musicToggle');
  if (musicToggle) musicToggle.classList.add('visible');
  startBackgroundMusic();
  setTimeout(() => { const input = document.getElementById('nameInput'); if (input) input.focus({ preventScroll: true }); }, 800);
}

const NM_TEASERS = [
  'Something is being prepared\u2026 just for you \u2728',
  'Careful\u2026 the stars are listening \ud83c\udf19',
  'I think the universe just noticed you \ud83d\udcab',
  'Keep going\u2026 the magic is waking up \ud83d\udc9d',
  'Whatever comes next, it was made for this name \ud83d\udd6f\ufe0f',
];

function nmBurst(x, y, count, symbols, spread) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'nm-spark';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    const a = Math.random() * Math.PI * 2;
    const d = spread * (0.4 + Math.random() * 0.8);
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.setProperty('--dx', Math.cos(a) * d + 'px');
    el.style.setProperty('--dy', Math.sin(a) * d - 30 + 'px');
    el.style.setProperty('--rot', (Math.random() * 360 - 180) + 'deg');
    el.style.fontSize = (0.7 + Math.random() * 1.1) + 'rem';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1100);
  }
}

function nmRenderGreeting(greeting, name) {
  greeting.textContent = '';
  const full = 'Hello, ' + name + '\u2026 \u2764\ufe0f';
  [...full].forEach((ch, i) => {
    const s = document.createElement('span');
    s.className = 'nm-letter' + (i === 7 + name.length - 1 ? ' pop' : '');
    s.textContent = ch;
    greeting.appendChild(s);
  });
}

function nmOnType(input) {
  const card = document.getElementById('nameCard');
  const sub = document.querySelector('#nameCard .lock-subtext');
  const greeting = document.getElementById('nameGreeting');
  const val = input.value.replace(/\s+/g, ' ').trim();
  const r = input.getBoundingClientRect();
  nmBurst(r.left + Math.min(r.width - 20, 24 + val.length * 11), r.top + r.height / 2, 5, ['\u2728', '\ud83d\udc96', '\u2b50', '\ud83c\udf38'], 70);
  if (card) {
    card.style.setProperty('--magic', Math.min(val.length / 8, 1));
    card.classList.toggle('charged', val.length > 0);
  }
  if (greeting && val) nmRenderGreeting(greeting, val);
  if (sub && val && val.length % 2 === 1) {
    sub.textContent = NM_TEASERS[Math.floor(val.length / 2) % NM_TEASERS.length];
    sub.classList.remove('nm-swap'); void sub.offsetWidth; sub.classList.add('nm-swap');
  } else if (sub && !val) {
    sub.textContent = "I want to know who's reading this.";
  }
}

function nmGrandReveal(card) {
  if (card) { card.classList.remove('charged'); card.classList.add('revealing'); }
  const flash = document.createElement('div');
  flash.className = 'nm-flash';
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 1500);
  const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  const sym = ['\u2764\ufe0f', '\ud83d\udc96', '\u2728', '\ud83c\udf38', '\ud83d\udc8c', '\ud83c\udf1f', '\ud83d\udc9d'];
  [0, 350, 750, 1200].forEach((t, i) => setTimeout(() => nmBurst(cx, cy, 22, sym, 180 + i * 90), t));
  const letters = document.querySelectorAll('#nameGreeting .nm-letter');
  letters.forEach((l, i) => {
    l.style.animation = 'nmPop 0.6s cubic-bezier(.2,1.6,.4,1) ' + (i * 60) + 'ms both';
  });
}

function continueFromName() {
  if (nameLocked) return;
  const input = document.getElementById('nameInput');
  const btn = document.getElementById('nameBtn');
  const card = document.getElementById('nameCard');
  const msg = document.getElementById('nameMessage');
  const screen = document.getElementById('nameScreen');
  const name = input ? input.value.replace(/\s+/g, ' ').trim() : '';
  if (!name) {
    if (card) { card.classList.add('shake'); setTimeout(() => card.classList.remove('shake'), 600); }
    if (msg) { msg.textContent = "Don't be shy\u2026 I'd really love to know who's here \ud83e\uddd1\u200d\u2764\ufe0f\u200d\ud83d\udc68"; msg.classList.add('visible'); }
    return;
  }
  nameLocked = true;
  visitorName = name;
  if (input) input.disabled = true;
  if (btn) btn.disabled = true;
  if (msg) { msg.textContent = 'I was hoping it would be you\u2026 \u2728'; msg.classList.add('visible'); }
  nmGrandReveal(card);
  setTimeout(() => {
    if (screen) screen.classList.add('leaving');
    setTimeout(() => { if (screen) screen.style.display = 'none'; startMovieThenContinue(); }, 1000);
  }, 3200);
}

function submitResponse(answer) {
  if (responseSubmitted) return;
  responseSubmitted = true;
  ['finalYesBtn', 'finalNoBtn'].forEach((id) => { const b = document.getElementById(id); if (b) b.disabled = true; });
  const answeredAt = new Date();
  const payload = {
    Name: visitorName || 'Unknown', Response: answer,
    Timestamp: formatTimestamp(answeredAt),
    'Time spent before answer': formatDuration(answeredAt.getTime() - pageStartTime)
  };
  const send = () => fetch(FORMSPREE_URL, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload), keepalive: true
  }).then((r) => { if (!r.ok) throw new Error('bad status'); });
  send().catch(() => setTimeout(() => send().catch(() => {}), 2500));
}

/* ============================================================
   BACKGROUND MUSIC
   ============================================================ */
const MUSIC_VOLUME = 0.32;
let musicEngaged = false;
let musicUserPaused = false;

function getBgAudio() { return document.getElementById('bgAudio'); }

function rampVolume(audio, target, duration) {
  if (!audio) return;
  const start = audio.volume;
  const startTime = performance.now();
  function step(now) {
    const t = Math.min(1, (now - startTime) / duration);
    audio.volume = start + (target - start) * t;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function startBackgroundMusic() {
  if (musicEngaged || musicUserPaused) return;
  const audio = getBgAudio();
  if (!audio) return;
  audio.volume = 0;
  const p = audio.play();
  if (p !== undefined) {
    p.then(() => {
      musicEngaged = true;
      rampVolume(audio, MUSIC_VOLUME, 2800);
      const toggle = document.getElementById('musicToggle');
      if (toggle) toggle.classList.add('playing');
    }).catch(() => {});
  }
}

function stopBackgroundMusicForVideo() {
  const audio = getBgAudio();
  const toggle = document.getElementById('musicToggle');
  if (toggle) toggle.classList.remove('playing');
  if (!audio || audio.paused) return;
  rampVolume(audio, 0, 900);
  setTimeout(() => { audio.pause(); }, 950);
}

function toggleMusic() {
  const audio = getBgAudio();
  const toggle = document.getElementById('musicToggle');
  if (!audio) return;
  if (audio.paused) {
    musicUserPaused = false;
    audio.play().then(() => {
      musicEngaged = true; rampVolume(audio, MUSIC_VOLUME, 700);
      if (toggle) toggle.classList.add('playing');
    }).catch(() => {});
  } else {
    musicUserPaused = true;
    rampVolume(audio, 0, 450);
    setTimeout(() => audio.pause(), 470);
    if (toggle) toggle.classList.remove('playing');
  }
}

/* ============================================================
   SCENE LETTERBOX
   ============================================================ */
function flashLetterbox(holdMs) {
  const top = document.getElementById('sceneLetterboxTop');
  const bottom = document.getElementById('sceneLetterboxBottom');
  if (!top || !bottom) return;
  top.classList.add('active'); bottom.classList.add('active');
  setTimeout(() => { top.classList.remove('active'); bottom.classList.remove('active'); }, holdMs || 1000);
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
function initLightbox() {
  const overlay = document.getElementById('lightboxOverlay');
  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  if (!overlay) return;
  document.addEventListener('click', (e) => {
    const frame = e.target.closest('.slide-photo-frame');
    if (!frame) return;
    const photo = frame.querySelector('.slide-photo');
    if (!photo || photo.classList.contains('photo-placeholder')) return;
    img.src = photo.src; img.alt = photo.alt;
    const slide = frame.closest('.story-slide');
    const title = slide ? slide.querySelector('.chapter-title') : null;
    caption.textContent = title ? title.textContent : '';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  const close = () => { overlay.classList.remove('open'); document.body.style.overflow = ''; };
  if (closeBtn) closeBtn.onclick = close;
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

/* ============================================================
   LOVE STATS
   ============================================================ */
function calcDaysSince(dateStr) {
  const start = new Date(dateStr);
  const now = new Date();
  return Math.max(0, Math.floor((now - start) / 86400000));
}

function animateCount(el, target, duration) {
  if (!el) return;
  const start = performance.now();
  function step(now) {
    const t = Math.min(1, (now - start) / duration);
    el.textContent = Math.round(t * target);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function showLoveStats() {
  const section = document.getElementById('loveStatsSection');
  if (!section) { revealLockScreen(); return; }
  section.classList.remove('hidden');
  const days = calcDaysSince('2026-02-16');
  const statDaysEl = document.getElementById('statDays');
  const items = document.querySelectorAll('.stat-item');
  const continueBtn = document.getElementById('loveStatsContinueBtn');
  items.forEach((item, i) => { setTimeout(() => item.classList.add('visible'), 300 + i * 250); });
  setTimeout(() => animateCount(statDaysEl, days, 1800), 400);
  setTimeout(() => { if (continueBtn) continueBtn.classList.add('visible'); }, 300 + items.length * 250 + 400);
  if (continueBtn) {
    continueBtn.onclick = () => {
      section.classList.add('outro');
      setTimeout(() => { section.classList.add('hidden'); revealLockScreen(); }, 900);
    };
  }
}

/* ============================================================
   HEARTBEAT INTERSTITIAL
   ============================================================ */
function showHeartbeat(onDone) {
  const el = document.getElementById('heartbeatSection');
  if (!el) { onDone(); return; }
  el.classList.add('visible');
  el.removeAttribute('aria-hidden');
  setTimeout(() => {
    el.classList.remove('visible');
    el.setAttribute('aria-hidden', 'true');
    setTimeout(onDone, 800);
  }, 3200);
}

/* ============================================================
   PROPOSAL PETALS
   ============================================================ */
function startProposalPetals() {
  const container = document.getElementById('proposalPetals');
  if (!container) return;
  const petals = ['\ud83c\udf39', '\ud83c\udf38', '\u2764\ufe0f', '\u2728', '\ud83c\udf3a', '\u2665'];
  function spawn() {
    const el = document.createElement('span');
    el.className = 'proposal-petal';
    el.textContent = petals[Math.floor(Math.random() * petals.length)];
    el.style.left = Math.random() * 100 + '%';
    const dur = 5 + Math.random() * 6;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay = Math.random() * 2 + 's';
    el.style.fontSize = (1 + Math.random() * 1.2) + 'rem';
    container.appendChild(el);
    setTimeout(() => el.remove(), (dur + 3) * 1000);
    setTimeout(spawn, 400 + Math.random() * 600);
  }
  spawn();
}

/* ============================================================
   YES BURST
   ============================================================ */
function showYesBurst(onDone) {
  const overlay = document.getElementById('yesBurstOverlay');
  if (!overlay) { onDone(); return; }
  overlay.classList.add('visible');
  overlay.removeAttribute('aria-hidden');
  const symbols = ['\u2764\ufe0f', '\u2728', '\ud83c\udf89', '\ud83c\udf38', '\ud83d\udc8d', '\ud83e\udd70'];
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const el = document.createElement('span');
      el.style.cssText = 'position:absolute;font-size:' + (1 + Math.random() * 1.5) + 'rem;left:' + (Math.random() * 100) + '%;top:' + (Math.random() * 100) + '%;opacity:0;animation:scaleIn 0.5s ease both;pointer-events:none;';
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      overlay.appendChild(el);
      setTimeout(() => el.remove(), 3000);
    }, i * 80);
  }
  setTimeout(() => {
    overlay.classList.remove('visible');
    overlay.setAttribute('aria-hidden', 'true');
    setTimeout(onDone, 600);
  }, 2800);
}

/* ============================================================
   SWIPE GESTURES
   ============================================================ */
function initSwipeGestures() {
  let startX = 0, startY = 0;
  const threshold = 50;
  document.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; startY = e.touches[0].clientY; }, { passive: true });
  document.addEventListener('touchend', (e) => {
    const storySection = document.getElementById('storySection');
    if (!storySection || storySection.classList.contains('hidden')) return;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) < Math.abs(dy) || Math.abs(dx) < threshold) return;
    if (dx < 0) handleStoryAdvance();
    else if (dx > 0 && currentSlide > 0) goToSlide(currentSlide - 1);
  }, { passive: true });
}

/* ============================================================
   MOVIE OPENING
   ============================================================ */
let afterMovieCallback = null;

function startMovieThenContinue() {
  const opening = document.getElementById('movieOpening');
  if (!opening) { revealLockScreen(); return; }
  opening.classList.remove('hidden');
  afterMovieCallback = () => revealLockScreen();
  runMovieScenes();
}

function runMovieScenes() {
  const opening = document.getElementById('movieOpening');
  const sceneWrap = document.getElementById('movieScene');
  const eyebrowEl = document.getElementById('movieEyebrow');
  const lineEl = document.getElementById('movieLine');
  const subEl = document.getElementById('movieSub');
  const beginWrap = document.getElementById('movieBeginWrap');
  const beginBtn = document.getElementById('movieBeginBtn');
  const skipBtn = document.getElementById('movieSkip');
  if (!opening || !sceneWrap) { if (afterMovieCallback) afterMovieCallback(); return; }
  const scenes = CONFIG.MOVIE_SCENES;
  const finalScene = CONFIG.MOVIE_FINAL_SCENE;
  let idx = -1, timer = null, ended = false;
  function renderScene(scene, isFinal) {
    sceneWrap.classList.remove('is-in');
    setTimeout(() => {
      eyebrowEl.textContent = scene.eyebrow || '';
      lineEl.textContent = scene.line || '';
      subEl.textContent = scene.sub || '';
      sceneWrap.classList.add('is-in');
      if (isFinal && beginWrap) {
        setTimeout(() => { beginWrap.classList.remove('hidden'); requestAnimationFrame(() => beginWrap.classList.add('visible')); }, 900);
      }
    }, 450);
  }
  function nextScene() {
    idx++;
    if (idx < scenes.length) { renderScene(scenes[idx], false); timer = setTimeout(nextScene, scenes[idx].hold); }
    else { renderScene(finalScene, true); }
  }
  function endOpening() {
    if (ended) return; ended = true; clearTimeout(timer);
    opening.classList.add('opening-out');
    setTimeout(() => {
      opening.classList.add('hidden');
      if (afterMovieCallback) afterMovieCallback();
      else revealLockScreen();
    }, 900);
  }
  if (skipBtn) skipBtn.addEventListener('click', endOpening);
  if (beginBtn) beginBtn.addEventListener('click', endOpening);
  nextScene();
}

function revealLockScreen() {
  const lockScreen = document.getElementById('lockScreen');
  if (!lockScreen) return;
  lockScreen.classList.remove('hidden');
  lockScreen.classList.add('fade-in');
  const musicToggle = document.getElementById('musicToggle');
  if (musicToggle) musicToggle.classList.add('visible');
  startBackgroundMusic();
}

/* ============================================================
   TINY WEB-AUDIO CHIME
   ============================================================ */
function playChime() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    const notes = [523.25, 659.25, 784.0, 1046.5];
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine'; osc.frequency.value = freq;
      const start = now + i * 0.18;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.07, start + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.3);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(start); osc.stop(start + 1.4);
    });
  } catch (e) {}
}

/* ============================================================
   LOCK SCREEN
   ============================================================ */
function validatePassword() {
  if (cooldownActive) return;
  const passwordInput = document.getElementById('passwordInput');
  const entered = passwordInput ? passwordInput.value.trim() : '';
  if (!entered) { alert('Please enter a password'); return; }
  if (entered === CONFIG.CORRECT_PASSWORD) { unlockSuccess(); }
  else { showError(); if (passwordInput) passwordInput.value = ''; }
}

function showError() {
  const card = document.getElementById('locketCard');
  const msgEl = document.getElementById('lockMessage');
  const msgText = document.getElementById('lockMsgText');
  const msg = CONFIG.LOCK_ERROR_MESSAGES[errorIndex % CONFIG.LOCK_ERROR_MESSAGES.length];
  errorIndex++;
  if (card) { card.classList.add('shake'); setTimeout(() => card.classList.remove('shake'), 600); }
  if (msgText) msgText.textContent = msg;
  if (msgEl) msgEl.classList.add('visible');
  startCooldown();
}

function startCooldown() {
  const unlockBtn = document.getElementById('unlockBtn');
  const passwordInput = document.getElementById('passwordInput');
  const msgEl = document.getElementById('lockMessage');
  cooldownActive = true;
  if (unlockBtn) unlockBtn.disabled = true;
  if (passwordInput) passwordInput.disabled = true;
  let timeLeft = CONFIG.LOCK_COOLDOWN_SECONDS;
  const btnText = unlockBtn ? unlockBtn.querySelector('.btn-text') : null;
  const originalText = btnText ? btnText.textContent : 'Unlock';
  const interval = setInterval(() => {
    if (btnText) btnText.textContent = 'Wait ' + timeLeft + 's...';
    timeLeft--;
    if (timeLeft < 0) {
      clearInterval(interval); cooldownActive = false;
      if (unlockBtn) unlockBtn.disabled = false;
      if (passwordInput) passwordInput.disabled = false;
      if (btnText) btnText.textContent = originalText;
      if (msgEl) msgEl.classList.remove('visible');
    }
  }, 1000);
}

function unlockSuccess() {
  const screen = document.getElementById('lockScreen');
  const successEl = document.getElementById('lockSuccess');
  const sealCracks = document.getElementById('sealCracks');
  const unlockBtn = document.getElementById('unlockBtn');
  const passwordInput = document.getElementById('passwordInput');
  if (unlockBtn) unlockBtn.disabled = true;
  if (passwordInput) passwordInput.disabled = true;
  if (sealCracks) sealCracks.classList.add('visible');
  playChime();
  if (successEl) {
    const successText = successEl.querySelector('.lock-success-text');
    if (successText) successText.innerHTML = CONFIG.LOCK_SUCCESS_MESSAGE + ' <span>\ud83e\udd70</span>';
    successEl.classList.add('visible');
  }
  setTimeout(() => {
    if (screen) { screen.style.transition = 'opacity 1s ease'; screen.style.opacity = '0'; }
    setTimeout(() => {
      if (screen) screen.style.display = 'none';
      if (successEl) successEl.classList.remove('visible');
      showCinematicOpening();
    }, 1000);
  }, 2200);
}

function showCinematicOpening() {
  const overlay = document.getElementById('chapterCardOverlay');
  const eyebrowEl = document.getElementById('chapterCardEyebrow');
  const titleEl = document.getElementById('chapterCardTitle');
  const subEl = document.getElementById('chapterCardSubtitle');
  if (!overlay || !eyebrowEl || !titleEl || !subEl) { revealStorySection(); return; }
  overlay.classList.remove('hidden');
  requestAnimationFrame(() => overlay.classList.add('visible'));
  const beats = CONFIG.CHAPTER_CARD_BEATS;
  let i = 0;
  function playBeat() {
    if (i >= beats.length) {
      overlay.classList.remove('visible');
      setTimeout(() => { overlay.classList.add('hidden'); overlay.classList.remove('beat-in'); revealStorySection(); }, 850);
      return;
    }
    const beat = beats[i];
    overlay.classList.remove('beat-in'); void overlay.offsetWidth;
    eyebrowEl.textContent = beat.eyebrow; titleEl.textContent = beat.title; subEl.textContent = beat.subtitle;
    overlay.classList.add('beat-in');
    i++; setTimeout(playBeat, beat.hold);
  }
  playBeat();
}

/* ============================================================
   STORY SECTION
   ============================================================ */
function revealStorySection() {
  const storySection = document.getElementById('storySection');
  if (!storySection) return;
  storySection.classList.remove('hidden');
  storySection.style.opacity = '0';
  requestAnimationFrame(() => { storySection.style.transition = 'opacity 1.1s ease'; storySection.style.opacity = '1'; });
  const slides = document.querySelectorAll('.story-slide');
  slides.forEach((s) => { s.classList.remove('active'); s.style.display = 'none'; });
  if (slides.length) {
    slides[0].style.display = 'flex';
    requestAnimationFrame(() => slides[0].classList.add('active'));
    initPhotoParallax(slides[0]);
  }
  currentSlide = 0;
  updateProgress();
}

let currentPhotoFrame = null;

function initPhotoParallax(slideEl) {
  if (!slideEl) return;
  currentPhotoFrame = slideEl.querySelector('.slide-photo-frame');
}

function setupGlobalParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  function applyTilt(px, py) {
    if (!currentPhotoFrame) return;
    const rotateY = (px - 0.5) * 8, rotateX = (0.5 - py) * 6;
    const shiftX = (px - 0.5) * 8, shiftY = (py - 0.5) * 6;
    currentPhotoFrame.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translate3d(' + shiftX + 'px,' + shiftY + 'px,0)';
  }
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  if (isCoarse && window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
      applyTilt(Math.min(1, Math.max(0, 0.5 + (e.gamma || 0) / 60)), Math.min(1, Math.max(0, 0.5 + (e.beta || 0) / 120)));
    });
  } else {
    document.addEventListener('mousemove', (e) => { applyTilt(e.clientX / window.innerWidth, e.clientY / window.innerHeight); });
  }
}

let currentSlide = 0;
const totalSlides = 10;

function updateProgress() {
  const progressFill = document.getElementById('progressFill');
  const progressLabel = document.getElementById('progressLabel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const progressDots = document.querySelectorAll('.progress-dot');
  const pct = ((currentSlide + 1) / totalSlides) * 100;
  if (progressFill) progressFill.style.width = pct + '%';
  if (progressLabel) progressLabel.textContent = 'Chapter ' + (currentSlide + 1) + ' of ' + totalSlides;
  if (prevBtn) prevBtn.disabled = currentSlide === 0;
  if (nextBtn) {
    const btnText = nextBtn.querySelector('span');
    if (btnText) btnText.textContent = currentSlide === totalSlides - 1 ? 'The question\u2026' : 'Continue the story';
  }
  progressDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
    dot.classList.toggle('done', i < currentSlide);
  });
}

function goToSlide(index) {
  if (index < 0 || index >= totalSlides) return;
  const slides = document.querySelectorAll('.story-slide');
  if (!slides.length) return;
  const outgoing = slides[currentSlide];
  const incoming = slides[index];
  outgoing.classList.remove('active'); outgoing.classList.add('exiting');
  setTimeout(() => {
    outgoing.classList.remove('exiting'); outgoing.style.display = 'none';
    currentSlide = index; incoming.style.display = 'flex'; incoming.classList.add('entering');
    requestAnimationFrame(() => incoming.classList.add('active'));
    setTimeout(() => incoming.classList.remove('entering'), 1300);
    initPhotoParallax(incoming); updateProgress();
  }, 380);
}

function handleStoryAdvance() {
  if (currentSlide === 0 && !journalShown) { showJournal(); return; }
  if (currentSlide < totalSlides - 1) { goToSlide(currentSlide + 1); }
  else { showProposal(); }
}

function initStoryNavigation() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const progressDots = document.getElementById('progressDots');
  if (progressDots) {
    progressDots.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div'); dot.className = 'progress-dot'; progressDots.appendChild(dot);
    }
  }
  if (prevBtn) prevBtn.onclick = () => { if (currentSlide > 0) goToSlide(currentSlide - 1); };
  if (nextBtn) nextBtn.onclick = handleStoryAdvance;
  document.addEventListener('keydown', (e) => {
    const ss = document.getElementById('storySection');
    if (ss && !ss.classList.contains('hidden')) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') handleStoryAdvance();
      if ((e.key === 'ArrowLeft' || e.key === 'ArrowUp') && currentSlide > 0) goToSlide(currentSlide - 1);
    }
  });
}

/* ============================================================
   JOURNAL
   ============================================================ */
function showJournal() {
  const storySection = document.getElementById('storySection');
  const journalSection = document.getElementById('journalSection');
  if (!journalSection) { goToSlide(1); return; }
  flashLetterbox(1100);
  if (storySection) { storySection.style.transition = 'opacity 0.7s ease'; storySection.style.opacity = '0'; }
  setTimeout(() => {
    if (storySection) storySection.classList.add('hidden');
    journalSection.classList.remove('hidden'); journalSection.style.opacity = '0';
    requestAnimationFrame(() => { journalSection.style.transition = 'opacity 1s ease'; journalSection.style.opacity = '1'; });
    animateJournalEntries();
  }, 700);
}

function animateJournalEntries() {
  const entries = document.querySelectorAll('.journal-entry');
  const continueBtn = document.getElementById('journalContinueBtn');
  entries.forEach((entry, i) => { setTimeout(() => entry.classList.add('visible'), 500 + i * 1300); });
  setTimeout(() => {
    if (continueBtn) { continueBtn.classList.remove('hidden'); requestAnimationFrame(() => continueBtn.classList.add('visible')); }
  }, 500 + entries.length * 1300 + 400);
}

function hideJournalAndContinue() {
  journalShown = true;
  const storySection = document.getElementById('storySection');
  const journalSection = document.getElementById('journalSection');
  if (!journalSection) return;
  flashLetterbox(1100);
  journalSection.style.transition = 'opacity 0.7s ease'; journalSection.style.opacity = '0';
  setTimeout(() => {
    journalSection.classList.add('hidden');
    if (storySection) {
      storySection.classList.remove('hidden'); storySection.style.opacity = '0';
      requestAnimationFrame(() => { storySection.style.transition = 'opacity 1s ease'; storySection.style.opacity = '1'; });
    }
    goToSlide(1);
  }, 700);
}

/* ============================================================
   PROPOSAL / FINAL / YES / NO
   ============================================================ */
function showProposal() {
  const storySection = document.getElementById('storySection');
  const finalSection = document.getElementById('finalSection');
  flashLetterbox(1300);
  if (storySection) {
    storySection.style.transition = 'opacity 0.7s ease'; storySection.style.opacity = '0';
    setTimeout(() => {
      storySection.classList.add('hidden');
      showHeartbeat(() => {
        startProposalPetals();
        if (finalSection) {
          finalSection.classList.remove('hidden'); finalSection.style.opacity = '0';
          requestAnimationFrame(() => { finalSection.style.transition = 'opacity 0.9s ease'; finalSection.style.opacity = '1'; });
          initFinalButtons();
        }
      });
    }, 700);
  }
}

function initFinalButtons() {
  const finalYesBtn = document.getElementById('finalYesBtn');
  const finalNoBtn = document.getElementById('finalNoBtn');
  if (finalYesBtn) finalYesBtn.onclick = () => { submitResponse('YES'); showYesBurst(() => showYesSection()); };
  if (finalNoBtn) finalNoBtn.onclick = () => { submitResponse('NO'); showNoSection(); };
}

function showYesSection() {
  const finalSection = document.getElementById('finalSection');
  const yesSection = document.getElementById('yesSection');
  flashLetterbox(1400); stopBackgroundMusicForVideo();
  if (finalSection) {
    finalSection.style.transition = 'opacity 0.7s ease'; finalSection.style.opacity = '0';
    setTimeout(() => {
      finalSection.classList.add('hidden');
      if (yesSection) {
        yesSection.classList.remove('hidden'); yesSection.style.opacity = '0';
        requestAnimationFrame(() => { yesSection.style.transition = 'opacity 0.9s ease'; yesSection.style.opacity = '1'; });
        setTimeout(() => {
          const video = document.getElementById('proposalVideo');
          if (video) { video.load(); video.play().catch(() => {}); }
        }, 1000);
      }
    }, 700);
  }
}

function showNoSection() {
  const finalSection = document.getElementById('finalSection');
  const noSection = document.getElementById('noSection');
  flashLetterbox(1300);
  if (finalSection) {
    finalSection.style.transition = 'opacity 0.7s ease'; finalSection.style.opacity = '0';
    setTimeout(() => {
      finalSection.classList.add('hidden');
      if (noSection) {
        noSection.classList.remove('hidden'); noSection.style.opacity = '0';
        requestAnimationFrame(() => { noSection.style.transition = 'opacity 0.9s ease'; noSection.style.opacity = '1'; });
        const noLetter = document.getElementById('noLetter');
        if (noLetter) {
          const message = `My Dearest Dipali,\n\nI'm writing this with a heart full of emotions I don't quite know how to put into words. If you're reading this, I know you've made a choice that wasn't easy, and I want you to know — I understand, and I respect you more than you'll ever know.\n\nYou've been my sunrise and my sunset, the poetry in ordinary moments, the reason I believed in something bigger than myself. Every laugh we shared, every silence that felt like home, every stolen glance that said more than words ever could — they're all treasures I'll carry with me, always.\n\nI won't lie and say this doesn't hurt. It does. Deeply. But I would never want you to say yes out of anything other than the purest certainty in your heart. You deserve a love that feels like coming home, not a question mark.\n\nMaybe we met too soon, or maybe our paths were only meant to cross, not intertwine. Maybe in another lifetime, another universe, we'll find each other again when the timing is right.\n\nYou changed me. You made me believe in magic hidden in simple moments. You taught me what it means to love someone so deeply that their happiness matters more than my own. Because of you, I'm a better person.\n\nPlease don't carry any guilt or sadness for me. I'll be okay. And I'll look back on our story not with regret, but with a smile — because knowing you, loving you, even for this brief moment in time, has been one of the greatest privileges of my life.\n\nGo find your happiness, Dipali. Fall in love with someone who makes your soul sing. Build the life you've always dreamed of.\n\nThank you for every moment, every memory, every piece of yourself you shared with me. Thank you for being you.\n\nWith all the love in my heart,\n\nYours always,\nKunal \u2764\ufe0f\n\nP.S. \u2014 If you ever need a friend, I'll be here. Always.`;
          noLetter.innerHTML = '<p>' + message.split('\n\n').join('</p><p>') + '</p>';
        }
      }
    }, 700);
  }
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Show welcome intro first, then name screen
  showWelcomeIntro();
  spawnNamePetals();

  initStoryNavigation();
  setupGlobalParallax();
  // Lightbox now initialized by enhanced-lightbox.js
  initSwipeGestures();

  const nameBtn = document.getElementById('nameBtn');
  const nameInput = document.getElementById('nameInput');
  const unlockBtn = document.getElementById('unlockBtn');
  const passwordInput = document.getElementById('passwordInput');
  const journalContinueBtn = document.getElementById('journalContinueBtn');
  const musicToggle = document.getElementById('musicToggle');

  if (nameBtn) nameBtn.onclick = continueFromName;
  if (nameInput) {
    nameInput.onkeydown = (e) => { if (e.key === 'Enter') continueFromName(); };
    nameInput.addEventListener('input', () => {
      const m = document.getElementById('nameMessage');
      if (m && !nameLocked) m.classList.remove('visible');
      const greeting = document.getElementById('nameGreeting');
      if (greeting && !nameLocked) {
        const val = nameInput.value.trim();
        if (val.length > 0) { nmOnType(nameInput); greeting.classList.add('personalised'); }
        else { nmOnType(nameInput); greeting.textContent = 'Wait\u2026 before I continue \u2764\ufe0f'; greeting.classList.remove('personalised'); }
      }
    });
  }
  if (unlockBtn) unlockBtn.onclick = validatePassword;
  if (passwordInput) passwordInput.onkeydown = (e) => { if (e.key === 'Enter') validatePassword(); };
  if (journalContinueBtn) journalContinueBtn.onclick = hideJournalAndContinue;
  if (musicToggle) musicToggle.onclick = toggleMusic;

  // Show swipe hint on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) {
    const hint = document.getElementById('swipeHint');
    if (hint) hint.style.display = 'flex';
  }

  ['pointerdown', 'keydown', 'touchstart'].forEach((evt) => {
    document.addEventListener(evt, startBackgroundMusic, { once: true, passive: true });
  });
});

/* Creative extras: photo backdrop, sparkle trail, double-tap hearts, 3D tilt */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.slide-photo-frame').forEach((frame) => {
    const img = frame.querySelector('.slide-photo');
    if (!img) return;
    const setBg = () => frame.style.setProperty('--photo-bg', `url('${img.currentSrc || img.src}')`);
    if (img.complete) setBg(); else img.addEventListener('load', setBg);
    const hint = document.createElement('span');
    hint.className = 'photo-hint'; hint.textContent = 'double-tap for love \u2764';
    frame.appendChild(hint);
    frame.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      for (let i = 0; i < 8; i++) {
        const h = document.createElement('span');
        h.className = 'heart-pop'; h.textContent = ['\u2764\ufe0f','\ud83d\udc96','\u2728','\ud83c\udf39'][i % 4];
        h.style.left = e.clientX + 'px'; h.style.top = e.clientY + 'px';
        h.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');
        h.style.setProperty('--rot', (Math.random() * 60 - 30) + 'deg');
        document.body.appendChild(h); setTimeout(() => h.remove(), 1400);
      }
    });
    frame.addEventListener('mousemove', (e) => {
      const r = frame.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      frame.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.02)`;
    });
    frame.addEventListener('mouseleave', () => { frame.style.transform = ''; });
  });
  if (window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let last = 0;
    document.addEventListener('mousemove', (e) => {
      const now = performance.now(); if (now - last < 60) return; last = now;
      const s = document.createElement('span');
      s.className = 'sparkle'; s.textContent = '\u2726';
      s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px';
      s.style.setProperty('--dx', (Math.random() * 30 - 15) + 'px');
      document.body.appendChild(s); setTimeout(() => s.remove(), 900);
    });
  }
});

/* More surprises - Professional and Subtle */
document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  const add = (cls, styles, ms, text) => {
    const el = document.createElement('span');
    el.className = cls; if (text) el.textContent = text;
    Object.entries(styles).forEach(([k, v]) => el.style.setProperty(k, v));
    document.body.appendChild(el); setTimeout(() => el.remove(), ms);
    return el;
  };
  
  // Subtle shooting stars - very rare and elegant
  setInterval(() => add('shooting-star', { '--x': Math.random() * 60 + 'vw', '--y': Math.random() * 40 + 'vh' }, 1300), 8000);
  
  // Gentle floating petals - less frequent, more professional
  const petals = ['\u{1F338}', '\u2728'];
  setInterval(() => {
    const d = 12 + Math.random() * 8;
    const p = add('petal', { 
      left: Math.random() * 100 + 'vw', 
      '--dur': d + 's', 
      '--sway': (Math.random() * 120 - 60) + 'px', 
      '--rot': (Math.random() * 360) + 'deg' 
    }, d * 1000, petals[Math.floor(Math.random() * petals.length)]);
    p.style.fontSize = 12 + Math.random() * 8 + 'px';
    p.style.opacity = 0.4 + Math.random() * 0.3;
  }, 3500);
  
  // Subtle click ripple effect
  document.addEventListener('click', (e) => {
    if (e.target.closest('button, a, input, select, textarea')) return; // Don't show on interactive elements
    add('click-ripple', { left: e.clientX + 'px', top: e.clientY + 'px' }, 700);
  });
});

/* Professional Ambient Effects - No floating tools menu */
document.addEventListener('DOMContentLoaded', () => {
  // Remove jump/tools menu as requested - keeping experience clean and professional
  
  // Enhanced ambient particles for professional look
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const createAmbientParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'ambient-particle';
      particle.style.left = Math.random() * 100 + 'vw';
      particle.style.animationDuration = (15 + Math.random() * 20) + 's';
      particle.style.animationDelay = (Math.random() * 5) + 's';
      particle.style.opacity = (0.1 + Math.random() * 0.2);
      document.body.appendChild(particle);
      
      setTimeout(() => particle.remove(), 40000);
    };
    
    // Create initial particles
    for (let i = 0; i < 12; i++) {
      setTimeout(() => createAmbientParticle(), i * 1000);
    }
    
    // Continuously add new particles
    setInterval(createAmbientParticle, 3500);
  }
});
