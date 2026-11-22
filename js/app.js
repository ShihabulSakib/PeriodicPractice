(function (root) {
'use strict';
const TABS = ['table', 'practice', 'review', 'settings'];
const TITLES = { table: 'Periodic Table', practice: 'Practice', review: 'Review & Leitner', settings: 'Settings' };
const bySym = new Map((root.ELEMENTS || []).map(e => [e.symbol, e]));
const state = {
tab: 'table', data: root.Store.load(), session: null,
sheetSym: null, lastTrigger: null, autoTimer: null, swWaiting: null
};
function applyTheme() {
const t = state.data.settings.theme;
if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
else delete document.documentElement.dataset.theme;
}
function persist(nextData) {
state.data = nextData;
root.Store.save(state.data);
applyTheme();
}
function clearAuto() {
if (state.autoTimer) { clearTimeout(state.autoTimer); state.autoTimer = null; }
}
function render() {
applyTheme();
const view = document.getElementById('view');
document.getElementById('screen-title').textContent = TITLES[state.tab] || 'Periodic Table';
document.getElementById('topbar-right').textContent = state.tab === 'table'
? (state.data.settings.hscBlocks ? 'HSC 41-d' : 'IUPAC') : `${state.data.settings.optionCount}-opt`;
for (const btn of document.querySelectorAll('#tabs .tab')) {
const on = btn.dataset.tab === state.tab;
btn.classList.toggle('active', on);
if (on) btn.setAttribute('aria-current', 'page'); else btn.removeAttribute('aria-current');
}
if (state.tab === 'table') view.innerHTML = root.UI.tableScreen(state.data.settings);
else if (state.tab === 'practice') {
if (!state.session) view.innerHTML = root.UI.launcherScreen(state.data.settings, state.data.stats);
else if (state.session.done) view.innerHTML = root.UI.summaryScreen(state.session);
else {
view.innerHTML = root.UI.quizScreen(state.session, state.data.settings);
const inp = document.getElementById('typing-input');
if (inp && !state.session.answered) inp.focus();
}
} else if (state.tab === 'review') view.innerHTML = root.UI.reviewScreen(state.data);
else if (state.tab === 'settings') view.innerHTML = root.UI.settingsScreen(state.data, !!state.swWaiting);
}
function openSheet(sym, trigger) {
const el = bySym.get(sym);
if (!el) return;
state.sheetSym = sym;
state.lastTrigger = trigger || document.activeElement;
const wrap = document.getElementById('sheet'), body = document.getElementById('sheet-body');
body.innerHTML = root.UI.detailSheet(el, state.data.settings);
wrap.hidden = false;
const closeBtn = body.querySelector('[data-action="close-sheet"]');
if (closeBtn) closeBtn.focus();
}
function closeSheet() {
const wrap = document.getElementById('sheet');
if (wrap.hidden) return;
wrap.hidden = true;
state.sheetSym = null;
if (state.lastTrigger && typeof state.lastTrigger.focus === 'function') state.lastTrigger.focus();
}
function showToast(msg, btnText, onBtn) {
const el = document.getElementById('toast');
el.innerHTML = `<span>${root.UI.esc(msg)}</span>` + (btnText ? `<button type="button" id="toast-btn">${root.UI.esc(btnText)}</button>` : '');
el.hidden = false;
if (btnText && onBtn) document.getElementById('toast-btn').onclick = () => { el.hidden = true; onBtn(); };
else setTimeout(() => { el.hidden = true; }, 2800);
}
function typesForSession(mode, topicKeys) {
if (mode === 'position') return ['element-position', 'cell-element'];
const out = [];
for (const k of topicKeys) for (const t of (root.Quiz.TOPICS[k] || [])) {
if (mode === 'typing' && !root.Quiz.TYPING_TYPES.includes(t)) continue;
out.push(t);
}
return out.length ? out : (mode === 'typing' ? ['symbol-name'] : ['symbol-name', 'name-symbol']);
}
function nextQuestion() {
clearAuto();
const s = state.session;
if (!s) return;
if (s.length && s.answeredCount >= s.length) {
s.done = true;
persist(root.Store.pushHistory(state.data, { t: Date.now(), mode: s.mode, topics: s.topics, n: s.answeredCount, correct: s.correct }));
return render();
}
const pick = root.Quiz.pickNext({ deck: s.deck, types: s.types, stats: state.data.stats, recent: s.recent, used: s.used });
s.used = pick.resetUsed ? [pick.element.symbol] : s.used.concat(pick.element.symbol);
s.recent = s.recent.concat(pick.element.symbol).slice(-5);
s.index = s.answeredCount;
s.answered = s.posPeriod = s.posGroup = null;
if (s.mode === 'typing') s.current = root.Quiz.makeTyping({ type: pick.type, element: pick.element, deck: s.deck });
else if (s.mode === 'position') {
s.current = Math.random() < 0.3
? root.Quiz.makeQuestion({ type: 'cell-element', element: pick.element, deck: s.deck, settings: state.data.settings })
: root.Quiz.makePosition({ element: pick.element, deck: s.deck });
} else s.current = root.Quiz.makeQuestion({ type: pick.type, element: pick.element, deck: s.deck, settings: state.data.settings });
render();
}
function startSession(customDeck) {
const L = state.data.settings.launcher;
const spec = customDeck ? { filter: 'symbols', symbols: customDeck }
: L.deck === 'weak' ? { filter: 'weak' } : L.deck === 'tag' ? { filter: 'tag', tag: L.tag } : { filter: 'all' };
const deck = root.Quiz.buildDeck(spec, state.data.stats);
if (!deck.length) return;
state.session = {
mode: L.mode, topics: L.topics.slice(), types: typesForSession(L.mode, L.topics), deck,
length: customDeck ? customDeck.length : Number(L.length) || 0,
index: 0, answeredCount: 0, correct: 0, streak: 0, bestStreak: 0,
recent: [], used: [], missed: [], current: null, answered: null, done: false, posPeriod: null, posGroup: null
};
nextQuestion();
}
function registerAnswer(correct, extra) {
const s = state.session, q = s.current;
s.answeredCount++;
if (correct) {
s.correct++;
if (++s.streak > s.bestStreak) s.bestStreak = s.streak;
} else {
s.streak = 0;
s.missed.push(q.symbol);
if (state.data.settings.haptics && navigator.vibrate) try { navigator.vibrate(30); } catch (e) {}
}
s.answered = Object.assign({ correct }, extra);
let next = root.Store.record(state.data, q.symbol, q.type, correct);
if (s.streak > (next.bestStreak || 0)) next = Object.assign({}, next, { bestStreak: s.streak });
persist(next);
render();
if (state.data.settings.autoAdvance) {
state.autoTimer = setTimeout(() => { if (state.session && state.session.answered) nextQuestion(); }, 1200);
}
}
function updateSetting(patch) {
persist(root.Store.setSettings(state.data, patch));
if (state.sheetSym) openSheet(state.sheetSym, state.lastTrigger);
render();
}
const updateLauncher = patch => updateSetting({ launcher: Object.assign({}, state.data.settings.launcher, patch) });
function finishPosition() {
const s = state.session, q = s.current, res = root.Quiz.checkPosition(bySym.get(q.symbol), s.posPeriod, s.posGroup);
registerAnswer(res.correct, { headline: `${res.periodOk ? 'Period ✓' : 'Period ✗'}, ${res.groupOk ? 'Group ✓' : 'Group ✗'} — ${q.answerText}` });
}
function onAction(action, btn) {
const val = btn.dataset.val;
if (action === 'open-sheet') return openSheet(btn.dataset.sym, btn);
if (action === 'close-sheet') return closeSheet();
if (action === 'table-show') return updateSetting({ tableShow: val });
if (action === 'toggle-zoom') return updateSetting({ zoom: state.data.settings.zoom === 2 ? 1 : 2 });
if (action === 'toggle-legend') return updateSetting({ legend: !state.data.settings.legend });
if (action === 'launch-mode') return updateLauncher({ mode: val });
if (action === 'launch-topic') {
const cur = state.data.settings.launcher.topics;
const next = cur.includes(val) ? cur.filter(x => x !== val) : cur.concat(val);
return updateLauncher({ topics: next.length ? next : [val] });
}
if (action === 'launch-deck') return updateLauncher({ deck: val });
if (action === 'launch-len') return updateLauncher({ length: Number(val) });
if (action === 'start-session' || action === 'restart-session') return startSession();
if (action === 'answer-mcq' && state.session && !state.session.answered) {
const idx = Number(btn.dataset.idx), q = state.session.current;
return registerAnswer(idx === q.correctIndex, { chosenIndex: idx, headline: 'Answer: ' + q.options[q.correctIndex] });
}
if (action === 'pos-period' && state.session && !state.session.answered) {
state.session.posPeriod = Number(val);
return state.session.posGroup != null ? finishPosition() : render();
}
if (action === 'pos-group' && state.session && !state.session.answered) {
state.session.posGroup = (val === 'lan' || val === 'act') ? val : Number(val);
return state.session.posPeriod != null ? finishPosition() : render();
}
if (action === 'next-question') return nextQuestion();
if (action === 'quit-session') {
clearAuto();
if (state.session && state.session.answeredCount > 0) {
state.session.done = true;
persist(root.Store.pushHistory(state.data, { t: Date.now(), mode: state.session.mode, topics: state.session.topics, n: state.session.answeredCount, correct: state.session.correct }));
} else state.session = null;
return render();
}
if (action === 'drill-missed') return startSession(Array.from(new Set(state.session.missed)));
if (action === 'back-launcher') { state.session = null; return render(); }
if (action === 'drill-weak') {
const syms = root.Quiz.weakList(state.data.stats).map(w => w.el.symbol);
if (!syms.length) return;
location.hash = '#practice'; state.tab = 'practice';
return startSession(syms);
}
if (action === 'set-opt') return updateSetting({ [btn.dataset.key]: Number(val) });
if (action === 'set-bool') return updateSetting({ [btn.dataset.key]: val === 'true' });
if (action === 'set-str') return updateSetting({ [btn.dataset.key]: val });
if (action === 'copy-export') {
const box = document.getElementById('export-box');
if (!box) return;
if (navigator.clipboard && navigator.clipboard.writeText) {
navigator.clipboard.writeText(box.value).then(() => showToast('Copied progress JSON'), () => box.select());
} else box.select();
}
if (action === 'import-json') {
const box = document.getElementById('export-box'), res = root.Store.importText(box ? box.value : '');
if (!res.ok) return showToast('Import failed: ' + res.error);
persist(res.data); render();
return showToast('Progress imported!');
}
if (action === 'reset-progress' && confirm('Reset all practice stats and Leitner boxes?')) {
persist(root.Store.reset(state.data)); render();
return showToast('Progress reset');
}
if (action === 'sw-reload' && state.swWaiting) state.swWaiting.postMessage('SKIP_WAITING');
}
function route() {
const h = (location.hash || '#table').replace(/^#/, '');
state.tab = TABS.includes(h) ? h : 'table';
clearAuto();
render();
}
function registerSW() {
if (!('serviceWorker' in navigator) || !location.protocol.startsWith('http')) return;
navigator.serviceWorker.register('./sw.js').then(reg => {
const promptUpdate = worker => {
state.swWaiting = worker;
if (state.tab === 'settings') render();
showToast('New version available.', 'Reload', () => worker.postMessage('SKIP_WAITING'));
};
if (reg.waiting && navigator.serviceWorker.controller) promptUpdate(reg.waiting);
reg.addEventListener('updatefound', () => {
const nw = reg.installing;
if (nw) nw.addEventListener('statechange', () => {
if (nw.state === 'installed' && navigator.serviceWorker.controller) promptUpdate(nw);
});
});
let refreshing = false;
navigator.serviceWorker.addEventListener('controllerchange', () => {
if (!refreshing) { refreshing = true; location.reload(); }
});
}).catch(() => {});
}
function init() {
document.getElementById('tabs').addEventListener('click', ev => {
const btn = ev.target.closest('[data-tab]');
if (btn) location.hash = '#' + btn.dataset.tab;
});
document.getElementById('view').addEventListener('click', ev => {
const el = ev.target.closest('[data-action]');
if (el && el.tagName !== 'SELECT' && el.tagName !== 'FORM') onAction(el.dataset.action, el);
});
document.getElementById('view').addEventListener('change', ev => {
const el = ev.target.closest('select[data-action="launch-tag"]');
if (el) updateLauncher({ tag: el.value });
});
document.getElementById('view').addEventListener('submit', ev => {
if (!ev.target.closest('form[data-action="submit-typing"]')) return;
ev.preventDefault();
if (!state.session || state.session.answered) return;
const inp = document.getElementById('typing-input'), val = inp ? inp.value : '';
const q = state.session.current, el = bySym.get(q.symbol), res = root.Quiz.checkTyped(q.type, el, val);
const note = q.type === 'symbol-mass' ? ` (exam ${el.atomicMass} · precise ${el.atomicMassPrecise})` : '';
registerAnswer(res.correct, { typed: val, headline: 'Answer: ' + res.canonical + note });
});
document.getElementById('sheet').addEventListener('click', ev => {
const el = ev.target.closest('[data-action]');
if (el) onAction(el.dataset.action, el);
});
document.addEventListener('keydown', ev => {
if (ev.key === 'Escape' && state.sheetSym) return closeSheet();
if (state.tab !== 'practice' || !state.session || state.session.done || state.sheetSym) return;
const tag = (ev.target && ev.target.tagName) || '';
if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
if (ev.key === 'Enter' && state.session.answered) { ev.preventDefault(); nextQuestion(); }
return;
}
const q = state.session.current;
if (!state.session.answered && q && q.kind === 'mcq' && /^[1-6]$/.test(ev.key)) {
const idx = Number(ev.key) - 1;
if (idx < q.options.length) {
ev.preventDefault();
registerAnswer(idx === q.correctIndex, { chosenIndex: idx, headline: 'Answer: ' + q.options[q.correctIndex] });
}
} else if (state.session.answered && ev.key === 'Enter') {
ev.preventDefault();
nextQuestion();
}
});
window.addEventListener('hashchange', route);
route();
registerSW();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
})(typeof window !== 'undefined' ? window : globalThis);
