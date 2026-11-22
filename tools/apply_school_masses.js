#!/usr/bin/env node
// Usage: node tools/apply_school_masses.js [--check]
// Rule (agreed with the user, 2026-11-22):
//   only massSource "derived" elements present in hsc_physics_chemistry_constants.json are changed:
//   atomicMass <- relative_atomic_mass_school, massSource <- "school".
//   "user" values are never touched. Idempotent. Text-level patch keeps formatting intact.
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dataPath = path.join(root, 'js', 'data.js');
const json = JSON.parse(fs.readFileSync(path.join(root, 'hsc_physics_chemistry_constants.json'), 'utf8'));
const school = new Map(json.common_hsc_atomic_masses.map(r => [r.symbol, Number(r.relative_atomic_mass_school)]));
const check = process.argv.includes('--check');

const original = fs.readFileSync(dataPath, 'utf8');
const changes = [];
let src = original.replace(/^  \{"atomicNumber".*$/gm, line => {
  const el = JSON.parse(line.trim().replace(/,$/, ''));
  if (el.massSource !== 'derived' || !school.has(el.symbol)) return line;
  const v = school.get(el.symbol);
  changes.push(`${el.symbol}: ${el.atomicMass} -> ${v}`);
  return line
    .replace(/"atomicMass": [0-9.]+,/, `"atomicMass": ${v},`) // does not match "atomicMassPrecise"
    .replace('"massSource": "derived"', '"massSource": "school"');
});

const count = s => (src.match(new RegExp(`"massSource": "${s}"`, 'g')) || []).length;
src = src.replace(
  /"userMassCount": \d+,\s*\n\s*("schoolMassCount": \d+,\s*\n\s*)?"derivedMassCount": \d+/,
  `"userMassCount": ${count('user')},\n  "schoolMassCount": ${count('school')},\n  "derivedMassCount": ${count('derived')}`
);

if (check) {
  const metaStale = src !== original && changes.length === 0;
  if (changes.length || metaStale) {
    console.log('PENDING:\n' + (changes.join('\n') || 'TABLE_META counts out of date'));
    process.exit(1);
  }
  console.log('OK: nothing to change');
  process.exit(0);
}
fs.writeFileSync(dataPath, src);
console.log(`Applied ${changes.length} change(s):\n${changes.join('\n')}`);
console.log(`Counts: user ${count('user')}, school ${count('school')}, derived ${count('derived')}`);
