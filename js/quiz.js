(function (root) {
'use strict';
const LAN = 'Lanthanoid series', ACT = 'Actinoid series', MASS_GAP = 0.3;
const CLASSICAL = [null, 'IA', 'IIA', 'IIIB', 'IVB', 'VB', 'VIB', 'VIIB', 'VIIIB', 'VIIIB', 'VIIIB',
'IB', 'IIB', 'IIIA', 'IVA', 'VA', 'VIA', 'VIIA', 'VIIIA'];
const CAT_LABEL = {
'alkali-metal': 'Alkali metal', 'alkaline-earth-metal': 'Alkaline earth metal',
'transition-metal': 'Transition metal', 'post-transition-metal': 'Post-transition metal',
metalloid: 'Metalloid', 'reactive-nonmetal': 'Nonmetal', halogen: 'Halogen',
'noble-gas': 'Noble gas', lanthanoid: 'Lanthanoid', actinoid: 'Actinoid'
};
const LOOKALIKES = [
['Co', 'Cu', 'Cr', 'Cs', 'Ca', 'Cd', 'C', 'Cl'], ['Sn', 'Sb', 'Si', 'S', 'Se', 'Sc', 'Sr'],
['Pt', 'Pd', 'Pb', 'P'], ['Ag', 'Au', 'As', 'Al', 'Ar', 'Ac'], ['Na', 'Ne', 'Ni', 'N'],
['Mg', 'Mn', 'Mo'], ['Ti', 'Te', 'Th'], ['B', 'Be', 'Ba', 'Bi', 'Br'], ['K', 'Kr'],
['Ga', 'Ge'], ['Rb', 'Rn'], ['Hg', 'H', 'He'], ['F', 'Fe'], ['I', 'U'], ['Li', 'La'],
['Zn', 'Sn', 'Se'], ['Xe', 'Kr', 'Ar', 'Ne']
];
const LOOK = new Map();
for (const set of LOOKALIKES) for (const s of set) {
const m = LOOK.get(s) || new Set();
set.forEach(x => { if (x !== s) m.add(x); });
LOOK.set(s, m);
}
const TYPES = ['symbol-name', 'name-symbol', 'number-symbol', 'symbol-number', 'number-name',
'symbol-period', 'symbol-group', 'symbol-mass', 'mass-symbol', 'cell-element', 'element-position'];
const TOPICS = {
names: ['symbol-name', 'name-symbol'], numbers: ['number-symbol', 'symbol-number', 'number-name'],
position: ['symbol-period', 'symbol-group', 'element-position'],
mass: ['symbol-mass', 'mass-symbol'], cell: ['cell-element']
};
const TYPING_TYPES = ['symbol-name', 'name-symbol', 'number-symbol', 'symbol-number', 'symbol-mass'];
const BOX_WEIGHT = { 1: 3, 2: 2, 3: 1 };
const all = () => root.ELEMENTS || [];
const isF = el => el.iupacGroup == null;
const seriesOf = el => (el.category === 'lanthanoid' ? LAN : ACT);
const groupText = (g, cls) => `Group ${g}${cls ? ` (${CLASSICAL[g]})` : ''}`;
const groupLabel = (el, cls) => (isF(el) ? seriesOf(el) : groupText(el.iupacGroup, cls));
const posText = (p, lbl) => `Period ${p}, ${lbl}`;
const fmtMass = m => String(m);
const decimals = m => { const s = String(m), i = s.indexOf('.'); return i < 0 ? 0 : s.length - i - 1; };
function rng(seed) {
let a = seed >>> 0;
return () => {
a = (a + 0x6D2B79F5) >>> 0;
let t = Math.imul(a ^ (a >>> 15), a | 1);
t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
}
function shuffle(arr, r) {
const a = arr.slice();
for (let i = a.length - 1; i > 0; i--) {
const j = Math.floor(r() * (i + 1)), t = a[i];
a[i] = a[j]; a[j] = t;
}
return a;
}
const sortBy = (arr, key) => arr.map(x => [key(x), x]).sort((p, q) => p[0] - q[0]).map(p => p[1]);
function take(correct, cands, k) {
const seen = new Set([String(correct)]), out = [];
for (const c of cands) {
if (out.length >= k) break;
const s = String(c);
if (!seen.has(s)) { seen.add(s); out.push(s); }
}
return out;
}
function finalize(correct, distractors, r) {
const c = String(correct), options = shuffle([c].concat(distractors), r);
return { options, correctIndex: options.indexOf(c) };
}
function poolFor(el, deck, k) {
const inDeck = deck.filter(e => e.symbol !== el.symbol);
return inDeck.length >= k * 2 ? inDeck : all().filter(e => e.symbol !== el.symbol);
}
function similar(el, pool, k, r) {
const look = LOOK.get(el.symbol) || new Set();
const isLook = e => look.has(e.symbol) || e.symbol[0] === el.symbol[0];
const isNear = e => (!isF(e) && !isF(el) && e.iupacGroup === el.iupacGroup) ||
(e.period === el.period && Math.abs(e.atomicNumber - el.atomicNumber) <= 3);
const looks = shuffle(pool.filter(isLook), r);
const nears = shuffle(pool.filter(e => isNear(e) && !isLook(e)), r);
const n = Math.ceil(k / 2);
return looks.slice(0, n).concat(nears, looks.slice(n), shuffle(pool, r),
shuffle(all().filter(e => e.symbol !== el.symbol), r));
}
const elOpts = (el, c, fn) => finalize(fn(el), take(fn(el), similar(el, poolFor(el, c.deck, c.k), c.k, c.r).map(fn), c.k), c.r);
function numOpts(el, c) {
const z = el.atomicNumber;
const cands = sortBy([1, 2, 3, 4, 5, 6, -1, -2, -3, -4, -5, -6], d => Math.abs(d) + c.r() * 3)
.map(d => z + d).filter(v => v >= 1 && v <= 118);
return finalize(z, take(z, cands, c.k), c.r);
}
function periodOpts(el, c) {
const ans = `Period ${el.period}`;
const ps = sortBy([1, 2, 3, 4, 5, 6, 7].filter(p => p !== el.period), p => Math.abs(p - el.period) + c.r() * 1.5);
return finalize(ans, take(ans, ps.map(p => `Period ${p}`), c.k), c.r);
}
function groupOpts(el, c) {
if (isF(el)) {
const ans = seriesOf(el), other = ans === LAN ? ACT : LAN;
const gs = sortBy([2, 3, 4, 5, 6, 7], g => Math.abs(g - 3) + c.r() * 2).map(g => groupText(g, c.cls));
return finalize(ans, take(ans, [other].concat(gs), c.k), c.r);
}
const g = el.iupacGroup, ans = groupText(g, c.cls), gs = [];
for (let x = 1; x <= 18; x++) if (x !== g) gs.push(x);
return finalize(ans, take(ans, sortBy(gs, x => Math.abs(x - g) + c.r() * 2.5).map(x => groupText(x, c.cls)), c.k), c.r);
}
function posOpts(el, c) {
const p = el.period;
if (isF(el)) {
const s = seriesOf(el), o = s === LAN ? ACT : LAN, alt = p === 6 ? 7 : 6;
const g3 = groupText(3, c.cls), g4 = groupText(4, c.cls);
const cands = shuffle([[p, o], [alt, s], [p, g3], [alt, o]], c.r)
.concat(shuffle([[p, g4], [alt, g3], [p - 1, s], [alt, g4]], c.r)).map(([pp, l]) => posText(pp, l));
return finalize(posText(p, s), take(posText(p, s), cands, c.k), c.r);
}
const g = el.iupacGroup, ans = posText(p, groupText(g, c.cls)), raw = [];
for (let dp = -2; dp <= 2; dp++) for (let dg = -3; dg <= 3; dg++) {
const pp = p + dp, gg = g + dg;
if ((dp || dg) && pp >= 1 && pp <= 7 && gg >= 1 && gg <= 18) raw.push({ pp, gg, s: Math.abs(dp) + Math.abs(dg) + c.r() * 1.5 });
}
return finalize(ans, take(ans, sortBy(raw, x => x.s).map(x => posText(x.pp, groupText(x.gg, c.cls))), c.k), c.r);
}
function massOpts(el, c) {
const m = el.atomicMass, dec = decimals(m);
const base = dec === 0 ? 1 : (dec === 1 && String(m).endsWith('.5') ? 0.5 : 0.3);
const neigh = sortBy(all().filter(e => e.symbol !== el.symbol && Math.abs(e.atomicMass - m) <= m * 0.15),
e => Math.abs(e.atomicMass - m) / m + c.r() * 0.04).map(e => e.atomicMass);
const steps = [];
for (let n = 1; n <= 10; n++) {
const sign = c.r() < 0.5 ? 1 : -1;
steps.push(+(m + sign * base * n).toFixed(dec), +(m - sign * base * n).toFixed(dec));
}
const half = Math.ceil(c.k / 2);
const cands = neigh.slice(0, half).concat(steps.slice(0, 4), neigh.slice(half), steps.slice(4))
.filter(v => v > 0 && Math.abs(v - m) >= MASS_GAP - 1e-9 && Math.abs(v - el.atomicMassPrecise) >= MASS_GAP - 1e-9).map(fmtMass);
return finalize(fmtMass(m), take(fmtMass(m), cands, c.k), c.r);
}
function massSymOpts(el, c) {
const m = el.atomicMass, diff = e => Math.abs(e.atomicMass - m) > 1e-9;
const sorted = sortBy(poolFor(el, c.deck, c.k).filter(diff), e => Math.abs(e.atomicMass - m) / m + c.r() * 0.05);
const cands = sorted.slice(0, c.k - 1).concat(shuffle(sorted.slice(c.k - 1), c.r),
shuffle(all().filter(e => e.symbol !== el.symbol && diff(e)), c.r)).map(e => e.symbol);
return finalize(el.symbol, take(el.symbol, cands, c.k), c.r);
}
function cellOpts(el, c) {
const pool = poolFor(el, c.deck, c.k);
const close = shuffle(pool.filter(e => Math.abs(e.gridRow - el.gridRow) + Math.abs(e.gridCol - el.gridCol) <= 2), c.r);
const cands = close.slice(0, Math.ceil(c.k / 2)).concat(similar(el, pool, c.k, c.r)).map(e => e.symbol);
return finalize(el.symbol, take(el.symbol, cands, c.k), c.r);
}
const GEN = {
'symbol-name': (el, c) => Object.assign({ prompt: el.symbol, ask: 'Which element has this symbol?' }, elOpts(el, c, e => e.name)),
'name-symbol': (el, c) => Object.assign({ prompt: el.name, ask: 'What is the symbol?' }, elOpts(el, c, e => e.symbol)),
'number-symbol': (el, c) => Object.assign({ prompt: String(el.atomicNumber), ask: 'Which element has this atomic number?' }, elOpts(el, c, e => e.symbol)),
'number-name': (el, c) => Object.assign({ prompt: String(el.atomicNumber), ask: 'Name the element with this atomic number' }, elOpts(el, c, e => e.name)),
'symbol-number': (el, c) => Object.assign({ prompt: el.symbol, sub: el.name, ask: 'What is its atomic number?' }, numOpts(el, c)),
'symbol-period': (el, c) => Object.assign({ prompt: el.symbol, sub: el.name, ask: 'Which period?' }, periodOpts(el, c)),
'symbol-group': (el, c) => Object.assign({ prompt: el.symbol, sub: el.name, ask: 'Which group?' }, groupOpts(el, c)),
'symbol-mass': (el, c) => Object.assign({ prompt: el.symbol, sub: el.name, ask: 'Exam atomic mass?' }, massOpts(el, c)),
'mass-symbol': (el, c) => Object.assign({ prompt: fmtMass(el.atomicMass), ask: 'Which element has this exam atomic mass?' }, massSymOpts(el, c)),
'cell-element': (el, c) => Object.assign({ prompt: '', ask: 'Which element is in the highlighted cell?', cell: { row: el.gridRow, col: el.gridCol } }, cellOpts(el, c)),
'element-position': (el, c) => Object.assign({ prompt: el.symbol, sub: el.name, ask: 'Where is it in the table?' }, posOpts(el, c))
};
function explain(el) {
const pos = isF(el) ? `period ${el.period}, ${seriesOf(el)}` : `period ${el.period}, group ${el.iupacGroup} (${el.classicalGroup})`;
return `${el.symbol} (${el.name}), Z = ${el.atomicNumber}, is in ${pos}; ${CAT_LABEL[el.category].toLowerCase()}; exam mass ${fmtMass(el.atomicMass)}.`;
}
let seq = 0;
const ctxOf = (deck, settings, r) => ({
deck: deck && deck.length ? deck : all(),
k: (settings && Number(settings.optionCount) === 6 ? 6 : 4) - 1,
r: r || Math.random, cls: !!(settings && settings.showClassical)
});
const pickEl = (el, c) => el || c.deck[Math.floor(c.r() * c.deck.length)];
function makeQuestion({ type, element, deck, settings, rng: r }) {
const gen = GEN[type];
if (!gen) throw new Error('Unknown question type: ' + type);
const c = ctxOf(deck, settings, r), el = pickEl(element, c), q = gen(el, c);
return {
id: `${type}:${el.symbol}:${++seq}`, type, kind: 'mcq', symbol: el.symbol, prompt: q.prompt,
promptExtra: { ask: q.ask, sub: q.sub || '', cell: q.cell || null },
options: q.options, correctIndex: q.correctIndex, explain: explain(el)
};
}
const TYPING_ASK = {
'symbol-name': ['symbol', 'Type the element name', 'text'],
'name-symbol': ['name', 'Type the symbol', 'text'],
'number-symbol': ['number', 'Type the symbol for this atomic number', 'text'],
'symbol-number': ['symbol', 'Type the atomic number', 'numeric'],
'symbol-mass': ['symbol', 'Type the exam atomic mass', 'decimal']
};
function makeTyping({ type, element, deck, rng: r }) {
const spec = TYPING_ASK[type];
if (!spec) throw new Error('Not a typing type: ' + type);
const el = pickEl(element, ctxOf(deck, null, r));
const prompt = spec[0] === 'name' ? el.name : spec[0] === 'number' ? String(el.atomicNumber) : el.symbol;
return {
id: `t:${type}:${el.symbol}:${++seq}`, type, kind: 'typing', symbol: el.symbol, prompt,
promptExtra: { ask: spec[1], sub: spec[0] === 'symbol' && type !== 'symbol-name' ? el.name : '', cell: null, inputmode: spec[2] },
explain: explain(el)
};
}
function makePosition({ element, deck, rng: r }) {
const el = pickEl(element, ctxOf(deck, null, r));
return {
id: `p:${el.symbol}:${++seq}`, type: 'element-position', kind: 'position', symbol: el.symbol,
prompt: el.symbol, promptExtra: { ask: 'Pick its period and group', sub: el.name, cell: null },
answer: { period: el.period, group: isF(el) ? (el.category === 'lanthanoid' ? 'lan' : 'act') : el.iupacGroup },
answerText: posText(el.period, groupLabel(el, false)), explain: explain(el)
};
}
function checkTyped(type, el, input) {
const raw = String(input == null ? '' : input).trim(), s = raw.toLowerCase();
if (type === 'symbol-name' || type === 'number-name') {
return { correct: s !== '' && [el.name].concat(el.alternateNames || []).some(n => n.toLowerCase() === s), canonical: el.name };
}
if (type === 'name-symbol' || type === 'number-symbol') return { correct: s === el.symbol.toLowerCase(), canonical: el.symbol };
if (type === 'symbol-number') return { correct: /^\d+$/.test(raw) && Number(raw) === el.atomicNumber, canonical: String(el.atomicNumber) };
if (type === 'symbol-mass') {
const x = /^\d+([.,]\d+)?$/.test(raw) ? parseFloat(raw.replace(',', '.')) : NaN;
return { correct: isFinite(x) && (Math.abs(x - el.atomicMass) < 1e-9 || Math.abs(x - el.atomicMassPrecise) <= 0.15 + 1e-9), canonical: fmtMass(el.atomicMass) };
}
throw new Error('Not a typing type: ' + type);
}
function checkPosition(el, period, group) {
const want = isF(el) ? (el.category === 'lanthanoid' ? 'lan' : 'act') : el.iupacGroup;
return { correct: period === el.period && group === want, periodOk: period === el.period, groupOk: group === want };
}
function pickNext({ deck, types, stats, recent, used, rng: r }) {
const rand = r || Math.random, rec = recent || [], usd = used || [];
const type = types[Math.floor(rand() * types.length)];
let resetUsed = false;
let cands = deck.filter(e => !usd.includes(e.symbol) && !rec.includes(e.symbol));
if (!cands.length) { resetUsed = true; cands = deck.filter(e => !rec.includes(e.symbol)); }
if (!cands.length) cands = deck.filter(e => e.symbol !== rec[rec.length - 1]);
if (!cands.length) cands = deck.slice();
const w = cands.map(e => BOX_WEIGHT[stats && stats[e.symbol] && stats[e.symbol].boxes ? stats[e.symbol].boxes[type] : 1] || 3);
let x = rand() * w.reduce((a, b) => a + b, 0), i = 0;
while (i < cands.length - 1 && x >= w[i]) { x -= w[i]; i++; }
return { element: cands[i], type, resetUsed };
}
function minBox(s) {
const v = s && s.boxes ? Object.values(s.boxes) : [];
return v.length ? Math.min.apply(null, v) : 1;
}
const isWeak = s => !!s && s.seen > 0 && minBox(s) === 1;
function weakList(stats, limit) {
const rows = all().filter(el => isWeak(stats && stats[el.symbol])).map(el => {
const s = stats[el.symbol];
return { el, seen: s.seen, acc: s.correct / s.seen, box: minBox(s) };
});
return sortBy(rows, x => x.box * 10 + x.acc).slice(0, limit || rows.length);
}
function buildDeck(spec, stats) {
const f = (spec && spec.filter) || 'all';
if (f === 'weak') return all().filter(el => isWeak(stats && stats[el.symbol]));
if (f === 'tag') return all().filter(el => el.examTags.includes(spec.tag));
if (f === 'symbols') { const set = new Set(spec.symbols || []); return all().filter(el => set.has(el.symbol)); }
return all().slice();
}
root.Quiz = {
TYPES, TOPICS, TYPING_TYPES, CLASSICAL, CAT_LABEL, LAN, ACT, MASS_GAP,
rng, shuffle, makeQuestion, makeTyping, makePosition, checkTyped, checkPosition,
pickNext, buildDeck, weakList, minBox, isF, seriesOf, groupLabel, groupText, fmtMass, explain
};
})(typeof window !== 'undefined' ? window : globalThis);
