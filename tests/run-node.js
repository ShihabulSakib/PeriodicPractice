#!/usr/bin/env node
// Dev-only test runner: node tests/run-node.js   (exit code 0 = all green)
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const ctx = { console };
ctx.window = ctx;
ctx.globalThis = ctx;
vm.createContext(ctx);
for (const f of ['js/data.js', 'js/storage.js', 'js/quiz.js', 'tests/assertions.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
}
const results = ctx.PTPTests.runAll(ctx.ELEMENTS, ctx.OTHER_CELLS, ctx.TABLE_META, ctx.Quiz, ctx.Store);

// Cross-check the inlined SCHOOL table and the mass rule against the JSON source.
const json = JSON.parse(fs.readFileSync(path.join(root, 'hsc_physics_chemistry_constants.json'), 'utf8'));
const school = new Map(json.common_hsc_atomic_masses.map(r => [r.symbol, Number(r.relative_atomic_mass_school)]));
const check = (name, fn) => { const d = fn(); results.push({ name, ok: !d, detail: d || '' }); };
check('SCHOOL table equals the JSON school values', () =>
  Object.entries(ctx.PTPTests.SCHOOL).filter(([s, v]) => school.get(s) !== v).map(([s]) => s).join(', '));
check('Mass rule fully applied: no derived element is present in the JSON', () =>
  ctx.ELEMENTS.filter(e => e.massSource === 'derived' && school.has(e.symbol)).map(e => e.symbol).join(', '));

let failed = 0;
for (const r of results) {
  if (!r.ok) failed++;
  console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.ok ? '' : '  -> ' + r.detail}`);
}
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
