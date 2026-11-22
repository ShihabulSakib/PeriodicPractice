# Periodic Table Practice (HSC & Engineering Admission PWA)

Mobile-first, offline-capable static web app for practicing the **59 essential elements** required for Bangladesh HSC and engineering admission exams (BUET, CUET, KUET, RUET, IUT, DU A-unit).

## Features
- **Interactive 18-column Periodic Table** of the 59 essential elements (with the remaining 59 dimmed for spatial context), category colours, symbol/number/mass toggle, 2× zoom, and detailed HSC bottom sheets.
- **Practice modes**:
  - **MCQ (4 or 6 options)** across Symbol ↔ Name, Number ↔ Symbol, Period & Group, Exam Atomic Mass, and Grid Cell → Element.
  - **Position mode**: two-step Period (1–7) + Group (1–18 or Lanthanoid/Actinoid series) drill plus reverse cell-to-symbol questions.
  - **Typing mode**: case-insensitive name/symbol matching (including alternate spellings such as *Sulphur*, *Aluminum*, *Cesium*, and Latin names) and exam mass / ±0.15 precise mass tolerance.
- **Leitner 3-box spaced repetition** stored in `localStorage` (`ptp.v1`), weak-element drill, JSON export/import backup, and HSC 41 d-block rule toggle.

## Atomic Mass Rule
1. **27 `user` masses** are taken directly from the student's collected list (e.g. `Cl 35.5`, `Cu 63.5`, `Zn 65.4`, `Co 59`, `Hg 200.5`).
2. **12 `school` masses** are verified against `hsc_physics_chemistry_constants.json` (`relative_atomic_mass_school`, e.g. `Sn 119`).
3. **20 `derived` masses** are marked with a subtle `unverified †` indicator in the detail sheet so they can be cross-checked with the NCTB textbook table.

## Deploy to GitHub Pages
1. Push this repository to GitHub.
2. Open **Settings → Pages** in your GitHub repository.
3. Under **Build and deployment**, select **Deploy from a branch**, choose **`main`** (or `master`) and **`/ (root)`**, then click **Save**.
4. Wait ~1 minute and open `https://<your-username>.github.io/<repo-name>/`.
5. **Ship updates**: whenever you edit files, bump `VERSION` in `sw.js` (e.g. `'v1.0.1'`). Installed users will see a non-blocking *"New version available → Reload"* prompt.

## Install on Your Phone
- **Android (Chrome)**: Open the deployed URL → tap the 3-dot browser menu → **Install app** (or **Add to Home screen**).
- **iOS (Safari)**: Open the deployed URL → tap **Share** → **Add to Home Screen**.
- **Direct local file (`file://`)**: You can also copy the folder to your phone and open `index.html` directly; service worker registration fails silently and all features work.

## Offline Verification Checklist
1. Open the deployed URL once while online.
2. Turn on **Airplane mode**.
3. Reload the page and switch across **Table · Practice · Review · Settings**.
4. Answer several questions, reload again, and confirm your accuracy and Leitner boxes persist.

## Development & Tests
- Run the automated assertion suite in Node:
  ```bash
  node tests/run-node.js
  node tools/apply_school_masses.js --check
  ```
- Or open `tests.html` in any browser.
