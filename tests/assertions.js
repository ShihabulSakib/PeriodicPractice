/* Shared assertions for tests.html (browser) and tests/run-node.js (Node). Dev only. */
(function (root) {
  'use strict';

  // AGENT_PROMPT section 9: user values (must never change) and the 12 school values from the JSON
  const USER = { H: 1, C: 12, N: 14, O: 16, Na: 23, Mg: 24, Al: 27, P: 31, S: 32, Cl: 35.5, K: 39.1, Ca: 40, Cr: 52,
    Mn: 54.93, Fe: 55.85, Co: 59, Ni: 58.7, Cu: 63.5, Zn: 65.4, As: 74.9, Br: 80, Ag: 108, I: 127, Ba: 137,
    Au: 197, Hg: 200.5, Pb: 207 };
  const SCHOOL = { He: 4, Li: 7, Be: 9, B: 11, F: 19, Ne: 20, Si: 28, Ar: 40, Se: 79, Sn: 119, Pt: 195, U: 238 };

  function assert(cond, msg) { if (!cond) throw new Error(msg); }

  function runAll(E, OTHER, META, Quiz, Store) {
    const out = [];
    const t = (name, fn) => {
      try { fn(); out.push({ name, ok: true, detail: '' }); } catch (e) { out.push({ name, ok: false, detail: e.message }); }
    };
    const bySym = new Map(E.map(e => [e.symbol, e]));

    // ---- data ----
    t('59 essential elements with unique atomic numbers', () => {
      assert(E.length === 59, 'count ' + E.length);
      assert(new Set(E.map(e => e.atomicNumber)).size === 59, 'duplicate Z');
    });
    t('118 unique grid cells across ELEMENTS + OTHER_CELLS, none on the spacer row', () => {
      const cells = E.map(e => e.gridRow + ':' + e.gridCol).concat(OTHER.map(o => o[2] + ':' + o[3]));
      assert(cells.length === 118, 'cells ' + cells.length);
      assert(new Set(cells).size === 118, 'duplicate cells');
      assert(!cells.some(c => c.startsWith(META.spacerRow + ':')), 'cell on spacer row');
      assert(new Set(E.map(e => e.atomicNumber).concat(OTHER.map(o => o[0]))).size === 118, 'Z not 1..118');
    });
    t('27 user masses match AGENT_PROMPT section 9 exactly', () => {
      const users = E.filter(e => e.massSource === 'user');
      assert(users.length === 27, 'user count ' + users.length);
      for (const e of users) assert(USER[e.symbol] === e.atomicMass, `${e.symbol} ${e.atomicMass} != ${USER[e.symbol]}`);
    });
    t('12 school masses match hsc_physics_chemistry_constants.json', () => {
      const sch = E.filter(e => e.massSource === 'school');
      assert(sch.length === 12, 'school count ' + sch.length);
      for (const e of sch) assert(SCHOOL[e.symbol] === e.atomicMass, `${e.symbol} ${e.atomicMass} != ${SCHOOL[e.symbol]}`);
    });
    t('20 derived masses; TABLE_META counts agree', () => {
      const n = s => E.filter(e => e.massSource === s).length;
      assert(n('derived') === 20, 'derived ' + n('derived'));
      assert(META.userMassCount === 27 && META.schoolMassCount === 12 && META.derivedMassCount === 20, 'TABLE_META counts');
    });

    // ---- generators ----
    const truth = (type, el, cls) => ({
      'symbol-name': el.name, 'name-symbol': el.symbol, 'number-symbol': el.symbol, 'number-name': el.name,
      'symbol-number': String(el.atomicNumber), 'symbol-period': 'Period ' + el.period,
      'symbol-group': Quiz.groupLabel(el, cls), 'symbol-mass': String(el.atomicMass), 'mass-symbol': el.symbol,
      'cell-element': el.symbol, 'element-position': `Period ${el.period}, ${Quiz.groupLabel(el, cls)}`
    })[type];

    t('groupLabel: Cu, La, Th', () => {
      assert(Quiz.groupLabel(bySym.get('Cu'), false) === 'Group 11', 'Cu plain');
      assert(Quiz.groupLabel(bySym.get('Cu'), true) === 'Group 11 (IB)', 'Cu classical');
      assert(Quiz.groupLabel(bySym.get('La'), false) === Quiz.LAN, 'La');
      assert(Quiz.groupLabel(bySym.get('Th'), false) === Quiz.ACT, 'Th');
    });

    const smallDeck = E.filter(e => e.examTags.includes('coinage-metal'));
    for (const type of Quiz.TYPES) {
      for (const n of [4, 6]) {
        t(`${type}: 500 questions x ${n} options valid`, () => {
          const r = Quiz.rng(1000 + n);
          for (let i = 0; i < 500; i++) {
            const cls = i % 3 === 0;
            const deck = i % 10 === 9 ? smallDeck : E;
            const el = deck[Math.floor(r() * deck.length)];
            const q = Quiz.makeQuestion({ type, element: el, deck, settings: { optionCount: n, showClassical: cls }, rng: r });
            assert(q.options.length === n, `${el.symbol}: ${q.options.length} options`);
            assert(new Set(q.options).size === n, `${el.symbol}: duplicate options ${q.options}`);
            assert(q.correctIndex >= 0 && q.options[q.correctIndex] === truth(type, el, cls),
              `${el.symbol}: correct "${q.options[q.correctIndex]}" != "${truth(type, el, cls)}"`);
            assert(q.options.filter(o => o === truth(type, el, cls)).length === 1, `${el.symbol}: not exactly one correct`);
            if (type === 'symbol-mass') {
              q.options.forEach((o, j) => {
                if (j === q.correctIndex) return;
                const v = parseFloat(o);
                assert(Math.abs(v - el.atomicMass) >= Quiz.MASS_GAP - 1e-6 && Math.abs(v - el.atomicMassPrecise) >= Quiz.MASS_GAP - 1e-6,
                  `${el.symbol}: distractor ${o} too close to ${el.atomicMass}/${el.atomicMassPrecise}`);
              });
            }
            if (type === 'mass-symbol') {
              q.options.forEach((o, j) => {
                if (j !== q.correctIndex) assert(bySym.get(o).atomicMass !== el.atomicMass, `${el.symbol}: twin mass ${o}`);
              });
            }
          }
        });
      }
    }
    t('Cl never shows 35.45, Cu never 63.55, Zn never 65.38, Ar never 40 twin (Ca)', () => {
      const r = Quiz.rng(7);
      for (const [s, bad] of [['Cl', '35.45'], ['Cu', '63.55'], ['Zn', '65.38']]) {
        for (let i = 0; i < 200; i++) {
          const q = Quiz.makeQuestion({ type: 'symbol-mass', element: bySym.get(s), deck: E, settings: { optionCount: 6 }, rng: r });
          assert(!q.options.includes(bad), `${s} showed ${bad}`);
        }
      }
      for (let i = 0; i < 200; i++) {
        const q = Quiz.makeQuestion({ type: 'mass-symbol', element: bySym.get('Ar'), deck: E, settings: { optionCount: 6 }, rng: r });
        assert(!q.options.includes('Ca'), 'Ar question offered Ca');
      }
    });
    t('f-series group questions always offer both series; correct one marked', () => {
      const r = Quiz.rng(42);
      for (const s of ['La', 'Ac', 'Th', 'U']) {
        const el = bySym.get(s);
        for (const n of [4, 6]) {
          for (let i = 0; i < 100; i++) {
            const q = Quiz.makeQuestion({ type: 'symbol-group', element: el, deck: E, settings: { optionCount: n }, rng: r });
            assert(q.options.includes(Quiz.LAN) && q.options.includes(Quiz.ACT), `${s}: missing a series`);
            assert(q.options[q.correctIndex] === (s === 'La' ? Quiz.LAN : Quiz.ACT), `${s}: wrong series marked`);
          }
        }
      }
    });
    t('Position check: La/Ac/Th/U need the series; Cu needs 4 + 11', () => {
      assert(Quiz.checkPosition(bySym.get('La'), 6, 'lan').correct, 'La');
      assert(!Quiz.checkPosition(bySym.get('La'), 6, 3).correct, 'La group 3 accepted');
      assert(Quiz.checkPosition(bySym.get('U'), 7, 'act').correct, 'U');
      const r = Quiz.checkPosition(bySym.get('Cu'), 4, 12);
      assert(!r.correct && r.periodOk && !r.groupOk, 'Cu partial');
      assert(Quiz.makePosition({ element: bySym.get('Th') }).answerText === 'Period 7, Actinoid series', 'Th text');
    });

    // ---- typing ----
    t('Typing: names, alternates, symbols, numbers, masses', () => {
      const ok = (type, s, v) => Quiz.checkTyped(type, bySym.get(s), v).correct;
      assert(ok('symbol-name', 'S', 'sulphur') && ok('symbol-name', 'S', ' Sulfur '), 'sulphur');
      assert(ok('symbol-name', 'Al', 'Aluminum') && ok('symbol-name', 'Cs', 'cesium'), 'alt names');
      assert(ok('name-symbol', 'Cu', ' CU ') && !ok('name-symbol', 'Cu', 'copper'), 'symbol answers');
      assert(ok('symbol-number', 'Cu', '29') && !ok('symbol-number', 'Cu', '29.5'), 'numbers');
      assert(ok('symbol-mass', 'Cl', '35.5') && ok('symbol-mass', 'Cl', '35.45') && !ok('symbol-mass', 'Cl', '36'), 'Cl');
      assert(ok('symbol-mass', 'Zn', '65.4') && !ok('symbol-mass', 'Zn', '65'), 'Zn: user value wins');
      assert(ok('symbol-mass', 'Sn', '119') && ok('symbol-mass', 'Sn', '118.7'), 'Sn school');
      assert(ok('symbol-mass', 'Cu', '63,5') && !ok('symbol-mass', 'Cu', ''), 'comma / empty');
    });

    // ---- selection ----
    t('pickNext: 10-question sessions never repeat; no repeat within 5', () => {
      const r = Quiz.rng(99);
      for (let run = 0; run < 200; run++) {
        let recent = [], used = [];
        const seq = [];
        for (let i = 0; i < 10; i++) {
          const p = Quiz.pickNext({ deck: E, types: ['symbol-name'], stats: {}, recent, used, rng: r });
          seq.push(p.element.symbol);
          used = p.resetUsed ? [p.element.symbol] : used.concat(p.element.symbol);
          recent = recent.concat(p.element.symbol).slice(-5);
        }
        assert(new Set(seq).size === 10, 'repeat in ' + seq.join(','));
      }
      const small = E.slice(0, 7);
      let recent = [], used = [];
      const seq = [];
      for (let i = 0; i < 40; i++) {
        const p = Quiz.pickNext({ deck: small, types: ['symbol-name'], stats: {}, recent, used, rng: r });
        seq.push(p.element.symbol);
        used = p.resetUsed ? [p.element.symbol] : used.concat(p.element.symbol);
        recent = recent.concat(p.element.symbol).slice(-5);
      }
      for (let i = 0; i + 5 <= seq.length; i++) assert(new Set(seq.slice(i, i + 5)).size === 5, 'window repeat ' + seq.join(','));
    });
    t('pickNext favours box 1 over box 3', () => {
      const r = Quiz.rng(5);
      const deck = [bySym.get('H'), bySym.get('He')];
      const stats = { H: { seen: 3, correct: 3, boxes: { 'symbol-name': 3 } }, He: { seen: 1, correct: 0, boxes: { 'symbol-name': 1 } } };
      let he = 0;
      for (let i = 0; i < 2000; i++) if (Quiz.pickNext({ deck, types: ['symbol-name'], stats, rng: r }).element.symbol === 'He') he++;
      assert(he > 1350 && he < 1650, 'He picked ' + he + '/2000 (expected ~1500)');
    });

    // ---- storage ----
    if (Store) {
      t('Store: Leitner boxes, immutability, export/import round trip', () => {
        const d0 = Store.defaults();
        const d1 = Store.record(d0, 'Cu', 'symbol-name', true);
        const d2 = Store.record(d1, 'Cu', 'symbol-name', true);
        const d3 = Store.record(d2, 'Cu', 'symbol-name', true);
        assert(!d0.stats.Cu, 'mutated original');
        assert(d1.stats.Cu.boxes['symbol-name'] === 2 && d3.stats.Cu.boxes['symbol-name'] === 3, 'box up');
        const d4 = Store.record(d3, 'Cu', 'symbol-name', false);
        assert(d4.stats.Cu.boxes['symbol-name'] === 1 && d4.stats.Cu.seen === 4 && d4.stats.Cu.correct === 3, 'box reset');
        const back = Store.importText(Store.exportText(d4));
        assert(back.ok && JSON.stringify(back.data.stats) === JSON.stringify(d4.stats), 'round trip');
        assert(!Store.importText('nope').ok && !Store.importText('{"version":9,"stats":{}}').ok, 'bad import accepted');
        let h = d0;
        for (let i = 0; i < 15; i++) h = Store.pushHistory(h, { t: i, n: 1, correct: 1 });
        assert(h.history.length === 10 && h.history[0].t === 5, 'history cap');
      });
    }
    return out;
  }

  root.PTPTests = { runAll, USER, SCHOOL };
})(typeof window !== 'undefined' ? window : globalThis);
