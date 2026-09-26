# Proposal Website — For Dipali 💛

A private, beautifully crafted proposal website built with plain HTML, CSS, and JavaScript — deployable for free on GitHub Pages.

## ✨ Cinematic Experience — What's New

The flow now plays out like an interactive romantic movie:

1. **Movie Opening** — a letterboxed, film-grain title-card sequence introduces Kunal, Dipali, and the mystery, before the lock screen ever appears. A "Skip" button lets her jump ahead any time.
2. **Message Entry** — the existing wax-seal lock screen, now revealed with a soft fade after the opening.
3. **Romantic Animation** — entering the correct code triggers a glowing gold burst, cracking wax seal, a gentle bell-like chime (generated in-browser, no audio file needed), and a warm fade to black.
4. **Cinematic bridge → Chapter 1** — two full-screen title cards ("Their Story" → "Chapter I: The First Meeting") ease her into the first chapter like the opening of a film.
5. **Journal / Analysis** — right after Chapter 1, a handwritten-style "private journal" page reveals five short reflections one at a time, then invites her to continue.
6. **Chapters 2–10 → Proposal → Final Decision → Yes/No** — unchanged, exactly as before.

To customise the movie-opening lines or the chapter-card text, edit `CONFIG.MOVIE_SCENES`, `CONFIG.MOVIE_FINAL_SCENE`, and `CONFIG.CHAPTER_CARD_BEATS` near the top of `js/script-new.js`. To customise the journal entries, edit the `<p class="journal-entry">` lines inside `#journalSection` in `index.html`.

---

## Folder Structure

```
kunal/
├── index.html          ← Main HTML (all four sections)
├── css/
│   └── style.css       ← All styles (design tokens, animations, responsive)
├── js/
│   └── script.js       ← All logic + CONFIG object (edit this to customise)
├── img/
│   ├── photo1.jpg      ← Chapter 1 — The First Meeting
│   ├── photo2.jpg      ← Chapter 2 — The Nerves
│   ├── photo3.jpg      ← Chapter 3 — The First Spark
│   ├── photo4.jpg      ← Chapter 4 — Getting Closer
│   ├── photo5.jpg      ← Chapter 5 — Through the Distance
│   ├── photo6.jpg      ← Chapter 6 — Becoming a Team
│   ├── photo7.jpg      ← Chapter 7 — The Adventures
│   ├── photo8.jpg      ← Chapter 8 — The Quiet Moments
│   ├── photo9.jpg      ← Chapter 9 — The Realisation
│   └── photo10.jpg     ← Chapter 10 — Today, Looking Forward
├── audio/
│   └── background.mp3  ← (Optional) background music — see notes below
└── README.md
```

---

## Quick Customisation Guide

### 1. Drop your photos in

Simply place your 10 photos into the `img/` folder, named exactly:

```
photo1.jpg  photo2.jpg  …  photo10.jpg
```

- Any standard JPEG or PNG works fine (rename them to `.jpg` for simplicity)
- If a photo is missing, a tasteful illustrated placeholder appears automatically

### 2. Set the correct unlock date

Open `js/script.js` and find the `CONFIG` object near the top.

Change `CORRECT_DATE` to the date your riddle hints at (her birthdate, your anniversary, etc.):

```js
CORRECT_DATE: '05-04-2000',   // DD-MM-YYYY format
```

The lock screen validator accepts many natural formats, so she won't get blocked by punctuation:

| What she types | Accepted? |
|---|---|
| `5/4/2000` | ✅ |
| `05.04.2000` | ✅ |
| `5-4-00` | ✅ |
| `05042000` | ✅ |
| `05-04-2000` | ✅ |

### 3. Choose your riddle variant

Three riddle options are pre-written. Set `ACTIVE_RIDDLE` to `'A'`, `'B'`, or `'C'`:

```js
ACTIVE_RIDDLE: 'A',
```

**Option A** *(poetic / mysterious — default)*
> This lock opens for one date on earth —  
> the day the world quietly shifted for me.  
> *Whisper it, and I'll let you in.*

**Option B** *(intimate / you-and-me)*
> Before I had the words for what this was,  
> there was already a day I'd never forget.  
> *Tell me when you arrived.*

**Option C** *(playful / clever)*
> Of all the ordinary days the calendar holds,  
> one is not ordinary at all.  
> *Which one? You already know.*

### 4. Update chapter texts

Each story chapter has its own `text` field in `CONFIG.CHAPTERS`. Just replace the placeholder copy with your real memories:

```js
{
  label: 'Chapter I',
  title: 'The First Meeting',
  text:  `Your actual memory of how you met goes here.`,
},
```

### 5. Update the proposal question and celebration text

```js
PROPOSAL_QUESTION: 'Will you marry me?',

CELEB_PARAGRAPHS: [
  `Your heartfelt paragraph 1...`,
  `Your heartfelt paragraph 2...`,
  `Your closing line.`,
],
```

### 6. Update names

```js
HER_NAME:    'Dipali',
SENDER_NAME: 'Kunal',
```

### 7. Add background music (optional)

1. Drop your audio file into an `audio/` folder as `audio/background.mp3`
2. In `index.html`, un-comment this line inside `<audio id="bgAudio">`:
   ```html
   <source src="audio/background.mp3" type="audio/mpeg" />
   ```
3. Music starts **muted by default**. She must tap the ♪ button to play it — fully optional, never auto-plays.

---

## Deploying to GitHub Pages

1. Create a new **private** GitHub repository (e.g., `proposal-dipali`)
2. Push this folder's contents to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "initial"
   git remote add origin https://github.com/YOUR_USERNAME/proposal-dipali.git
   git push -u origin main
   ```
3. Go to **Settings → Pages → Source → main branch → / (root)**
4. Save. GitHub will give you a URL like `https://YOUR_USERNAME.github.io/proposal-dipali/`
5. Share that URL with Dipali ✨

> **Note:** Keep the repo private so only you can see the source code.  
> GitHub Pages still serves the site publicly — so don't share the URL until you're ready.

---

## The Full Written Content

### Lock Screen — Chosen Riddle (Option A)
> This lock opens for one date on earth —  
> the day the world quietly shifted for me.  
> *Whisper it, and I'll let you in.*

---

### Story Chapters — Full Text

**Chapter I — The First Meeting**
> I didn't know what was happening that day. I just knew something was different — the way you laughed, the way you spoke, the way the room felt a little less ordinary when you were in it. I didn't know yet. But something in me quietly did.

**Chapter II — The Nerves**
> I rehearsed things to say. I typed and deleted messages more times than I'll ever admit. You made me nervous in the very best way — the kind that tells you something real is beginning, even before you have the words for it.

**Chapter III — The First Spark**
> There was a moment — a laugh, or maybe the tail end of a late conversation — when I stopped pretending this was nothing. Something had quietly caught fire, and I think we both felt it at the same time, and didn't say anything, and that said everything.

**Chapter IV — Getting Closer**
> I learned you: your habits, your humour, the face you make when you're about to say something sharp and funny. The inside jokes were forming before I even noticed. The world started sorting itself into before-you and after-you.

**Chapter V — Through the Distance**
> There were harder days — stretched schedules, missed calls, the peculiar ache of wanting someone nearby when they can't be. But you showed me that the hard parts don't break what's real. They just show you what it's made of.

**Chapter VI — Becoming a Team**
> There was a shift — subtle and then sudden — from "I" to "we." Showing up for the hard days. Holding space when it was needed. Realising that "home" had quietly become a person, not a place.

**Chapter VII — The Adventures**
> Every trip, every spontaneous plan, every moment we decided to just go — you make ordinary places feel worth remembering. I'd go anywhere with you. I plan to.

**Chapter VIII — The Quiet Moments**
> The unremarkable ones are the ones I love most. A lazy afternoon. A long call about nothing. The silence that doesn't need filling. In the quiet, I found my favourite place in the world — being near you.

**Chapter IX — The Realisation**
> It wasn't one moment — it was the accumulation of a hundred small ones. And then one day, it was just clear: I don't want to do this life with anyone else. I want to do it with you.

**Chapter X — Today, Looking Forward**
> Here we are. All those chapters — every nervous moment, every quiet afternoon, every hard day we figured out together — they've all been leading here. And now, there's just one thing left to ask…

---

### Proposal Moment
> *Dipali,*  
> **Will you marry me?**

---

### Celebration — Closing Message
> From the first nervous message to a hundred quiet evenings — from every chapter we lived and every one we haven't written yet — thank you for being the story I never want to finish.

> You are my favourite adventure, my favourite silence, my favourite reason to come home. Now we get to build the rest of it, together.

> All my love, always.

*— Kunal*

---

## Technical Notes

- **No frameworks, no build step** — open `index.html` directly in a browser to test locally
- **Accessibility:** full `prefers-reduced-motion` support, visible focus states, semantic HTML, ARIA labels, sr-only labels on the lock screen input
- **Performance:** all animations use CSS `transform` and `opacity` only (GPU-composited layers)
- **Privacy:** the correct date is only in `js/script.js` — it is never sent anywhere
