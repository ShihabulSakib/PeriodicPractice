(function (root) {
'use strict';
const VERSION = 1;
let KEY = 'ptp.v1';
const DEFAULT_SETTINGS = {
optionCount: 4, hscBlocks: true, showClassical: false, massDisplay: 'both',
autoAdvance: false, haptics: true, theme: 'auto', tableShow: 'symbols', zoom: 1, legend: false,
launcher: { mode: 'mcq', topics: ['names', 'numbers', 'position', 'mass', 'cell'], deck: 'all', tag: 'aufbau-exception', length: 20 }
};
const clone = o => JSON.parse(JSON.stringify(o));
const isObj = o => !!o && typeof o === 'object' && !Array.isArray(o);
function defaults() {
return { version: VERSION, stats: {}, history: [], settings: clone(DEFAULT_SETTINGS), bestStreak: 0 };
}
function ls() {
try {
const s = root.localStorage;
s.setItem('__ptp', '1');
s.removeItem('__ptp');
return s;
} catch (e) { return null; }
}
function normalize(d) {
const st = isObj(d.settings) ? d.settings : {};
const stats = {};
if (isObj(d.stats)) {
for (const k of Object.keys(d.stats)) {
const s = d.stats[k];
if (isObj(s)) stats[k] = { seen: +s.seen || 0, correct: +s.correct || 0, boxes: isObj(s.boxes) ? Object.assign({}, s.boxes) : {} };
}
}
return {
version: VERSION,
stats,
history: Array.isArray(d.history) ? d.history.filter(isObj).slice(-10) : [],
settings: Object.assign(clone(DEFAULT_SETTINGS), st, {
launcher: Object.assign(clone(DEFAULT_SETTINGS.launcher), isObj(st.launcher) ? st.launcher : {})
}),
bestStreak: +d.bestStreak || 0
};
}
function migrate(d) {
if (!isObj(d)) return defaults();
switch (d.version) {
case 1: return normalize(d);
default: return defaults();
}
}
function load() {
const s = ls();
if (!s) return defaults();
try {
const raw = s.getItem(KEY);
return raw ? migrate(JSON.parse(raw)) : defaults();
} catch (e) { return defaults(); }
}
function save(data) {
const s = ls();
if (!s) return false;
try { s.setItem(KEY, JSON.stringify(data)); return true; } catch (e) { return false; }
}
function record(data, sym, type, ok) {
const prev = data.stats[sym] || { seen: 0, correct: 0, boxes: {} };
const box = prev.boxes[type] || 1;
const next = {
seen: prev.seen + 1,
correct: prev.correct + (ok ? 1 : 0),
boxes: Object.assign({}, prev.boxes, { [type]: ok ? Math.min(3, box + 1) : 1 })
};
return Object.assign({}, data, { stats: Object.assign({}, data.stats, { [sym]: next }) });
}
function pushHistory(data, entry) {
return Object.assign({}, data, { history: data.history.concat([entry]).slice(-10) });
}
function setSettings(data, patch) {
return Object.assign({}, data, { settings: Object.assign({}, data.settings, patch) });
}
function reset(data) {
return Object.assign(defaults(), { settings: clone(data.settings) });
}
function exportText(data) { return JSON.stringify(Object.assign({ app: 'ptp' }, data)); }
function importText(text) {
let d;
try { d = JSON.parse(String(text || '').trim()); } catch (e) { return { ok: false, error: 'not valid JSON' }; }
if (!isObj(d) || typeof d.version !== 'number') return { ok: false, error: 'missing version' };
if (d.version > VERSION) return { ok: false, error: 'made by a newer app version' };
if (!isObj(d.stats)) return { ok: false, error: 'missing stats' };
return { ok: true, data: migrate(d) };
}
function useKey(k) { KEY = k; }
root.Store = { VERSION, DEFAULT_SETTINGS, defaults, load, save, migrate, record, pushHistory, setSettings, reset, exportText, importText, useKey };
})(typeof window !== 'undefined' ? window : globalThis);
