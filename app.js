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
    hidden: {},       // series key -> true when hidden
  };

  const lifespanExact = () => state.sex === 'm' ? 81.1 : state.sex === 'f' ? 85.1 : 83.1;
  const lifespan = () => Math.round(lifespanExact());
  const totalWeeks = () => lifespan() * 52;

  // Grid / chart runtime handles
  let grid = null, gridRaf = 0, pulseRaf = 0, pulseVisible = true, vio = null;
  let chart = null, scrub = null, dragging = false;

  // --- Elements ---------------------------------------------------------
  const el = {
    form: $('birth-form'), dob: $('dob'), err: $('err'), sexSeg: $('sex-seg'),
    results: $('results'),
    gridWrap: $('grid-wrap'), gridCanvas: $('grid'),
    capMain: $('cap-main'), smallPrint: $('small-print'),
    legend: $('legend'), chartCanvas: $('chart'), insight: $('insight'),
    actPrompt: $('act-prompt'), name: $('name'), sms: $('sms'), weekNext: $('week-next'),
    share: $('share'), shareMsg: $('share-msg'),
  };

  // --- ?age= prefill (never auto-submits, never carries a birthdate) ----
  (() => {
    const a = parseInt(new URLSearchParams(location.search).get('age'), 10);
    if (a > 0 && a < 100) {
      state.birthVal = (new Date().getFullYear() - a) + '-01-01';
      el.dob.value = state.birthVal;
    }
  })();
  el.dob.max = new Date().toISOString().slice(0, 10);

  // --- Scroll reveal ----------------------------------------------------
  let revealIO = null;
  function revealInit() {
    setTimeout(() => {
      revealIO = revealIO || new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll('[data-reveal]:not([data-rv])').forEach((node) => {
        node.dataset.rv = '1';
        revealIO.observe(node);
      });
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
    const current = capped < total ? capped : -1;
    grid = { ctx, cell, rows, w, h, current, capped };

    const dur = (animate && !prefersReduced()) ? 1500 : 0;
    const t0 = performance.now();
    const step = (t) => {
      const p = dur ? Math.min(1, (t - t0) / dur) : 1;
      drawGrid(Math.floor(p * capped));
      if (p < 1) gridRaf = requestAnimationFrame(step);
      else startPulse();
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
    }
  }
  function drawChart() {
    if (!chart) return;
    const { ctx, w, h, m } = chart, D = TIMEUSE;
    const X = (age) => m.l + (age - 15) / 65 * (w - m.l - m.r);
    const yMax = 9;
    const Y = (v) => h - m.b - v / yMax * (h - m.t - m.b);
    ctx.clearRect(0, 0, w, h);
    ctx.font = '11px Helvetica, Arial, sans-serif';
    ctx.fillStyle = 'rgba(237,234,228,.38)';
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

    // "You are here" line + tooltip
    const age = scrub, xi = X(age), idx = Math.min(65, Math.max(0, age - 15));
    ctx.strokeStyle = '#D9863B'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(xi, m.t - 6); ctx.lineTo(xi, h - m.b); ctx.stroke();
    ctx.fillStyle = '#D9863B';
    ctx.beginPath(); ctx.arc(xi, m.t - 6, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.font = '600 10px Helvetica, Arial, sans-serif'; ctx.textBaseline = 'alphabetic';
    const lbl = 'YOU ARE HERE · ' + age;
    const onRight = xi < w / 2;
    ctx.textAlign = onRight ? 'left' : 'right';
    ctx.fillText(lbl, xi + (onRight ? 8 : -8), m.t - 3);

    const rows = SERIES_ORDER
      .filter((k) => !state.hidden[k])
      .map((k) => ({ k, v: D.series[k][idx] }))
      .sort((a, b) => b.v - a.v);
    if (!rows.length) return;
    const bw = 128, bh = 16 + rows.length * 17 + 6;
    const bx = onRight ? Math.min(xi + 12, w - m.r - bw) : Math.max(xi - 12 - bw, m.l);
    const by = m.t + 8;
    ctx.fillStyle = 'rgba(10,10,10,.88)';
    ctx.strokeStyle = 'rgba(237,234,228,.16)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 6); ctx.fill(); ctx.stroke();
    ctx.font = '11px Helvetica, Arial, sans-serif';
    rows.forEach((r, i) => {
      const y = by + 16 + i * 17;
      ctx.fillStyle = COLORS[r.k];
      ctx.beginPath(); ctx.arc(bx + 12, y - 3.5, 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(237,234,228,.78)'; ctx.textAlign = 'left';
      ctx.fillText(LABELS[r.k], bx + 21, y);
      ctx.textAlign = 'right';
      ctx.fillText(r.v.toFixed(1) + 'h', bx + bw - 10, y);
    });
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
  function insightFor(a) {
    return a < 20 ? 'Your time with parents and siblings is near its lifetime peak. It falls sharply from here.'
      : a <= 35 ? 'Time with friends has already peaked. Time with a partner and children is what these decades are made of.'
      : a <= 55 ? 'Time with your children is peaking now — and it will fall faster than you expect.'
      : 'Time alone rises for the rest of life. What you do with it is the question.';
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
    el.smallPrint.textContent = `Based on Australian life expectancy at birth: ${sexBasisText()}.`;
    el.insight.textContent = insightFor(state.age);
    el.actPrompt.textContent = bonus
      ? 'Who came to mind just now?'
      : `You have ${fmt(remain)} weeks left. Who came to mind just now?`;
    el.weekNext.textContent = `Your week #${fmt(state.lived + 1)} starts Monday.`;
  }

  // --- Section 5: SMS + share ------------------------------------------
  function updateSms() {
    const has = !!state.name.trim();
    el.sms.classList.toggle('hidden', !has);
    if (has) {
      el.sms.textContent = `Text ${state.name} now`;
      el.sms.href = 'sms:?&body=' + encodeURIComponent('Hey — was thinking about you. Free this week?');
    }
  }
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
      for (let i = 0; i < rows * 52; i++) {
        const x = gx + (i % 52) * cell + cell / 2;
        const y = gy + Math.floor(i / 52) * cell + cell / 2;
        ctx.fillStyle = i === capped ? '#D9863B' : i < capped ? 'rgba(237,234,228,.92)' : 'rgba(237,234,228,.14)';
        ctx.beginPath(); ctx.arc(x, y, i === capped ? cell * 0.46 : cell * 0.32, 0, Math.PI * 2); ctx.fill();
      }
      ctx.textAlign = 'center';
      ctx.fillStyle = '#EDEAE4';
      ctx.font = '300 46px Newsreader, Georgia, serif';
      ctx.fillText(`I’ve lived ${fmt(capped)} of my ~${fmt(total)} weeks`, W / 2, gy + rows * cell + 92);
      ctx.fillStyle = '#D9863B';
      ctx.font = '26px Helvetica, Arial, sans-serif';
      const u = new URL(shareUrl());
      ctx.fillText(u.host + u.pathname, W / 2, gy + rows * cell + 148);
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
      await navigator.clipboard.writeText(text + ' ' + url);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'your-life-in-weeks.png';
      a.click();
      showShareMsg('Link copied — card image downloaded.');
    } catch (e) {
      showShareMsg('Couldn’t share here — try on your phone.');
    }
  }
  function showShareMsg(msg) {
    el.shareMsg.textContent = msg;
    el.shareMsg.classList.remove('hidden');
  }

  // --- Submit -----------------------------------------------------------
  function showErr(msg) {
    el.err.textContent = msg;
    el.err.classList.remove('hidden');
  }
  function clearErr() {
    el.err.textContent = '';
    el.err.classList.add('hidden');
  }
  function submit() {
    const v = state.birthVal;
    if (!v) return showErr('Enter your birthdate to begin.');
    const b = new Date(v + 'T00:00:00'), now = new Date();
    if (isNaN(b)) return showErr('That date didn’t parse — try again.');
    if (b > now) return showErr('That date hasn’t happened yet.');
    const ageY = (now - b) / (365.25 * DAY_MS);
    if (ageY > 99) return showErr('This works for ages up to 99 — check the year.');

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
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  // --- Wiring -----------------------------------------------------------
  el.dob.addEventListener('input', (e) => { state.birthVal = e.target.value; clearErr(); });
  el.form.addEventListener('submit', (e) => { e.preventDefault(); submit(); });

  el.sexSeg.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-sex]');
    if (!btn) return;
    state.sex = btn.getAttribute('data-sex');
    el.sexSeg.querySelectorAll('button').forEach((b) => {
      b.setAttribute('aria-pressed', String(b === btn));
    });
    if (state.submitted) { startGrid(false); renderText(); }
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
