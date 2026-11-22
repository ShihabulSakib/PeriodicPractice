# Task: Build a mobile-first Periodic Table Practice PWA (vanilla JS, GitHub Pages ready)

You are building a small static web app for a Bangladeshi HSC / engineering-admission student (BUET, CUET, KUET, RUET, IUT, DU A-unit). He will use it **on his phone**, so speed and thumb-friendly UI matter more than anything else.

The app lets him practice the **59 essential elements**: their **positions (period and group)**, **atomic numbers**, **symbols and names**, and **atomic masses** (exam values). It must include an **MCQ mode with 4 or 6 options** (user's choice).

## 0. Inputs you are given

- `data.js`, already generated and validated. **Do not edit any value in it.** It defines three globals:
  - `window.ELEMENTS`: the 59 essential elements with full detail.
  - `window.OTHER_CELLS`: the other 59 elements as `[Z, symbol, gridRow, gridCol]`, used only to draw dimmed tiles.
  - `window.TABLE_META`: grid metadata.
- Key fields on each element: `atomicNumber, symbol, name, alternateNames[], period, iupacGroup (null for La/Ac/Th/U), classicalGroup, block, hscBlock, category, gridRow, gridCol, examTags[], atomicMass, atomicMassPrecise, massSource ("user" | "derived"), massIsApprox?`
- `atomicMass` is the **exam value** and is what the quiz treats as correct. `atomicMassPrecise` is the IUPAC-style value; it is also accepted in typed-answer mode (±0.15).
- 27 masses are `massSource: "user"` (the student's own collected list). 32 are `"derived"` and still need verification by him. In the detail sheet, show a small subtle "unverified" marker (e.g. a dotted underline and a tooltip or footnote) for `derived` masses, so he knows which ones to double-check.

## 1. Hard constraints

- **Vanilla HTML, CSS and JS only.** No React, Vue, Tailwind, Bootstrap, jQuery, npm or build step. No CDN, external fonts or remote images. System font stack only.
- Total app size (excluding `data.js`) under about 60 KB. It must load instantly on a mid-range phone on a slow connection.
- **Mobile first**: design for 360–430 px wide portrait. Desktop must still work (centre the app in a max-width column of about 520 px).
- **Must run from GitHub Pages** (served under a sub-path like `https://user.github.io/repo-name/`). Therefore use **only relative paths** (`./style.css`, never `/style.css`), and set the manifest `start_url` and `scope` to `"./"`.
- **Must be an installable, offline-capable PWA** (see section 7).
- Must also still work when `index.html` is opened directly from phone storage (`file://`): no `fetch()` for local data (that is why data is a `.js` file), and the service worker registration must fail silently there.
- All persistence uses `localStorage` inside try/catch. The app must work if storage is unavailable.

## 2. Repository layout (GitHub Pages root = repo root)

```
/
├─ index.html
├─ manifest.webmanifest
├─ sw.js                  # service worker (must be at the root so its scope covers the app)
├─ .nojekyll              # empty file
├─ README.md              # how to deploy and install (short)
├─ css/
│  └─ style.css
├─ js/
│  ├─ data.js             # provided, unchanged
│  ├─ storage.js          # localStorage wrapper + Leitner state
│  ├─ quiz.js             # pure question generators (no DOM)
│  ├─ ui.js               # rendering helpers, screens
│  └─ app.js              # state, routing, event wiring, SW registration
├─ icons/
│  ├─ icon.svg
│  ├─ icon-192.png
│  ├─ icon-512.png
│  ├─ icon-maskable-512.png
│  └─ apple-touch-icon.png   # 180x180
└─ tests.html             # optional dev page: data and generator assertions
```

Load scripts with plain `<script src="js/...">` tags in order (data, storage, quiz, ui, app) with `defer`. Do not use ES modules, because they break on `file://`.

Create the icons yourself (a simple periodic-table-tile style icon: rounded square, a bold "Pt" or "Ac" symbol, atomic number in the corner). Write a small script (Node, Python or a canvas page) to render the PNGs from the SVG, and include the PNGs in the repo.

## 3. Screens

Use a **bottom tab bar** with 4 tabs (thumb reachable): **Table · Practice · Review · Settings**. Everything is a single page; switching tabs just swaps a container's content. Support the browser back button minimally via `location.hash` (`#table`, `#practice`, `#review`, `#settings`).

### 3.1 Table (browse)
- 18-column CSS Grid using `gridRow` / `gridCol`, plus the spacer row (row 8) and the two series placeholder tiles at (6,3) and (7,3) with labels `57-71` and `89-103`.
- Essential tiles are bright and show the **symbol**. Non-essential tiles (from `OTHER_CELLS`) are dimmed and are not tappable.
- Tiles are about 20 px wide on a phone, so keep the symbol font small (about 9–10 px) and do not require precise tapping for anything except opening the detail sheet.
- Tapping an essential tile opens a **bottom sheet** with: name, symbol, atomic number, period, IUPAC group and classical group (e.g. `11 / IB`; for f-series show "Lanthanoid series" or "Actinoid series"), block (modern) and HSC block (with a note on La/Ac/Th), the exam atomic mass, and the precise mass (with the "unverified" marker if `massSource === "derived"`, and "mass number of longest-lived isotope" if `massIsApprox`), plus exam tags as small chips.
- A toggle at the top: **"Show: symbols | numbers | masses"** that changes what each tile displays (this doubles as a quick study aid).
- Optional zoom button (1× / 2× with horizontal scroll) for easier reading.

### 3.2 Practice
A launcher screen with:
1. **Mode** (segmented buttons): **MCQ** (default), **Position**, **Typing**.
2. **Question topics** (multi-select chips): Symbol↔Name, Number↔Symbol, Position (period/group), Atomic mass, Grid cell → element. Default: all on.
3. **Deck filter**: All 59 / Only weak ones (Leitner box 1) / Only the tags chosen from a dropdown (e.g. `aufbau-exception`, `flame-test`, `3d-series`, `reactivity-series`).
4. **Session length**: 10 / 20 / 40 questions / endless.
5. **Start** button (large, bottom).

#### MCQ mode (required): 4 or 6 options
- Setting **"Options per question: 4 | 6"** (persisted; default 4). With 6 options use a 2×3 grid of large buttons; with 4 use 2×2. All option buttons are at least 48 px tall and sit in the lower half of the screen (thumb zone).
- Question types (each a pure generator in `quiz.js`, selectable by topic):
  1. `symbol→name`, `name→symbol`
  2. `number→symbol`, `symbol→number`, `number→name`
  3. `symbol→period`, `symbol→group` (f-series: see rule below)
  4. `symbol→mass`, `mass→symbol`
  5. `cell→element`: a mini 18-column grid with one cell highlighted; the options are symbols
  6. `element→period+group` as a combined option text like `Period 4, Group 11`
- **Distractor rules (important for quality):**
  - Options are unique and exactly 1 correct.
  - Distractors come from the **same deck** and are *plausible*: for symbols and names prefer elements from the same group, neighbours in the same period, or elements with look-alike symbols (e.g. `Co/Cu/Cr`, `Sn/Sb/Si`, `Ca/Cd/Cs`, `Pt/Pd/Pb`, `Ag/Au/As`). Mix so not all distractors are lookalikes.
  - For **atomic mass** questions, distractors are the exam masses of nearby elements (similar magnitude, within roughly ±15%) or the correct value ± a small step, and **must not equal the correct answer or its precise equivalent**. Example: for Cl (35.5) never show 35.45, and for Cu (63.5) never show 63.55. Format masses exactly as stored, with no forced decimals (`24`, `35.5`, `54.93`).
  - For **numbers**: distractors are within ±1 to ±6 of the correct number.
  - For **period/group**: distractors are neighbouring values. For groups use IUPAC numbers 1–18; show the classical label (e.g. `IB`) in brackets only if the "Show classical groups" setting is on.
- **f-series rule (La, Ac, Th, U):** these have `iupacGroup === null`. Group questions about them must offer the options **"Lanthanoid series"** or **"Actinoid series"** among the choices (plus normal group numbers as distractors), and the correct answer is the series (La → Lanthanoid; Ac, Th, U → Actinoid). Period is still asked normally (La 6; Ac, Th, U 7).
- After answering: instant feedback with **colour and a text/icon** (never colour alone), the correct option highlighted, and a one-line explanation card (e.g. "Cu is in period 4, group 11 (IB), a coinage metal; exam mass 63.5"). Optional `navigator.vibrate(30)` on wrong answers if the "Haptics" setting is on. A big **Next** button (also advance automatically after 1.2 s if the "Auto-advance" setting is on).
- Show progress (`7 / 20`), a current streak, and a thin progress bar.
- Keyboard shortcuts on desktop (keys 1–6, Enter for next) as a bonus; they must not interfere with mobile.

#### Position mode
- Show the element (name and symbol); the user answers **period (buttons 1–7)** then **group (buttons 1–18 in two rows of 9, plus two wide buttons "Lanthanoid series" / "Actinoid series")**. Score it correct only if both are right; show which part was wrong.
- Reverse variant: highlight a cell on the mini grid and ask for the symbol using a 4-or-6 option MCQ (same as `cell→element`).

#### Typing mode
- For symbol/name/number/mass questions with a text/number input (`inputmode="decimal"` for numbers so the numeric keypad appears).
- Name/symbol matching: `trim().toLowerCase()`; accept `name`, `symbol` or anything in `alternateNames` (so "Sulphur" and "Aluminum" are accepted); show the canonical spelling.
- Mass matching: correct if it equals `atomicMass` or is within ±0.15 of `atomicMassPrecise`; show both values afterwards.

### 3.3 Review
- Overall stats: accuracy, questions answered, best streak.
- **Weak elements** list (lowest accuracy or lowest Leitner box first) with a **"Drill weak ones"** button that starts a session on exactly those.
- Per-element accuracy table (tap a row to open the same detail sheet as the Table).
- Session history (last 10): date, topic mix, score.

### 3.4 Settings
- Options per MCQ question: 4 | 6
- HSC block rules (affects the block display and any block question): ON = La/Ac/Th are d-block (41 d / 27 f); OFF = modern IUPAC (40 d / 28 f).
- Show classical groups (IA, IIB, ...) next to IUPAC numbers
- Which mass to show in the detail sheet: exam | precise | both (quiz correctness always uses the exam value, plus the typed tolerance rule above)
- Auto-advance, Haptics, Theme (auto | light | dark)
- Reset progress (with confirm), Export / Import progress as a JSON text (copy / paste, no file picker needed)
- App version and an "Update available → Reload" row (see section 7)

## 4. Learning logic (Leitner, simple)

- Track per `(symbol, questionType)` a box 1–3: correct → move up one box (max 3); wrong → box 1.
- Question selection weights: box 1 = 3, box 2 = 2, box 3 = 1. Avoid repeating the same element within the last 5 questions. In a 10-question session no element appears twice unless the deck is smaller.
- Persist: `{version, stats: {sym: {seen, correct, boxes: {type: n}}}, history: [...], settings: {...}, bestStreak}` under a single key `ptp.v1`. Include a schema `version` and a small migration stub.

## 5. Code structure and quality

- `quiz.js` contains **pure functions** with the signature `makeQuestion({type, deck, settings, rng}) -> {id, type, prompt, promptExtra, options[], correctIndex, explain}`; `rng` is injectable so they can be unit-tested with a seeded generator.
- `ui.js` only renders; `app.js` owns state and events. Use event delegation on container elements; avoid per-tile listeners.
- No global mutable soup: one `state` object, one `render()` per screen.
- Accessibility: real `<button>` elements, `aria-label`s on tiles (e.g. "Copper, atomic number 29"), visible focus styles, `aria-live="polite"` for feedback, `prefers-reduced-motion` respected, sufficient contrast in light and dark mode.
- `tests.html` (optional but recommended): load `data.js` and `quiz.js` and run assertions, rendered as a pass/fail list:
  - 59 elements, unique atomic numbers, all grid positions across `ELEMENTS` + `OTHER_CELLS` are unique (118 total).
  - The 27 `massSource: "user"` masses equal the values in the spec table (section 9).
  - For each question type, generate 500 questions with a seeded rng and assert: unique options, exactly one correct, option count equals the setting (4 and 6), no distractor mass equals the correct mass or its `atomicMassPrecise`.
  - f-series group questions always include both series options and the right one is marked correct.

## 6. Mobile UI requirements

- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`; use `100dvh`; respect safe-area insets (`env(safe-area-inset-*)`) for the tab bar.
- Answer controls sit in the **bottom half**; big tap targets (min 44×44 px; options 48 px+).
- `touch-action: manipulation` (no double-tap zoom delay), no hover-dependent UI, `-webkit-tap-highlight-color: transparent`, `user-select: none` on tiles and buttons.
- Design tokens as CSS variables on `:root` (colours, radii, spacing); dark mode via `prefers-color-scheme` plus a manual override (`data-theme`).
- Colour-code tiles by `category` (alkali, alkaline earth, transition, post-transition, metalloid, nonmetal, halogen, noble gas, lanthanoid/actinoid), with a legend toggle. Keep the palette calm and high-contrast, and never rely on colour alone to signal correct/wrong.
- Animations are minimal (150 ms fades/transforms only).
- Set `<meta name="theme-color">` for both schemes, and add the iOS meta tags: `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `apple-touch-icon`.

## 7. PWA and GitHub Pages deployment

1. **`manifest.webmanifest`**: `name`, `short_name` ("PT Practice"), `start_url: "./"`, `scope: "./"`, `display: "standalone"`, `orientation: "portrait"`, `background_color`, `theme_color`, `icons` (192, 512, and a maskable 512) using relative paths.
2. **`sw.js`** (service worker at repo root):
   - `const VERSION = 'v1.0.0'; const CACHE = 'ptp-' + VERSION;`
   - Precache every static asset by relative URL (index, css, all js, icons, manifest).
   - Strategy: **cache-first** for the precached app shell; navigation requests fall back to cached `index.html` when offline. No network calls are needed otherwise.
   - On `activate`, delete old caches (`ptp-*` other than the current one). Use `skipWaiting` only via an explicit message from the page (do not force-reload users mid-quiz).
3. **Registration** in `app.js`: `if ('serviceWorker' in navigator && location.protocol.startsWith('http'))` register `./sw.js`; on `updatefound` + `installed` with an existing controller, show a non-blocking toast/row **"New version available. Reload"** that posts `SKIP_WAITING` and reloads. Fail silently on `file://`.
4. **Offline test checklist** (include in README): load once online, switch to airplane mode, reload, all screens work; progress persists.
5. **Deployment** (put in README, short): push to a GitHub repo → Settings → Pages → "Deploy from a branch" → `main` / `(root)`. Then open the URL on the phone and use *Add to Home Screen* (Chrome Android: menu → Install app; Safari iOS: Share → Add to Home Screen). Mention that bumping `VERSION` in `sw.js` is how updates reach installed copies.
6. Add `.nojekyll`. Do not rely on any server-side behaviour or a custom domain.

## 8. Build order (milestones; commit after each)

1. Skeleton: `index.html`, CSS tokens, tab bar, hash routing, `data.js` loaded, the Table screen with the detail sheet. Verify at 360 px width: no horizontal page scroll.
2. `quiz.js` generators plus `tests.html` (generators first, UI after).
3. MCQ mode UI (4/6 options), feedback, session summary.
4. Position mode and Typing mode.
5. Leitner storage, Review screen, Settings (including export/import).
6. PWA: manifest, icons, service worker, update toast, README with deploy steps.
7. Final pass: Lighthouse PWA/installability check (if available), contrast check, `tests.html` all green, size check.

## 9. Reference: the 27 user-supplied exam masses (must match `data.js`)

H 1 · C 12 · N 14 · O 16 · Na 23 · Mg 24 · Al 27 · P 31 · S 32 · Cl 35.5 · K 39.1 · Ca 40 · Cr 52 · Mn 54.93 · Fe 55.85 · Co 59 · Ni 58.7 · Cu 63.5 · Zn 65.4 · As 74.9 · Br 80 · Ag 108 · I 127 · Ba 137 · Au 197 · Hg 200.5 · Pb 207

Note: Co is 59 here (not 58.93) and Hg is 200.5 (not 200.6) on purpose; these are the exam values he collected. Do not "correct" them.

## 10. Acceptance criteria

- Opens and works from `https://<user>.github.io/<repo>/` and installs as a standalone app on Android Chrome; works fully offline afterwards.
- No horizontal page scroll at 360 px; all answer buttons are at least 44 px tall.
- MCQ mode works with both 4 and 6 options, in every question type, with unique options and exactly one correct answer (verified by `tests.html`).
- La, Ac, Th and U are handled correctly in all group and position questions.
- Mass questions never show an alternative representation of the correct value as a distractor.
- Progress survives reloads; export and import round-trips.
- No external network requests at runtime (check in DevTools).
- Finish with a short report: what was built, anything you deviated from, and any assumption you made.
