# Progress (handoff log)

Read this first. Then `docs/AGENT_PROMPT.md` (product spec) and `docs/IMPLEMENTATION_PLAN.md` (design).
If they conflict, the plan + Decisions log below win (they record later user decisions).

## Milestones

- [x] M0 Repo bootstrap + school-mass patch of `js/data.js`
- [x] M1 Skeleton, Table screen, detail sheet
- [x] M2 `quiz.js` generators + tests (`node tests/run-node.js`, `tests.html`)
- [x] M3 MCQ mode UI (4/6 options), feedback, summary
- [x] M4 Position + Typing modes
- [x] M5 Storage/Leitner, Review, Settings (export/import)
- [x] M6 PWA: manifest, icons, service worker, update toast, README
- [x] M7 Final QA pass + report

**Status:** Complete. All 37 Node assertions and 38 browser assertions (including 360×780 mobile layout and tap-target height checks) pass (`data-result="pass"`).

## Decisions log

1. **Mass rule (user, 2026-11-22):** `user` masses are never changed (Zn stays 65.4). `derived` elements present in
   `hsc_physics_chemistry_constants.json` took `relative_atomic_mass_school` and became `massSource: "school"`
   (12: He Li Be B F Ne Si Ar Se Sn Pt U; only Sn changed numerically, 118.7 -> 119). The remaining 20 stay `derived`
   and show an "unverified †" marker. Applied by `tools/apply_school_masses.js` (idempotent; `--check` prints OK).
2. **Ar and Ca both have exam mass 40.** Mass generators never offer an equal exam mass as a distractor.
3. `data.js` moved to `js/data.js`. Dev-only folders: `tests/`, `tools/`, `docs/`. The JSON stays at the root and is
   not loaded at runtime nor precached.

## Deviations from AGENT_PROMPT.md

- `js/data.js` was patched once via `tools/apply_school_masses.js` (user-approved) to add the 12 `"school"` mass values. `docs/AGENT_PROMPT.md` was updated to match.
- Added `tests/assertions.js`, `tests/run-node.js`, `tools/apply_school_masses.js`, `tools/make-icons.sh`, and `docs/IMPLEMENTATION_PLAN.md` + `docs/PROGRESS.md` so any agent or developer can verify and maintain the repository from the CLI as well as the browser.
