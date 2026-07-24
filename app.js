/* Your Life in Weeks — vanilla port of the DC prototype.
   No dependencies, no runtime fetch. Everything stays on-device. */
(() => {
  'use strict';

  // --- Static snapshot: "Time spent with others, by age" (All people), Our World in Data.
  //     Source: https://ourworldindata.org/grapher/time-spent-alone-by-age-and-gender.csv
  //     U.S. American Time Use Survey. Hours per day, ages 15–80.
  const TIMEUSE = {
    ages: [15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80],
    series: {
      family:    [4.29,4.09,3.7,3.75,3.02,2.94,2.56,2.23,2.05,1.79,1.56,1.44,1.37,1.21,1.31,1.06,1.13,0.98,1,1.07,0.9,1,0.92,0.91,0.9,0.8,0.89,0.79,0.87,0.84,0.89,0.9,0.89,0.93,0.9,1.04,1.01,1.05,0.93,0.96,1.01,1.09,0.95,1.11,1.04,1.05,0.99,0.98,1.05,0.97,1.08,1.12,0.92,0.9,0.96,0.9,0.92,0.92,0.85,0.9,0.86,0.79,1.04,0.96,0.79,0.96],
      friends:   [1.54,1.43,1.79,1.95,1.8,1.76,1.83,1.43,1.5,1.43,1.08,1.16,1.09,0.92,0.89,0.76,0.79,0.72,0.74,0.58,0.59,0.59,0.63,0.59,0.51,0.5,0.52,0.58,0.59,0.55,0.53,0.54,0.55,0.47,0.56,0.41,0.54,0.47,0.46,0.51,0.5,0.61,0.46,0.54,0.43,0.53,0.47,0.45,0.5,0.5,0.51,0.55,0.55,0.6,0.57,0.63,0.59,0.58,0.49,0.52,0.56,0.54,0.46,0.58,0.63,0.53],
      coworkers: [0.16,0.44,0.76,1.31,2.08,2.27,2.48,2.68,3.11,3.26,3.07,3.19,3.25,3.19,3.06,3.29,2.9,3.1,2.79,2.9,2.95,2.76,2.89,2.97,2.72,2.88,2.79,2.96,2.61,2.7,2.89,2.55,2.68,2.71,2.93,2.52,2.72,2.78,2.63,2.8,2.43,2.43,2.5,2.21,2.17,2.04,2.04,1.46,1.39,1.33,0.99,0.81,0.64,0.64,0.43,0.44,0.32,0.3,0.31,0.25,0.27,0.26,0.16,0.06,0.09,0.1],
      partner:   [0,0,0.02,0.09,0.31,0.38,0.83,0.83,1.36,1.67,1.91,2.31,2.57,2.79,2.87,2.99,3.38,3.25,3.4,3.36,3.45,3.23,3.39,3.33,3.58,3.29,3.24,3.18,3.18,3.26,3.06,3.2,3,3.25,3.11,2.9,3.1,3.17,3.08,2.98,3.11,3.33,3.07,3.06,3.36,3.33,3.52,3.69,3.58,3.75,3.94,4.18,4.32,4.22,4.5,4.2,4.42,4.31,4.35,4.29,4.25,4.54,4.46,4.34,4.17,3.84],
      children:  [0.34,0.41,0.42,0.46,0.44,0.72,0.97,1.02,1.37,1.46,1.71,1.8,2.29,2.77,2.95,3.11,3.49,3.62,4.16,4.12,4.2,4.1,4.09,4.17,4.3,3.9,3.99,3.66,3.61,3.54,3.41,3.07,2.82,2.57,2.3,2.24,2.07,1.73,1.73,1.48,1.43,1.29,1.25,1.08,1.13,1.04,1.1,1.01,0.94,0.91,0.92,0.96,0.94,0.86,1.03,0.87,0.94,0.74,0.88,0.8,0.83,0.72,0.8,0.69,0.62,0.69],
      alone:     [3.68,3.91,4.1,4.54,5.09,5.14,4.98,5.34,4.93,4.82,5.17,5.13,4.8,4.83,4.83,4.72,4.78,4.79,4.57,4.74,4.72,4.95,4.84,4.83,5.01,5.17,5.27,5.32,5.62,5.62,5.47,5.89,5.98,5.85,6.03,6.56,6.33,6.53,6.58,6.52,6.75,6.67,6.93,7.03,7.12,7.2,7.01,7.35,7.48,7.56,7.64,7.39,7.43,7.59,7.54,7.7,7.68,7.98,7.89,7.8,7.79,7.64,7.72,7.83,8.04,7.98]
    }
  };

  const COLORS = { family: '#93B79B', friends: '#7FA3C9', partner: '#B393C9', children: '#C98F93', coworkers: '#8A867F', alone: '#EDEAE4' };
  const LABELS = { family: 'Family', friends: 'Friends', partner: 'Partner', children: 'Children', coworkers: 'Coworkers', alone: 'Alone' };
  const SERIES_ORDER = ['family', 'friends', 'partner', 'children', 'coworkers', 'alone'];

  const DAY_MS = 864e5;
  const $ = (id) => document.getElementById(id);
  const fmt = (n) => n.toLocaleString('en-US');
  const prefersReduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- State ------------------------------------------------------------
  const state = {
    birthVal: '',
    submitted: false,
    lived: 0,
    age: 0,
    sex: '',          // '', 'm', 'f'
    name: '',
    // Series key -> true when hidden. Alone, Partner, and Friends start on —
    // the three the insight copy speaks to; the rest are a tap away.
    hidden: { family: true, children: true, coworkers: true },
  };

  const lifespanExact = () => state.sex === 'm' ? 81.1 : state.sex === 'f' ? 85.1 : 83.1;
  const lifespan = () => Math.round(lifespanExact());
  const totalWeeks = () => lifespan() * 52;

  // Grid / chart runtime handles
  let grid = null, gridRaf = 0, pulseRaf = 0, pulseVisible = true, vio = null;
  let chart = null, scrub = null, dragging = false, cardUrl = null;

  // --- Elements ---------------------------------------------------------
  const el = {
    form: $('birth-form'), dob: $('dob'), err: $('err'), smsMsg: $('sms-msg'),
    basisSeg: $('basis-seg'), basisToggle: $('basis-toggle'), editDob: $('edit-dob'),
    heroSub: $('hero-sub'), results: $('results'),
    gridWrap: $('grid-wrap'), gridCanvas: $('grid'),
    capMain: $('cap-main'), smallPrintText: $('small-print-text'),
    legend: $('legend'), chartCanvas: $('chart'), readout: $('readout'), insight: $('insight'),
    actPrompt: $('act-prompt'), name: $('name'), sms: $('sms'), weekNext: $('week-next'),
    share: $('share'), shareMsg: $('share-msg'),
  };

  // --- ?age= arrival (never touches the date field: the recipient confirms
  //     their own date; the sharer's age only personalizes the invitation) --
  (() => {
    const a = parseInt(new URLSearchParams(location.search).get('age'), 10);
    if (a > 0 && a < 100) {
      el.heroSub.textContent = `Your friend has lived about ${fmt(Math.round(a * 365.25 / 7))} weeks. See yours.`;
    }
  })();
  el.dob.max = new Date().toISOString().slice(0, 10);
  el.dob.min = new Date(Date.now() - 100 * 365.25 * DAY_MS).toISOString().slice(0, 10);

  // --- Scroll reveal ----------------------------------------------------
  let revealIO = null;
  function revealInit() {
    // Sections are visible by default. The hidden pre-reveal state is applied
    // here, in the same tick as observing, so any failure on this path leaves
    // the arc readable instead of blank.
    if (prefersReduced() || typeof IntersectionObserver !== 'function') return;
    setTimeout(() => {
      revealIO = revealIO || new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            e.target.classList.remove('pre-reveal');
            revealIO.unobserve(e.target);
          }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll('[data-reveal]:not([data-rv])').forEach((node) => {
        node.dataset.rv = '1';
        node.classList.add('pre-reveal');
        revealIO.observe(node);
      });
      // An instant jump (scrollbar drag, End key) can move a section from
      // below the viewport to above it between frames — the observer never
      // fires and the section would stay hidden. Catch anything scrolled past.
      if (revealIO.catchUp) return;
      revealIO.catchUp = true;
      window.addEventListener('scroll', () => {
        document.querySelectorAll('[data-reveal].pre-reveal').forEach((node) => {
          if (node.getBoundingClientRect().bottom < 0) {
            node.classList.add('in');
            node.classList.remove('pre-reveal');
            revealIO.unobserve(node);
          }
        });
      }, { passive: true });
    }, 60);
  }

  // --- Canvas helpers ---------------------------------------------------
  function setupCanvas(c, w, h) {
    const dpr = window.devicePixelRatio || 1;
    c.style.width = w + 'px';
    c.style.height = h + 'px';
    c.width = Math.round(w * dpr);
    c.height = Math.round(h * dpr);
    const ctx = c.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }
  function drawDot(ctx, x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- Section 2: the calendar -----------------------------------------
  function drawGrid(n) {
    const g = grid, ctx = g.ctx;
    ctx.clearRect(0, 0, g.w, g.h);
    const r = g.cell * 0.32;
    for (let i = 0; i < g.rows * 52; i++) {
      if (i === g.current) continue;
      const x = (i % 52) * g.cell + g.cell / 2;
      const y = Math.floor(i / 52) * g.cell + g.cell / 2;
      drawDot(ctx, x, y, r, i < n ? 'rgba(237,234,228,.92)' : 'rgba(237,234,228,.13)');
    }
  }
  function startGrid(animate) {
    const c = el.gridCanvas;
    if (!c || !c.parentElement) return;
    cancelAnimationFrame(gridRaf);
    cancelAnimationFrame(pulseRaf);
    const w = c.parentElement.clientWidth, rows = lifespan();
    const cell = w / 52, h = cell * rows;
    const ctx = setupCanvas(c, w, h);
    const total = totalWeeks();
    const capped = Math.min(state.lived, total);
    // Past expectancy the ember moves to the last cell — the current week is
    // always still burning, never "complete".
    const current = capped < total ? capped : total - 1;
    grid = { ctx, cell, rows, w, h, current, capped };

    const dur = (animate && !prefersReduced()) ? 1500 : 0;
    const t0 = performance.now();
    const step = (t) => {
      const p = dur ? Math.min(1, (t - t0) / dur) : 1;
      drawGrid(Math.floor(p * capped));
      if (p < 1) gridRaf = requestAnimationFrame(step);
      else { startPulse(); if (dur) nudgeCaption(); }
    };
    gridRaf = requestAnimationFrame(step);

    if (vio) vio.disconnect();
    pulseVisible = true;
    vio = new IntersectionObserver((es) => { pulseVisible = es[0].isIntersecting; });
    vio.observe(c);
  }
  function startPulse() {
    const g = grid;
    if (!g || g.current < 0) return;
    const cx = (g.current % 52) * g.cell + g.cell / 2;
    const cy = Math.floor(g.current / 52) * g.cell + g.cell / 2;
    const rMax = g.cell * 0.46;
    const loop = (t) => {
      pulseRaf = requestAnimationFrame(loop);
      if (!pulseVisible) return;
      const s = 0.62 + 0.38 * (0.5 + 0.5 * Math.sin(t / 480));
      g.ctx.clearRect(cx - rMax - 1, cy - rMax - 1, rMax * 2 + 2, rMax * 2 + 2);
      g.ctx.save();
      g.ctx.shadowColor = 'rgba(217,134,59,.8)';
      g.ctx.shadowBlur = 6 * s;
      drawDot(g.ctx, cx, cy, rMax * s, '#D9863B');
      g.ctx.restore();
    };
    pulseRaf = requestAnimationFrame(loop);
  }
  // After the first fill, if the caption's numbers ended up below the fold
  // and the user hasn't scrolled on their own, ease them into view.
  function nudgeCaption() {
    if (state.autoScrollTop == null) return;
    const undisturbed = Math.abs(window.scrollY - state.autoScrollTop) < 4;
    state.autoScrollTop = null;
    if (!undisturbed) return;
    const r = el.capMain.getBoundingClientRect();
    const overflow = r.bottom + 16 - window.innerHeight;
    if (overflow > 0) window.scrollBy({ top: overflow, behavior: 'smooth' });
  }

  // --- Section 3: the chart --------------------------------------------
  function startChart() {
    const c = el.chartCanvas;
    if (!c || !c.parentElement) return;
    const w = c.parentElement.clientWidth;
    const h = Math.min(360, Math.max(260, w * 0.62));
    chart = { ctx: setupCanvas(c, w, h), w, h, m: { l: 30, r: 14, t: 30, b: 26 } };
    if (scrub == null) scrub = Math.min(80, Math.max(15, state.age));
    drawChart();

    if (!c.dataset.wired) {
      c.dataset.wired = '1';
      const move = (e) => {
        const rect = c.getBoundingClientRect();
        const { m, w } = chart;
        const t = (e.clientX - rect.left - m.l) / (w - m.l - m.r);
        const age = Math.round(Math.min(80, Math.max(15, 15 + t * 65)));
        if (age !== scrub) { scrub = age; drawChart(); }
      };
      c.addEventListener('pointerdown', (e) => { c.setPointerCapture(e.pointerId); dragging = true; move(e); });
      c.addEventListener('pointermove', (e) => { if (dragging) move(e); });
      c.addEventListener('pointerup', () => { dragging = false; });
      c.addEventListener('pointercancel', () => { dragging = false; });
      c.addEventListener('keydown', (e) => {
        const step = { ArrowLeft: -1, ArrowRight: 1, ArrowDown: -1, ArrowUp: 1, PageDown: -5, PageUp: 5 }[e.key];
        const next = step != null ? Math.min(80, Math.max(15, scrub + step))
          : e.key === 'Home' ? 15 : e.key === 'End' ? 80 : null;
        if (next == null) return;
        e.preventDefault();
        if (next !== scrub) { scrub = next; drawChart(); }
      });
    }
  }
  function drawChart() {
    if (!chart) return;
    const { ctx, w, h, m } = chart, D = TIMEUSE;
    const X = (age) => m.l + (age - 15) / 65 * (w - m.l - m.r);
    const yMax = 9;
    const Y = (v) => h - m.b - v / yMax * (h - m.t - m.b);
    ctx.clearRect(0, 0, w, h);
    ctx.font = '12px Helvetica, Arial, sans-serif';
    ctx.fillStyle = 'rgba(237,234,228,.55)';
    ctx.strokeStyle = 'rgba(237,234,228,.09)';
    ctx.lineWidth = 1;
    for (let v = 0; v <= 8; v += 2) {
      const y = Y(v);
      ctx.beginPath(); ctx.moveTo(m.l, y); ctx.lineTo(w - m.r, y); ctx.stroke();
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillText(v + 'h', m.l - 7, y);
    }
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    for (let a = 20; a <= 80; a += 20) ctx.fillText(String(a), X(a), h - m.b + 8);

    ctx.lineWidth = 1.6; ctx.lineJoin = 'round';
    for (const k of SERIES_ORDER) {
      if (state.hidden[k]) continue;
      ctx.strokeStyle = COLORS[k];
      ctx.globalAlpha = k === 'alone' ? 0.95 : 0.85;
      ctx.beginPath();
      D.ages.forEach((a, i) => {
        const x = X(a), y = Y(D.series[k][i]);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      });
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Scrub line. "YOU ARE HERE" only when the line sits at the user's real
    // age — a scrubbed line is labeled by the age it shows, and the user's
    // own position keeps a tick on the axis so "you" never disappears.
    // Past 80 the survey has no data, so "you" pins to the edge and the
    // label says so instead of quietly dropping the user off the chart.
    const age = scrub, xi = X(age), idx = Math.min(65, Math.max(0, age - 15));
    const youAge = Math.min(state.age, 80);
    const isYou = state.submitted && state.age <= 80 && age === state.age;
    const atDataEdge = state.submitted && state.age > 80 && age === 80;
    if (state.submitted && !isYou && !atDataEdge && state.age >= 15) {
      ctx.fillStyle = 'rgba(217,134,59,.6)';
      ctx.beginPath(); ctx.arc(X(youAge), h - m.b, 3, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = '#D9863B'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(xi, m.t - 6); ctx.lineTo(xi, h - m.b); ctx.stroke();
    ctx.fillStyle = '#D9863B';
    ctx.beginPath(); ctx.arc(xi, m.t - 6, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.font = '600 11px Helvetica, Arial, sans-serif'; ctx.textBaseline = 'alphabetic';
    const lbl = isYou ? 'YOU ARE HERE · ' + age
      : atDataEdge ? 'YOUR DATA ENDS HERE · 80+'
      : 'AGE ' + age;
    const onRight = xi < w / 2;
    ctx.textAlign = onRight ? 'left' : 'right';
    ctx.fillText(lbl, xi + (onRight ? 8 : -8), m.t - 3);

    // Per-age values live in the DOM readout below the canvas (not a canvas
    // tooltip): nothing occludes the lines, and the values are selectable,
    // keyboard-reachable text.
    // Stable legend order (not sorted by value) so a tracked series never
    // hops position while scrubbing.
    const rows = SERIES_ORDER
      .filter((k) => !state.hidden[k])
      .map((k) => ({ k, v: D.series[k][idx] }));
    renderReadout(age, rows);
  }
  function renderReadout(age, rows) {
    const frag = document.createDocumentFragment();
    const ageEl = document.createElement('span');
    ageEl.className = 'age';
    ageEl.textContent = 'Age ' + age;
    frag.appendChild(ageEl);
    for (const r of rows) {
      const item = document.createElement('span');
      item.className = 'ro';
      const dot = document.createElement('span');
      dot.className = 'dot';
      dot.style.background = COLORS[r.k];
      const val = document.createElement('b');
      val.textContent = r.v.toFixed(1) + 'h';
      item.appendChild(dot);
      item.appendChild(document.createTextNode(LABELS[r.k] + ' '));
      item.appendChild(val);
      frag.appendChild(item);
    }
    if (!rows.length) frag.appendChild(document.createTextNode('All lines are hidden. Tap a name above to bring one back.'));
    el.readout.replaceChildren(frag);
    el.chartCanvas.setAttribute('aria-valuenow', String(age));
    el.chartCanvas.setAttribute('aria-valuetext', 'Age ' + age + ': ' + (rows.length
      ? rows.map((r) => LABELS[r.k] + ' ' + r.v.toFixed(1) + ' hours').join(', ')
      : 'all lines hidden'));
  }

  function buildLegend() {
    el.legend.innerHTML = '';
    for (const k of SERIES_ORDER) {
      const off = !!state.hidden[k];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-pressed', String(!off));
      const dot = document.createElement('span');
      dot.className = 'dot';
      dot.style.background = off ? 'rgba(237,234,228,.2)' : COLORS[k];
      btn.appendChild(dot);
      btn.appendChild(document.createTextNode(LABELS[k]));
      btn.addEventListener('click', () => {
        state.hidden = { ...state.hidden, [k]: !state.hidden[k] };
        const nowOff = !!state.hidden[k];
        btn.setAttribute('aria-pressed', String(!nowOff));
        dot.style.background = nowOff ? 'rgba(237,234,228,.2)' : COLORS[k];
        drawChart();
      });
      el.legend.appendChild(btn);
    }
  }

  // --- Text values ------------------------------------------------------
  // "At your age" anchors the sentence to the reader's real age, not the
  // scrubbed one — the line never follows the scrub.
  function insightFor(a) {
    return a < 20 ? 'At your age, time with parents and siblings is near its lifetime peak. It falls sharply from here.'
      : a <= 35 ? 'At your age, time with friends has already peaked. Time with a partner and children is what these decades are made of.'
      : a <= 55 ? 'At your age, if you have children, your time with them is peaking now, and it will fall faster than you expect.'
      : 'From your age on, time alone rises. What you do with it is the question.';
  }
  function sexBasisText() {
    return state.sex === 'm' ? '81.1 years (males)'
      : state.sex === 'f' ? '85.1 years (females)'
      : '83.1 years (average of 81.1 for males and 85.1 for females)';
  }
  function renderText() {
    const total = totalWeeks();
    const capped = Math.min(state.lived, total);
    const remain = Math.max(0, total - state.lived);
    const bonus = state.submitted && state.age >= lifespan();

    el.capMain.textContent = bonus
      ? 'You’re living in bonus time. Every week is a gift.'
      : `You have lived ${fmt(capped)} of your ~${fmt(total)} weeks. ${fmt(remain)} remain, on average.`;
    el.smallPrintText.textContent = `Based on life expectancy at birth in Australia, where this page was made: ${sexBasisText()}. `;
    // The date renders in the reader's own locale; the surrounding sentence
    // stays English, so the weekday below does too.
    const b = new Date(state.birthVal + 'T00:00:00');
    el.editDob.textContent = `Born ${b.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} — edit`;
    el.insight.textContent = insightFor(state.age);
    el.actPrompt.textContent = bonus
      ? 'Who came to mind just now?'
      : `You have ${fmt(remain)} weeks left. Who came to mind just now?`;
    // Week #lived+1 is the one burning now (the ember); the next one starts
    // on the birth weekday, not a generic Monday.
    el.weekNext.textContent = `Your week #${fmt(state.lived + 2)} starts ${b.toLocaleDateString('en-US', { weekday: 'long' })}.`;
  }

  // --- Section 5: SMS + share ------------------------------------------
  const SMS_BODY = 'Hey — was thinking about you. Free this week?';
  function updateSms() {
    const has = !!state.name.trim();
    el.sms.classList.toggle('hidden', !has);
    el.smsMsg.classList.add('hidden');
    if (has) {
      el.sms.textContent = `Text ${state.name} now`;
      el.sms.href = 'sms:?&body=' + encodeURIComponent(SMS_BODY);
    }
  }
  // Desktops mostly have no sms: handler; a click there must not die
  // silently at the arc's one conversion moment. Same fallback shape as
  // the share button: put the draft on the clipboard and say so.
  function likelyHandlesSms() {
    return /android|iphone|ipad|ipod/i.test(navigator.userAgent);
  }
  el.sms.addEventListener('click', async (e) => {
    if (likelyHandlesSms()) return;
    e.preventDefault();
    const name = state.name.trim();
    try {
      await navigator.clipboard.writeText(SMS_BODY);
      el.smsMsg.textContent = `Message copied — text ${name} from your phone.`;
    } catch (err) {
      el.smsMsg.textContent = `No messaging app here. Text ${name} from your phone: “${SMS_BODY}”`;
    }
    el.smsMsg.classList.remove('hidden');
  });
  function shareUrl() {
    const u = new URL(location.href);
    u.search = '?age=' + state.age;
    u.hash = '';
    return u.toString();
  }
  function makeCard() {
    return new Promise((res) => {
      const W = 1080, H = 1350, c = document.createElement('canvas');
      c.width = W; c.height = H;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#0A0A0A'; ctx.fillRect(0, 0, W, H);
      const rows = lifespan(), cell = 12, gw = 52 * cell, gx = (W - gw) / 2, gy = 100;
      const total = totalWeeks();
      const capped = Math.min(state.lived, total);
      // Same ember rule as the on-page grid: past expectancy it sits on the
      // last cell instead of vanishing.
      const ember = capped < total ? capped : total - 1;
      for (let i = 0; i < rows * 52; i++) {
        const x = gx + (i % 52) * cell + cell / 2;
        const y = gy + Math.floor(i / 52) * cell + cell / 2;
        ctx.fillStyle = i === ember ? '#D9863B' : i < capped ? 'rgba(237,234,228,.92)' : 'rgba(237,234,228,.14)';
        ctx.beginPath(); ctx.arc(x, y, i === ember ? cell * 0.46 : cell * 0.32, 0, Math.PI * 2); ctx.fill();
      }
      // Center the text block in the band below the grid (no dead bottom
      // third on shorter lifespans), and let the card invite, not just state.
      const gridBottom = gy + rows * cell;
      const blockH = 118;
      const y0 = gridBottom + (H - gridBottom - blockH) / 2 + 34;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#EDEAE4';
      ctx.font = '300 46px Newsreader, Georgia, serif';
      ctx.fillText(`I’ve lived ${fmt(capped)} of my ~${fmt(total)} weeks`, W / 2, y0);
      ctx.fillStyle = 'rgba(237,234,228,.6)';
      ctx.font = 'italic 300 28px Newsreader, Georgia, serif';
      ctx.fillText('You have about 4,000 weeks. See yours.', W / 2, y0 + 56);
      ctx.fillStyle = '#D9863B';
      ctx.font = '26px Helvetica, Arial, sans-serif';
      const u = new URL(shareUrl());
      ctx.fillText(u.host + u.pathname, W / 2, y0 + 118);
      c.toBlob(res, 'image/png');
    });
  }
  async function doShare() {
    try {
      const blob = await makeCard();
      const url = shareUrl();
      const text = `I’ve lived ${fmt(Math.min(state.lived, totalWeeks()))} of my ~${fmt(totalWeeks())} weeks.`;
      const file = new File([blob], 'your-life-in-weeks.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], text, url }); return; }
        catch (e) { if (e.name === 'AbortError') return; }
      }
      // No share sheet here (desktop, usually): copy the link, and offer the
      // card as an explicit download rather than forcing a file on anyone.
      await navigator.clipboard.writeText(text + ' ' + url);
      if (cardUrl) URL.revokeObjectURL(cardUrl);
      cardUrl = URL.createObjectURL(blob);
      showShareMsg('Link copied. ', { href: cardUrl, label: 'Download the card image', download: 'your-life-in-weeks.png' });
    } catch (e) {
      showShareMsg('Couldn’t share here. Try on your phone.');
    }
  }
  function showShareMsg(msg, link) {
    el.shareMsg.textContent = msg;
    if (link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.download = link.download;
      a.textContent = link.label;
      el.shareMsg.appendChild(a);
    }
    el.shareMsg.classList.remove('hidden');
  }

  // --- Submit -----------------------------------------------------------
  function showErr(msg) {
    el.err.textContent = msg;
    el.err.classList.remove('hidden');
    el.dob.setAttribute('aria-invalid', 'true');
  }
  function clearErr() {
    el.err.textContent = '';
    el.err.classList.add('hidden');
    el.dob.removeAttribute('aria-invalid');
  }
  function submit() {
    const v = state.birthVal;
    if (!v) return showErr('Enter your birthdate to begin.');
    const b = new Date(v + 'T00:00:00'), now = new Date();
    if (isNaN(b)) return showErr('That date didn’t come through — try picking it again.');
    if (b > now) return showErr('That date hasn’t happened yet.');
    const ageY = (now - b) / (365.25 * DAY_MS);
    if (ageY > 99) return showErr('That’s more than 99 years ago — check the year.');

    clearErr();
    state.lived = Math.floor((now - b) / (7 * DAY_MS));
    state.age = Math.floor(ageY);
    state.submitted = true;

    el.results.classList.add('shown');
    buildLegend();
    renderText();
    updateSms();
    revealInit();
    startGrid(true);
    startChart();

    if (el.gridWrap) {
      const top = el.gridWrap.getBoundingClientRect().top + window.scrollY - 28;
      window.scrollTo({ top, behavior: prefersReduced() ? 'auto' : 'smooth' });
      state.autoScrollTop = top;
    }
    // Hand screen readers and the keyboard the story, not the submit button.
    el.capMain.focus({ preventScroll: true });
  }

  // --- Wiring -----------------------------------------------------------
  el.dob.addEventListener('input', (e) => { state.birthVal = e.target.value; clearErr(); });
  el.form.addEventListener('submit', (e) => { e.preventDefault(); submit(); });

  el.basisSeg.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-sex]');
    if (!btn) return;
    state.sex = btn.getAttribute('data-sex');
    el.basisSeg.querySelectorAll('button').forEach((b) => {
      b.setAttribute('aria-pressed', String(b === btn));
    });
    if (state.submitted) { startGrid(false); renderText(); }
  });

  el.basisToggle.addEventListener('click', () => {
    const open = !el.basisSeg.classList.toggle('hidden');
    el.basisToggle.setAttribute('aria-expanded', String(open));
  });

  el.editDob.addEventListener('click', () => {
    document.querySelector('.hero').scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' });
    el.dob.focus({ preventScroll: true });
  });

  el.name.addEventListener('input', (e) => { state.name = e.target.value; updateSms(); });
  el.share.addEventListener('click', doShare);

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    if (!state.submitted) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { startGrid(false); startChart(); }, 120);
  });

})();
