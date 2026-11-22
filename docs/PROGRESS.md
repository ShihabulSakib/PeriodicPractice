# Progress (handoff log)

Read this first. Then `docs/AGENT_PROMPT.md` (product spec) and `docs/IMPLEMENTATION_PLAN.md` (design).
If they conflict, the plan + Decisions log below win (they record later user decisions).

## Milestones

- [x] M0 Repo bootstrap + school-mass patch of `js/data.js`
- [ ] M1 Skeleton, Table screen, detail sheet
- [ ] M2 `quiz.js` generators + tests (`node tests/run-node.js`, `tests.html`)
- [ ] M3 MCQ mode UI (4/6 options), feedback, summary
- [ ] M4 Position + Typing modes
- [ ] M5 Storage/Leitner, Review, Settings (export/import)
- [ ] M6 PWA: manifest, icons, service worker, update toast, README
- [ ] M7 Final QA pass + report

**Next step:** M1.

## Decisions log

1. **Mass rule (user, 2026-11-22):** `user` masses are never changed (Zn stays 65.4). `derived` elements present in
   `hsc_physics_chemistry_constants.json` took `relative_atomic_mass_school` and became `massSource: "school"`
   (12: He Li Be B F Ne Si Ar Se Sn Pt U; only Sn changed numerically, 118.7 -> 119). The remaining 20 stay `derived`
   and show an "unverified" marker. Applied by `tools/apply_school_masses.js` (idempotent; `--check` must print OK).
2. **Ar and Ca both have exam mass 40.** Mass generators must never offer an equal exam mass as a distractor.
3. `data.js` moved to `js/data.js`. Dev-only folders: `tests/`, `tools/`, `docs/`. The JSON stays at the root and is
   not loaded at runtime nor precached.

## Deviations from AGENT_PROMPT.md

- `js/data.js` was patched once (user-approved). AGENT_PROMPT.md was updated to match.
