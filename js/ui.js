(function (root) {
'use strict';
const esc = s => String(s == null ? '' : s)
.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const TAG_LABELS = {
'period-1-4': 'Periods 1–4', 'main-group': 'Main group', 'reactivity-series': 'Reactivity series',
'flame-test': 'Flame test', 'diagonal-relationship': 'Diagonal relationship',
'no-flame-color-group2': 'No flame colour (Gr 2)', pnictogen: 'Pnictogen', chalcogen: 'Chalcogen',
'3d-series': '3d series', 'non-transition-d-block': 'Non-transition d-block',
'aufbau-exception': 'Aufbau exception', 'hsc-toxic-heavy-metal': 'Toxic heavy metal',
'coinage-metal': 'Coinage metal', 'liquid-at-rt': 'Liquid at RT',
'inert-pair-effect': 'Inert pair effect', 'hsc-d-block-41-rule': 'HSC d-block (41 rule)'
};
const TOPIC_LABELS = [
['names', 'Symbol ↔ Name'], ['numbers', 'Number ↔ Symbol'],
['position', 'Position (P/G)'], ['mass', 'Atomic mass'], ['cell', 'Grid cell → Element']
];
const segBtn = (act, val, on, lbl, extra = '') =>
`<button type="button" data-action="${act}" data-val="${val}"${extra} aria-pressed="${on}">${lbl}</button>`;
const kv = (k, v, sub = '') => `<div class="kv"><div class="kv-k">${k}</div><div class="kv-v">${v}</div>${sub}</div>`;
function allTags() {
const s = new Set();
for (const e of root.ELEMENTS) for (const t of e.examTags) s.add(t);
return Array.from(s);
}
function tableScreen(settings) {
const show = settings.tableShow || 'symbols', zoom = settings.zoom === 2, tiles = [];
for (const el of root.ELEMENTS) {
const lbl = show === 'numbers' ? el.atomicNumber : show === 'masses' ? root.Quiz.fmtMass(el.atomicMass) : el.symbol;
tiles.push(`<button type="button" class="tile cat-${el.category}${show === 'masses' ? ' mass' : ''}" data-action="open-sheet" data-sym="${esc(el.symbol)}" aria-label="${esc(el.name)}, atomic number ${el.atomicNumber}" style="grid-row:${el.gridRow};grid-column:${el.gridCol}">${esc(lbl)}</button>`);
}
for (const [z, sym, r, c] of root.OTHER_CELLS) {
tiles.push(`<div class="tile dim" aria-hidden="true" style="grid-row:${r};grid-column:${c}">${esc(show === 'numbers' ? z : sym)}</div>`);
}
for (const p of root.TABLE_META.seriesPlaceholders) {
tiles.push(`<div class="tile series" aria-hidden="true" style="grid-row:${p.gridRow};grid-column:${p.gridCol}">${esc(p.label)}</div>`);
}
const cats = Object.entries(root.Quiz.CAT_LABEL).map(([k, v]) =>
`<div class="legend-item"><span class="swatch cat-${k}"></span><span>${esc(v)}</span></div>`).join('');
return `<div class="row"><div class="seg" role="group" aria-label="Tile display">
${[['symbols', 'Symbols'], ['numbers', 'Numbers'], ['masses', 'Masses']].map(([k, l]) => segBtn('table-show', k, show === k, l)).join('')}
</div><div style="display:flex;gap:6px"><button type="button" class="btn-icon" data-action="toggle-zoom" aria-pressed="${zoom}" aria-label="Toggle 2x zoom">${zoom ? '2×' : '1×'}</button><button type="button" class="btn-icon" data-action="toggle-legend" aria-pressed="${!!settings.legend}">Legend</button></div></div><div class="pt-scroll"><div class="pt${zoom ? ' zoom2' : ''}" role="grid" aria-label="Periodic table of 59 essential elements">${tiles.join('')}</div></div>
${settings.legend ? `<div class="card legend">${cats}</div>` : ''}
<div class="muted" style="text-align:center">Tap any bright tile (59 essential elements) for full HSC exam details.</div>`;
}
function detailSheet(el, settings) {
const Q = root.Quiz, grp = Q.isF(el) ? Q.seriesOf(el) : `${el.iupacGroup} / ${el.classicalGroup}`;
const blk = settings.hscBlocks ? el.hscBlock : el.block;
const blkNote = el.block !== el.hscBlock
? (settings.hscBlocks ? `${el.hscBlock}-block (HSC 41-d; IUPAC: ${el.block})` : `${el.block}-block (IUPAC; HSC: ${el.hscBlock})`)
: `${blk}-block`;
const unv = el.massSource === 'derived';
const marker = unv ? ` <abbr class="unverified" title="Derived value — verify against NCTB table">unverified †</abbr>`
: (el.massSource === 'school' ? ` <small class="muted">(HSC school ref.)</small>` : '');
const approx = el.massIsApprox ? `<div class="muted">* Longest-lived isotope</div>` : '';
const md = settings.massDisplay || 'both';
const examKv = kv('Exam atomic mass', esc(Q.fmtMass(el.atomicMass)) + marker, approx);
const precKv = kv('Precise (IUPAC)', esc(Q.fmtMass(el.atomicMassPrecise)) + (unv ? ' <span class="unverified" title="Verify against NCTB table">†</span>' : ''));
const alts = el.alternateNames && el.alternateNames.length ? `<div class="muted">Also: ${esc(el.alternateNames.join(', '))}</div>` : '';
const tags = el.examTags.map(t => `<span class="tag-chip">${esc(TAG_LABELS[t] || t)}</span>`).join('');
return `<div class="sheet-head"><div style="display:flex;align-items:center;gap:12px"><div class="sheet-badge cat-${el.category}"><small>${el.atomicNumber}</small><span>${esc(el.symbol)}</span></div><div><div id="sheet-title" style="font-size:19px;font-weight:800">${esc(el.name)}</div><div class="muted">${esc(Q.CAT_LABEL[el.category] || el.category)}</div>${alts}</div></div><button type="button" class="btn-secondary" data-action="close-sheet" aria-label="Close detail sheet">Close</button></div><div class="kv-grid">
${kv('Atomic Number (Z)', el.atomicNumber)}${kv('Period', el.period)}${kv('Group (IUPAC / Classic)', esc(grp))}${kv('Block', esc(blkNote))}
${md === 'exam' ? examKv : md === 'precise' ? precKv : examKv + precKv}
</div><div><div class="kv-k" style="margin-bottom:4px">Exam tags</div><div>${tags || '<span class="muted">None</span>'}</div></div>
${unv ? `<div class="muted" style="margin-top:8px">† Unverified derived mass — double-check with your NCTB textbook table.</div>` : ''}`;
}
function launcherScreen(settings, stats) {
const L = settings.launcher;
const spec = L.deck === 'weak' ? { filter: 'weak' } : L.deck === 'tag' ? { filter: 'tag', tag: L.tag } : { filter: 'all' };
const deck = root.Quiz.buildDeck(spec, stats);
const canStart = deck.length > 0 && (L.mode === 'position' || (L.topics && L.topics.length > 0));
return `<div class="card"><div class="field-label">1. Mode</div><div class="seg full3">
${[['mcq', 'MCQ (' + settings.optionCount + ')'], ['position', 'Position'], ['typing', 'Typing']].map(([m, l]) => segBtn('launch-mode', m, L.mode === m, esc(l))).join('')}
</div></div>
${L.mode !== 'position' ? `<div class="card"><div class="field-label">2. Question topics</div><div class="chips">
${TOPIC_LABELS.filter(([k]) => L.mode !== 'typing' || (k !== 'position' && k !== 'cell')).map(([k, l]) =>
`<button type="button" class="chip" data-action="launch-topic" data-val="${k}" aria-pressed="${L.topics.includes(k)}">${esc(l)}</button>`).join('')}
</div></div>` : ''}
<div class="card"><div class="field-label">3. Deck filter (${deck.length} elements)</div><div class="seg full3" style="margin-bottom:${L.deck === 'tag' ? '8px' : '0'}">
${[['all', 'All 59'], ['weak', 'Weak (Box 1)'], ['tag', 'By Tag']].map(([k, l]) => segBtn('launch-deck', k, L.deck === k, l)).join('')}
</div>
${L.deck === 'tag' ? `<select class="select" data-action="launch-tag" aria-label="Choose exam tag">
${allTags().map(t => `<option value="${esc(t)}"${t === L.tag ? ' selected' : ''}>${esc(TAG_LABELS[t] || t)}</option>`).join('')}
</select>` : ''}
${deck.length === 0 ? `<div class="muted" style="color:var(--bad-fg);margin-top:6px">No elements match this filter yet — practice All 59 first.</div>` : ''}
</div><div class="card"><div class="field-label">4. Session length</div><div class="seg full4">
${[[10, '10'], [20, '20'], [40, '40'], [0, 'Endless']].map(([n, l]) => segBtn('launch-len', n, Number(L.length) === n, l)).join('')}
</div></div><div class="thumb-zone"><button type="button" class="btn-primary" data-action="start-session"${canStart ? '' : ' disabled'}>Start Practice (${deck.length} elements)</button></div>`;
}
function miniGrid(target) {
const cells = [];
for (const e of root.ELEMENTS) cells.push([e.gridRow, e.gridCol, true]);
for (const [, , r, c] of root.OTHER_CELLS) cells.push([r, c, false]);
for (const p of root.TABLE_META.seriesPlaceholders) cells.push([p.gridRow, p.gridCol, false]);
return `<div class="mini-pt" aria-label="Highlighted cell at row ${target.row}, column ${target.col}">` +
cells.map(([r, c, isE]) => `<div class="mini-cell${isE ? ' ess' : ''}${r === target.row && c === target.col ? ' target' : ''}" style="grid-row:${r};grid-column:${c}"></div>`).join('') + `</div>`;
}
function quizScreen(session, settings) {
const q = session.current, ans = session.answered;
const total = session.length || '∞', idx = session.index + 1;
const pct = session.length ? Math.min(100, Math.round((session.index / session.length) * 100)) : 50;
const body = q.promptExtra.cell ? miniGrid(q.promptExtra.cell)
: `<div class="prompt-big">${esc(q.prompt)}</div>${q.promptExtra.sub ? `<div class="prompt-sub">${esc(q.promptExtra.sub)}</div>` : ''}`;
let controls = '';
if (q.kind === 'mcq') {
controls = `<div class="opts">` + q.options.map((opt, i) => {
const cls = 'opt' + (ans ? (i === q.correctIndex ? ' correct' : i === ans.chosenIndex ? ' wrong' : '') : '');
return `<button type="button" class="${cls}" data-action="answer-mcq" data-idx="${i}"${ans ? ' disabled' : ''}>${esc(opt)}</button>`;
}).join('') + `</div>`;
} else if (q.kind === 'position') {
const selP = session.posPeriod, selG = session.posGroup;
const pCls = p => 'pos-btn' + (ans ? (p === q.answer.period ? ' correct' : p === selP ? ' wrong' : '') : '');
const gCls = g => 'pos-btn' + (ans ? (g === q.answer.group ? ' correct' : g === selG ? ' wrong' : '') : '');
const pBtns = [1, 2, 3, 4, 5, 6, 7].map(p => `<button type="button" class="${pCls(p)}" data-action="pos-period" data-val="${p}" aria-pressed="${selP === p}"${ans ? ' disabled' : ''}>P${p}</button>`).join('');
const gBtns = [];
for (let g = 1; g <= 18; g++) {
const sub = settings.showClassical ? `<div style="font-size:9px">${root.Quiz.CLASSICAL[g]}</div>` : '';
gBtns.push(`<button type="button" class="${gCls(g)}" data-action="pos-group" data-val="${g}" aria-pressed="${selG === g}"${ans ? ' disabled' : ''}>${g}${sub}</button>`);
}
const sBtns = [['lan', root.Quiz.LAN], ['act', root.Quiz.ACT]].map(([k, l]) =>
`<button type="button" class="${gCls(k)}" data-action="pos-group" data-val="${k}" aria-pressed="${selG === k}"${ans ? ' disabled' : ''}>${esc(l)}</button>`).join('');
controls = `<div class="card" style="padding:8px"><div class="field-label">Period (1–7)</div><div class="pos-periods">${pBtns}</div><div class="field-label" style="margin-top:8px">Group (1–18 or f-series)</div><div class="pos-groups">${gBtns.join('')}</div><div class="pos-series">${sBtns}</div></div>`;
} else {
controls = `<form data-action="submit-typing" style="display:flex;gap:8px"><input id="typing-input" class="type-input" type="text" inputmode="${esc(q.promptExtra.inputmode || 'text')}"
autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Your answer…" value="${esc(ans ? ans.typed : '')}" ${ans ? 'disabled' : ''}>
${ans ? '' : `<button type="submit" class="btn-primary" style="width:auto;min-width:96px">Check</button>`}
</form>`;
}
const fb = ans ? `<div class="feedback ${ans.correct ? 'ok' : 'bad'}" role="status" aria-live="polite"><div class="feedback-title">${ans.correct ? '✓ Correct!' : '✗ Not quite — ' + esc(ans.headline)}</div><div>${esc(q.explain)}</div></div><button type="button" class="btn-primary" data-action="next-question">Next →</button>` : '';
return `<div class="quiz-wrap"><div class="quiz-head"><span>Q ${idx} / ${total}</span><span>Streak: ${session.streak} · Score: ${session.correct}/${session.answeredCount}</span><button type="button" class="btn-icon" data-action="quit-session">End</button></div><div class="progress-bar" aria-hidden="true"><div class="progress-fill" style="width:${pct}%"></div></div><div class="prompt-card"><div class="prompt-ask">${esc(q.promptExtra.ask)}</div>${body}</div><div class="thumb-zone">${controls}${fb}</div></div>`;
}
function summaryScreen(session) {
const pct = session.answeredCount ? Math.round((session.correct / session.answeredCount) * 100) : 0;
const missed = Array.from(new Set(session.missed));
return `<div class="card" style="text-align:center"><div class="kv-k">Session Complete</div><div style="font-size:36px;font-weight:800;margin:6px 0">${session.correct} / ${session.answeredCount} (${pct}%)</div><div class="muted">Best streak this session: ${session.bestStreak}</div></div>
${missed.length ? `<div class="card"><div class="field-label">Missed elements (${missed.length})</div><div class="chips">${missed.map(s => `<button type="button" class="chip" data-action="open-sheet" data-sym="${esc(s)}">${esc(s)}</button>`).join('')}</div></div>` : ''}
<div class="thumb-zone">
${missed.length ? `<button type="button" class="btn-primary" data-action="drill-missed">Drill Missed (${missed.length})</button>` : ''}
<button type="button" class="btn-primary" data-action="restart-session">Practice Again</button><button type="button" class="btn-secondary" data-action="back-launcher">Change Setup</button></div>`;
}
function reviewScreen(data) {
const stats = data.stats || {};
let totalSeen = 0, totalCorrect = 0;
for (const s of Object.values(stats)) { totalSeen += s.seen; totalCorrect += s.correct; }
const acc = totalSeen ? Math.round((totalCorrect / totalSeen) * 100) + '%' : '—';
const weak = root.Quiz.weakList(stats, 12);
const rows = root.ELEMENTS.map(el => {
const s = stats[el.symbol] || { seen: 0, correct: 0, boxes: {} };
const p = s.seen ? Math.round((s.correct / s.seen) * 100) + '%' : '—';
return `<tr data-action="open-sheet" data-sym="${esc(el.symbol)}"><td><strong>${esc(el.symbol)}</strong><span class="muted">${esc(el.name)}</span></td><td>${el.atomicNumber}</td><td>${s.seen ? `${s.correct}/${s.seen} (${p})` : '—'}</td><td><span class="box-pill">${s.seen ? 'Box ' + root.Quiz.minBox(s) : 'Unseen'}</span></td></tr>`;
}).join('');
const hist = (data.history || []).slice().reverse().map(h => {
const d = new Date(h.t).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
return `<tr><td>${esc(d)}</td><td>${esc(h.mode.toUpperCase())}</td><td>${h.correct}/${h.n} (${h.n ? Math.round((h.correct / h.n) * 100) : 0}%)</td></tr>`;
}).join('');
return `<div class="card stat-grid"><div><div class="stat-num">${acc}</div><div class="stat-lbl">Accuracy</div></div><div><div class="stat-num">${totalSeen}</div><div class="stat-lbl">Answered</div></div><div><div class="stat-num">${data.bestStreak || 0}</div><div class="stat-lbl">Best Streak</div></div></div><div class="card"><div class="row" style="margin-bottom:8px"><div class="field-label" style="margin:0">Weak elements (Leitner Box 1)</div><button type="button" class="btn-secondary" data-action="drill-weak"${weak.length ? '' : ' disabled'}>Drill weak ones (${weak.length})</button></div>
${weak.length ? `<div class="chips">${weak.map(w => `<button type="button" class="chip" data-action="open-sheet" data-sym="${esc(w.el.symbol)}">${esc(w.el.symbol)} · ${Math.round(w.acc * 100)}%</button>`).join('')}</div>` : `<div class="muted">No weak elements yet. Wrong answers move an element to Box 1.</div>`}
</div><div class="card"><div class="field-label">Recent sessions (last 10)</div>${hist ? `<table class="data-table"><thead><tr><th>Date</th><th>Mode</th><th>Score</th></tr></thead><tbody>${hist}</tbody></table>` : `<div class="muted">No completed sessions yet.</div>`}</div><div class="card"><div class="field-label">All 59 essential elements (tap row for details)</div><table class="data-table"><thead><tr><th>Element</th><th>Z</th><th>Accuracy</th><th>Leitner</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
function settingsScreen(data, swUpdateAvailable) {
const s = data.settings;
const row = (title, sub, ctrl) => `<div class="setting-row"><div><div class="setting-title">${title}</div><div class="setting-sub">${sub}</div></div><div class="seg">${ctrl}</div></div>`;
const boolRow = (title, sub, key) => row(title, sub, segBtn('set-bool', 'true', !!s[key], 'ON', ` data-key="${key}"`) + segBtn('set-bool', 'false', !s[key], 'OFF', ` data-key="${key}"`));
return `<div class="card">
${row('Options per MCQ question', '4 (2×2 grid) or 6 (2×3 grid)', [4, 6].map(n => segBtn('set-opt', n, Number(s.optionCount) === n, n, ' data-key="optionCount"')).join(''))}
${boolRow('HSC block rules (41 d / 27 f)', 'ON: La, Ac, Th count as d-block; OFF: modern IUPAC', 'hscBlocks')}
${boolRow('Show classical groups (IA, IIB…)', 'Shown in brackets next to IUPAC 1–18', 'showClassical')}
${row('Detail sheet atomic mass', 'Quiz always grades on exam mass', [['exam', 'Exam'], ['precise', 'Precise'], ['both', 'Both']].map(([k, l]) => segBtn('set-str', k, s.massDisplay === k, l, ' data-key="massDisplay"')).join(''))}
${boolRow('Auto-advance after answer', 'Moves to next question after 1.2 s', 'autoAdvance')}
${boolRow('Haptics on wrong answer', 'Short 30 ms vibration on supported phones', 'haptics')}
${row('Theme', 'System default or manual override', [['auto', 'Auto'], ['light', 'Light'], ['dark', 'Dark']].map(([k, l]) => segBtn('set-str', k, s.theme === k, l, ' data-key="theme"')).join(''))}
</div><div class="card"><div class="field-label">Backup & Reset (JSON copy / paste)</div><textarea id="export-box" class="textarea" aria-label="Progress JSON">${esc(root.Store.exportText(data))}</textarea><div class="row" style="margin-top:8px"><button type="button" class="btn-secondary" data-action="copy-export">Copy JSON</button><button type="button" class="btn-secondary" data-action="import-json">Import from box</button><button type="button" class="btn-danger" data-action="reset-progress">Reset Progress</button></div></div><div class="card"><div class="row"><div><div class="setting-title">Periodic Table Practice · v1.0.0</div><div class="setting-sub">59 essential elements (27 user, 12 HSC school, 20 derived)</div></div>
${swUpdateAvailable ? `<button type="button" class="btn-secondary" data-action="sw-reload">Update available → Reload</button>` : ''}
</div></div>`;
}
root.UI = { esc, TAG_LABELS, tableScreen, detailSheet, launcherScreen, quizScreen, summaryScreen, reviewScreen, settingsScreen };
})(typeof window !== 'undefined' ? window : globalThis);
