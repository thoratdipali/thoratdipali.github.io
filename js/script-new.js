/**
 * Proposal Website — Cinematic Edition
 * Flow: Movie Opening -> Message Entry -> Romantic Animation ->
 *       Chapter Card -> Chapter 1 -> Journal/Analysis -> Chapters 2-10 ->
 *       Proposal -> Final Decision -> Yes/No
 */

'use strict';

const CONFIG = {
  CORRECT_PASSWORD: '11042000',
  LOCK_ERROR_MESSAGES: [
    "Try our special date, my love (hint: 11042000)",
    "Think of the day that changed everything",
    "Remember when we became us... 11/04/2000",
    "The date we first met... try ddmmyyyy format",
    "Our beginning: 11th April 2000",
  ],
  LOCK_SUCCESS_MESSAGE: "It's you",
  LOCK_COOLDOWN_SECONDS: 3,

  // Movie-opening title cards, played in order before the lock screen appears.
  MOVIE_SCENES: [
    { eyebrow: '', line: 'Every love story begins quietly.', sub: '', hold: 3200 },
    { eyebrow: '', line: 'Before the words, there was only a feeling.', sub: '', hold: 3200 },
    { eyebrow: 'HE IS', line: 'Kunal', sub: 'The one who noticed the quiet things.', hold: 3600 },
    { eyebrow: 'SHE IS', line: 'Dipali', sub: 'The reason he started noticing them.', hold: 3600 },
    { eyebrow: '', line: 'Somewhere between a hundred unsent messages —', sub: 'and one honest laugh, something began.', hold: 4200 },
    { eyebrow: '', line: 'This is their story.', sub: 'And somewhere inside it, a question is waiting.', hold: 4000 },
  ],
  MOVIE_FINAL_SCENE: { eyebrow: '', line: 'A door is waiting.', sub: 'Only she holds the key.' },

  // Cinematic chapter-card beats played after unlocking, before Chapter 1 appears.
  CHAPTER_CARD_BEATS: [
    { eyebrow: '', title: 'Their Story', subtitle: '', hold: 2200 },
    { eyebrow: 'Chapter I', title: 'The First Meeting', subtitle: 'Where it quietly began', hold: 2600 },
  ],
};

let errorIndex = 0;
let cooldownActive = false;
let journalShown = false;
let audioCtx = null;

/* ============================================================
   BACKGROUND MUSIC
   Plays quietly across every scene, from the moment the lock
   screen appears, and fades out just before the proposal video
   takes over (its own audio should carry that moment instead).
   ============================================================ */
const MUSIC_VOLUME = 0.32;
let musicEngaged = false;
let musicUserPaused = false;

function getBgAudio() {
  return document.getElementById('bgAudio');
}

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
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      musicEngaged = true;
      rampVolume(audio, MUSIC_VOLUME, 2800);
      const toggle = document.getElementById('musicToggle');
      if (toggle) toggle.classList.add('playing');
    }).catch(() => {
      // Autoplay blocked by the browser — the next tap/keypress will retry.
    });
  }
}

function stopBackgroundMusicForVideo() {
  const audio = getBgAudio();
  const toggle = document.getElementById('musicToggle');
  if (toggle) toggle.classList.remove('playing');
  if (!audio || audio.paused) return;
  rampVolume(audio, 0, 900);
  setTimeout(() => {
    audio.pause();
  }, 950);
}

function toggleMusic() {
  const audio = getBgAudio();
  const toggle = document.getElementById('musicToggle');
  if (!audio) return;

  if (audio.paused) {
    musicUserPaused = false;
    audio.play().then(() => {
      musicEngaged = true;
      rampVolume(audio, MUSIC_VOLUME, 700);
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
   SCENE LETTERBOX — a quick cinematic "cut" between chapters
   ============================================================ */
function flashLetterbox(holdMs) {
  const top = document.getElementById('sceneLetterboxTop');
  const bottom = document.getElementById('sceneLetterboxBottom');
  if (!top || !bottom) return;

  top.classList.add('active');
  bottom.classList.add('active');

  setTimeout(() => {
    top.classList.remove('active');
    bottom.classList.remove('active');
  }, holdMs || 1000);
}

/* ============================================================
   MOVIE OPENING
   ============================================================ */
function initMovieOpening() {
  const opening = document.getElementById('movieOpening');
  const sceneWrap = document.getElementById('movieScene');
  const eyebrowEl = document.getElementById('movieEyebrow');
  const lineEl = document.getElementById('movieLine');
  const subEl = document.getElementById('movieSub');
  const beginWrap = document.getElementById('movieBeginWrap');
  const beginBtn = document.getElementById('movieBeginBtn');
  const skipBtn = document.getElementById('movieSkip');

  if (!opening || !sceneWrap) return;

  const scenes = CONFIG.MOVIE_SCENES;
  const finalScene = CONFIG.MOVIE_FINAL_SCENE;
  let idx = -1;
  let timer = null;
  let ended = false;

  function renderScene(scene, isFinal) {
    sceneWrap.classList.remove('is-in');
    setTimeout(() => {
      eyebrowEl.textContent = scene.eyebrow || '';
      lineEl.textContent = scene.line || '';
      subEl.textContent = scene.sub || '';
      sceneWrap.classList.add('is-in');
      if (isFinal && beginWrap) {
        setTimeout(() => {
          beginWrap.classList.remove('hidden');
          requestAnimationFrame(() => beginWrap.classList.add('visible'));
        }, 900);
      }
    }, 450);
  }

  function nextScene() {
    idx++;
    if (idx < scenes.length) {
      renderScene(scenes[idx], false);
      timer = setTimeout(nextScene, scenes[idx].hold);
    } else {
      renderScene(finalScene, true);
    }
  }

  function endOpening() {
    if (ended) return;
    ended = true;
    clearTimeout(timer);
    opening.classList.add('opening-out');
    setTimeout(() => {
      opening.classList.add('hidden');
      revealLockScreen();
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
   TINY WEB-AUDIO CHIME — a subtle romantic music cue,
   no audio file required.
   ============================================================ */
function playChime() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    const notes = [523.25, 659.25, 784.0, 1046.5]; // C5 E5 G5 C6 — gentle arpeggio
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const start = now + i * 0.18;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.07, start + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.3);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(start);
      osc.stop(start + 1.4);
    });
  } catch (e) {
    console.log('[DEBUG] Audio chime unavailable', e);
  }
}

/* ============================================================
   LOCK SCREEN VALIDATION
   ============================================================ */
function validatePassword() {
  if (cooldownActive) return;

  const passwordInput = document.getElementById('passwordInput');
  const entered = passwordInput ? passwordInput.value.trim() : '';

  if (!entered) {
    alert('Please enter a password');
    return;
  }

  if (entered === CONFIG.CORRECT_PASSWORD) {
    unlockSuccess();
  } else {
    showError();
    if (passwordInput) passwordInput.value = '';
  }
}

function showError() {
  const card = document.getElementById('locketCard');
  const msgEl = document.getElementById('lockMessage');
  const msgText = document.getElementById('lockMsgText');

  const msg = CONFIG.LOCK_ERROR_MESSAGES[errorIndex % CONFIG.LOCK_ERROR_MESSAGES.length];
  errorIndex++;

  if (card) {
    card.classList.add('shake');
    setTimeout(() => card.classList.remove('shake'), 600);
  }

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
      clearInterval(interval);
      cooldownActive = false;
      if (unlockBtn) unlockBtn.disabled = false;
      if (passwordInput) passwordInput.disabled = false;
      if (btnText) btnText.textContent = originalText;
      if (msgEl) msgEl.classList.remove('visible');
    }
  }, 1000);
}

/* ============================================================
   ROMANTIC UNLOCK ANIMATION -> CHAPTER CARD -> CHAPTER 1
   ============================================================ */
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
    if (successText) {
      successText.innerHTML = CONFIG.LOCK_SUCCESS_MESSAGE + ' <span aria-label="smiling face with hearts">🥰</span>';
    }
    successEl.classList.add('visible');
  }

  setTimeout(() => {
    if (screen) {
      screen.style.transition = 'opacity 1s ease';
      screen.style.opacity = '0';
    }

    setTimeout(() => {
      if (screen) screen.style.display = 'none';
      if (successEl) successEl.classList.remove('visible');

      // Cinematic bridge into Chapter 1
      showCinematicOpening();
    }, 1000);
  }, 2200);
}

function showCinematicOpening() {
  const overlay = document.getElementById('chapterCardOverlay');
  const eyebrowEl = document.getElementById('chapterCardEyebrow');
  const titleEl = document.getElementById('chapterCardTitle');
  const subEl = document.getElementById('chapterCardSubtitle');

  if (!overlay || !eyebrowEl || !titleEl || !subEl) {
    revealStorySection();
    return;
  }

  overlay.classList.remove('hidden');
  requestAnimationFrame(() => overlay.classList.add('visible'));

  const beats = CONFIG.CHAPTER_CARD_BEATS;
  let i = 0;

  function playBeat() {
    if (i >= beats.length) {
      overlay.classList.remove('visible');
      setTimeout(() => {
        overlay.classList.add('hidden');
        overlay.classList.remove('beat-in');
        revealStorySection();
      }, 850);
      return;
    }

    const beat = beats[i];
    overlay.classList.remove('beat-in');
    // force reflow so the beat-in animation restarts for each beat
    void overlay.offsetWidth;
    eyebrowEl.textContent = beat.eyebrow;
    titleEl.textContent = beat.title;
    subEl.textContent = beat.subtitle;
    overlay.classList.add('beat-in');

    i++;
    setTimeout(playBeat, beat.hold);
  }

  playBeat();
}

function revealStorySection() {
  const storySection = document.getElementById('storySection');
  if (!storySection) return;

  storySection.classList.remove('hidden');
  storySection.style.opacity = '0';
  requestAnimationFrame(() => {
    storySection.style.transition = 'opacity 1.1s ease';
    storySection.style.opacity = '1';
  });

  // Make sure Chapter 1 is the active slide (fixes it never being shown otherwise)
  const slides = document.querySelectorAll('.story-slide');
  slides.forEach((s) => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  if (slides.length) {
    slides[0].style.display = 'flex';
    requestAnimationFrame(() => slides[0].classList.add('active'));
    initPhotoParallax(slides[0]);
  }

  currentSlide = 0;
  updateProgress();
}

/* ============================================================
   GENTLE PHOTO PARALLAX — the active chapter photo drifts softly
   with the cursor (or device tilt on touch), adding a sense of
   layered depth without ever feeling gimmicky.
   ============================================================ */
let currentPhotoFrame = null;

function initPhotoParallax(slideEl) {
  if (!slideEl) return;
  currentPhotoFrame = slideEl.querySelector('.slide-photo-frame');
}

function setupGlobalParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function applyTilt(px, py) {
    if (!currentPhotoFrame) return;
    const rotateY = (px - 0.5) * 8;
    const rotateX = (0.5 - py) * 6;
    const shiftX = (px - 0.5) * 8;
    const shiftY = (py - 0.5) * 6;
    currentPhotoFrame.style.transform =
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${shiftX}px, ${shiftY}px, 0)`;
  }

  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  if (isCoarsePointer && window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
      const px = Math.min(1, Math.max(0, 0.5 + (e.gamma || 0) / 60));
      const py = Math.min(1, Math.max(0, 0.5 + (e.beta || 0) / 120));
      applyTilt(px, py);
    });
  } else {
    document.addEventListener('mousemove', (e) => {
      applyTilt(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
    });
  }
}

/* ============================================================
   STORY NAVIGATION
   ============================================================ */
let currentSlide = 0;
const totalSlides = 10;

function updateProgress() {
  const progressFill = document.getElementById('progressFill');
  const progressLabel = document.getElementById('progressLabel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const progressDots = document.querySelectorAll('.progress-dot');

  const pct = ((currentSlide + 1) / totalSlides) * 100;
  if (progressFill) progressFill.style.width = `${pct}%`;
  if (progressLabel) progressLabel.textContent = `Chapter ${currentSlide + 1} of ${totalSlides}`;

  if (prevBtn) prevBtn.disabled = currentSlide === 0;

  if (nextBtn) {
    const btnText = nextBtn.querySelector('span');
    if (btnText) {
      btnText.textContent = currentSlide === totalSlides - 1 ? 'The question…' : 'Continue the story';
    }
  }

  progressDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
    dot.classList.toggle('done', i < currentSlide);
  });
}

function goToSlide(index) {
  if (index < 0 || index >= totalSlides) return;

  const slides = document.querySelectorAll('.story-slide');
  if (slides.length === 0) return;

  const outgoing = slides[currentSlide];
  const incoming = slides[index];

  // Cinematic dissolve out — the current chapter softly loses focus
  outgoing.classList.remove('active');
  outgoing.classList.add('exiting');

  setTimeout(() => {
    outgoing.classList.remove('exiting');
    outgoing.style.display = 'none';

    currentSlide = index;
    incoming.style.display = 'flex';
    incoming.classList.add('entering');

    requestAnimationFrame(() => incoming.classList.add('active'));
    setTimeout(() => incoming.classList.remove('entering'), 1300);

    initPhotoParallax(incoming);
    updateProgress();
  }, 380);
}

// Central "advance the story" handler used by both the button and the keyboard,
// so the journal interstitial after Chapter 1 is never bypassed.
function handleStoryAdvance() {
  if (currentSlide === 0 && !journalShown) {
    showJournal();
    return;
  }

  if (currentSlide < totalSlides - 1) {
    goToSlide(currentSlide + 1);
  } else {
    showProposal();
  }
}

function initStoryNavigation() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const progressDots = document.getElementById('progressDots');

  if (progressDots) {
    progressDots.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = 'progress-dot';
      progressDots.appendChild(dot);
    }
  }

  if (prevBtn) {
    prevBtn.onclick = () => {
      if (currentSlide > 0) goToSlide(currentSlide - 1);
    };
  }

  if (nextBtn) {
    nextBtn.onclick = handleStoryAdvance;
  }

  document.addEventListener('keydown', (e) => {
    const storySection = document.getElementById('storySection');
    if (storySection && !storySection.classList.contains('hidden')) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        handleStoryAdvance();
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (currentSlide > 0) goToSlide(currentSlide - 1);
      }
    }
  });
}

/* ============================================================
   JOURNAL / ANALYSIS INTERSTITIAL (after Chapter 1)
   ============================================================ */
function showJournal() {
  const storySection = document.getElementById('storySection');
  const journalSection = document.getElementById('journalSection');
  if (!journalSection) {
    goToSlide(1);
    return;
  }

  flashLetterbox(1100);

  if (storySection) {
    storySection.style.transition = 'opacity 0.7s ease';
    storySection.style.opacity = '0';
  }

  setTimeout(() => {
    if (storySection) storySection.classList.add('hidden');

    journalSection.classList.remove('hidden');
    journalSection.style.opacity = '0';
    requestAnimationFrame(() => {
      journalSection.style.transition = 'opacity 1s ease';
      journalSection.style.opacity = '1';
    });

    animateJournalEntries();
  }, 700);
}

function animateJournalEntries() {
  const entries = document.querySelectorAll('.journal-entry');
  const continueBtn = document.getElementById('journalContinueBtn');

  entries.forEach((entry, i) => {
    setTimeout(() => entry.classList.add('visible'), 500 + i * 1300);
  });

  const totalDelay = 500 + entries.length * 1300 + 400;
  setTimeout(() => {
    if (continueBtn) {
      continueBtn.classList.remove('hidden');
      requestAnimationFrame(() => continueBtn.classList.add('visible'));
    }
  }, totalDelay);
}

function hideJournalAndContinue() {
  journalShown = true;

  const storySection = document.getElementById('storySection');
  const journalSection = document.getElementById('journalSection');
  if (!journalSection) return;

  flashLetterbox(1100);

  journalSection.style.transition = 'opacity 0.7s ease';
  journalSection.style.opacity = '0';

  setTimeout(() => {
    journalSection.classList.add('hidden');

    if (storySection) {
      storySection.classList.remove('hidden');
      storySection.style.opacity = '0';
      requestAnimationFrame(() => {
        storySection.style.transition = 'opacity 1s ease';
        storySection.style.opacity = '1';
      });
    }

    goToSlide(1);
  }, 700);
}

/* ============================================================
   PROPOSAL / FINAL DECISION / YES / NO  (unchanged flow)
   ============================================================ */
function showProposal() {
  const storySection = document.getElementById('storySection');
  const finalSection = document.getElementById('finalSection');

  flashLetterbox(1300);

  if (storySection) {
    storySection.style.transition = 'opacity 0.7s ease';
    storySection.style.opacity = '0';

    setTimeout(() => {
      storySection.classList.add('hidden');

      if (finalSection) {
        finalSection.classList.remove('hidden');
        finalSection.style.opacity = '0';

        requestAnimationFrame(() => {
          finalSection.style.transition = 'opacity 0.9s ease';
          finalSection.style.opacity = '1';
        });

        initFinalButtons();
      }
    }, 700);
  }
}

function initFinalButtons() {
  const finalYesBtn = document.getElementById('finalYesBtn');
  const finalNoBtn = document.getElementById('finalNoBtn');

  if (finalYesBtn) {
    finalYesBtn.onclick = () => showYesSection();
  }
  if (finalNoBtn) {
    finalNoBtn.onclick = () => showNoSection();
  }
}

function showYesSection() {
  const finalSection = document.getElementById('finalSection');
  const yesSection = document.getElementById('yesSection');

  flashLetterbox(1400);
  stopBackgroundMusicForVideo();

  if (finalSection) {
    finalSection.style.transition = 'opacity 0.7s ease';
    finalSection.style.opacity = '0';

    setTimeout(() => {
      finalSection.classList.add('hidden');

      if (yesSection) {
        yesSection.classList.remove('hidden');
        yesSection.style.opacity = '0';

        requestAnimationFrame(() => {
          yesSection.style.transition = 'opacity 0.9s ease';
          yesSection.style.opacity = '1';
        });

        setTimeout(() => {
          const video = document.getElementById('proposalVideo');
          if (video) {
            video.load();
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {
                // Autoplay blocked — user can press play manually.
              });
            }
          }
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
    finalSection.style.transition = 'opacity 0.7s ease';
    finalSection.style.opacity = '0';

    setTimeout(() => {
      finalSection.classList.add('hidden');

      if (noSection) {
        noSection.classList.remove('hidden');
        noSection.style.opacity = '0';

        requestAnimationFrame(() => {
          noSection.style.transition = 'opacity 0.9s ease';
          noSection.style.opacity = '1';
        });

        const noLetter = document.getElementById('noLetter');
        if (noLetter) {
          const message = `My Dearest Dipali,

I'm writing this with a heart full of emotions I don't quite know how to put into words. If you're reading this, I know you've made a choice that wasn't easy, and I want you to know — I understand, and I respect you more than you'll ever know.

You've been my sunrise and my sunset, the poetry in ordinary moments, the reason I believed in something bigger than myself. Every laugh we shared, every silence that felt like home, every stolen glance that said more than words ever could — they're all treasures I'll carry with me, always.

I won't lie and say this doesn't hurt. It does. Deeply. But I would never want you to say yes out of anything other than the purest certainty in your heart. You deserve a love that feels like coming home, not a question mark. And if that love isn't what I can give you, then I want you to find it — completely, unconditionally, without doubt.

Maybe we met too soon, or maybe our paths were only meant to cross, not intertwine. Maybe in another lifetime, another universe, we'll find each other again when the timing is right, when we're the people we're meant to be. And maybe, just maybe, that version of us will get the forever I dreamed of.

I want you to know something, though. You changed me. You made me believe in magic hidden in simple moments. You taught me what it means to love someone so deeply that their happiness matters more than my own. Because of you, I'm a better person. And I'll spend the rest of my life grateful for that gift.

Please don't carry any guilt or sadness for me. I'll be okay. It might take time, but I'll heal. And I'll look back on our story not with regret, but with a smile — because knowing you, loving you, even for this brief moment in time, has been one of the greatest privileges of my life.

Go find your happiness, Dipali. Fall in love with someone who makes your soul sing. Build the life you've always dreamed of. And when you do, know that somewhere, I'll be genuinely, wholeheartedly happy for you.

You deserve the world. You deserve someone who loves you the way you deserve to be loved — fiercely, gently, completely. And if I couldn't be that person, then I hope you find them soon.

Thank you for every moment, every memory, every piece of yourself you shared with me. Thank you for being honest with me today. Thank you for being you.

This isn't goodbye forever. It's just goodbye for now. Maybe our paths will cross again someday, as old friends with fond memories and full hearts. Until then, I'll treasure what we had and wish you nothing but beautiful tomorrows.

You were my almost. My what-if. My beautiful maybe. And that's a story worth telling, even if it didn't end the way I hoped.

Take care of yourself. Be happy. Be loved. Be everything you were always meant to be.

With all the love in my heart, even as I let you go,

Yours always,
Kunal ❤️

P.S. — If you ever need a friend, if you ever need someone who knows your heart, I'll be here. Always.`;

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
  const unlockBtn = document.getElementById('unlockBtn');
  const passwordInput = document.getElementById('passwordInput');
  const journalContinueBtn = document.getElementById('journalContinueBtn');
  const musicToggle = document.getElementById('musicToggle');

  initMovieOpening();
  initStoryNavigation();
  setupGlobalParallax();

  if (unlockBtn) {
    unlockBtn.onclick = validatePassword;
  }
  if (passwordInput) {
    passwordInput.onkeydown = (e) => {
      if (e.key === 'Enter') validatePassword();
    };
  }
  if (journalContinueBtn) {
    journalContinueBtn.onclick = hideJournalAndContinue;
  }
  if (musicToggle) {
    musicToggle.onclick = toggleMusic;
  }

  // Browsers block autoplay with sound until the visitor interacts —
  // the very first tap, click or keypress anywhere quietly starts the score.
  ['pointerdown', 'keydown', 'touchstart'].forEach((evt) => {
    document.addEventListener(evt, startBackgroundMusic, { once: true, passive: true });
  });
});
