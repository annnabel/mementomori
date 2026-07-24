# Design System — Your Life in Weeks

Captured from the shipped implementation (`index.html`, `app.js`). This is the
committed identity: variants and new work stay inside it unless a deliberate
rebrand is requested.

## Overview

A dark, single-column, serif-led ceremonial page. The visual metaphor is a
candlelit room: near-black ground, warm ivory ink, and a single amber ember —
the pulsing dot of the current week. Color strategy is **restrained on a dark
ground**: two neutrals carry ~97% of the surface; amber is reserved for "you
are here" (current week, chart scrub line, links, focus rings) and never used
decoratively. The time-spent chart is the one full-palette moment, with six
muted categorical hues.

- **Register**: brand (the page is the product)
- **Theme**: dark only — no light mode; `color-scheme: dark` on form controls
- **Layout**: single column, max-width 680px (520px for the calendar), long
  scroll, one idea per fold

## Color Palette

Core tokens (defined on `:root` in `index.html`):

| Token | Value | Role |
|---|---|---|
| `--bg` | `#0A0A0A` | Page ground, share-card ground, `theme-color` |
| `--fg` | `#EDEAE4` | Warm ivory ink: text, filled dots, primary buttons |
| `--amber` | `#D9863B` | The ember: current-week dot, scrub line, links, focus, errors |
| `--amber-hi` | `#E8A05F` | Amber hover state |
| `--field` | `#141412` | Input and segmented-control fill |
| `--field-border` | `#2C2B28` | Input borders |

Opacity ramp on `--fg` (rgba of `237,234,228`) instead of gray tokens:

- `.92` filled calendar dots, readout values · `.8` legend text
- `.7` segmented buttons, chart readout · `.6` hero sub, Time Wealth body
- `.55` labels, microcopy, sources, hints, axis labels, legend-off text —
  the **text floor**: no informative text below `.5` (4.6:1 on `--bg`);
  ≤13px text uses `.55` (5.4:1)
- `.5` quote attribution and the Time Wealth aside
- `.28`–`.12` hairlines/borders (non-text) · `.14`/`.13` unlived (hollow) dots

Chart categorical palette (`COLORS` in `app.js`) — muted, desaturated so the
lines feel archival rather than dashboard-bright:

| Series | Hex |
|---|---|
| Family | `#93B79B` (sage) |
| Friends | `#7FA3C9` (dusty blue) |
| Partner | `#B393C9` (lilac) |
| Children | `#C98F93` (dusty rose) |
| Coworkers | `#8A867F` (warm gray) |
| Alone | `#EDEAE4` (the ivory ink — Alone is "you") |

Rules:

- Amber signals *the present moment* only. Never use it as a decorative
  accent, section divider, or heading color.
- `::selection` inverts: amber background, near-black text.

## Typography

| Role | Family | Notes |
|---|---|---|
| Display / ceremonial | `Newsreader` (self-hosted in `fonts/`, subsetted variable woff2: wght 300–500 roman / 300–400 italic, opsz 18–72, ASCII + typographic punctuation; ~101KB total, preloaded, `font-display: swap`) | Hero h1, section h2s, calendar caption, insight line, Seneca quote |
| Utility | `Helvetica Neue / Helvetica / Arial` | Labels, microcopy, buttons, chart text |

Newsreader is the committed brand voice (identity-preservation; don't swap it
on variants). The pairing is a deliberate contrast axis: high-contrast optical
serif for meaning, neutral grotesque for mechanics.

Scale (all fluid `clamp()`):

- Hero h1: `clamp(42px, 9vw, 76px)`, weight 400, line-height 1.04,
  letter-spacing −0.015em, `text-wrap: balance`
- Reframe quote: `clamp(30px, 7vw, 58px)`, weight 300 italic, line-height 1.26
- Section h2: `clamp(28px, 6vw, 38px)`, weight 400
- Caption / insight: `clamp(19px, 4vw, 23px)`, line-height 1.4–1.45,
  `text-wrap: pretty`
- Body/UI: 16px fields and buttons; 13px uppercase labels
  (letter-spacing .08em), sources, hints, and chart readout; 12.5px microcopy
  (nothing below 12.5px in HTML text)
- Uppercase is reserved for short labels and the quote attribution
  (letter-spacing .14em) — never body copy

## Components

- **Field** (`.field`): `#141412` fill, 1px `#2C2B28` border, 8px radius,
  14×16px padding, 16px text (prevents iOS zoom). Focus:
  `outline: 2px solid var(--amber); outline-offset: 1px`.
- **Primary button** (`.primary`, `.sms-link`): ivory fill, near-black text,
  8px radius, min-height 52px, weight 600. Hover brightens to `#FFFFFF`;
  active nudges down 1px. One per section, max.
- **Secondary button** (`.share-btn`): ghost — 1px ivory border, transparent
  fill; hover inverts to ivory fill.
- **Segmented control** (`.seg`): pill-adjacent buttons, `aria-pressed`;
  selected state inverts (ivory fill, dark text). Min-height 44px.
- **Legend chips** (`.legend button`): 999px radius pills with 8px color dot,
  `aria-pressed` toggles, min-height 44px (touch target); off state drops to
  `.55` text / `.16` border.
- **Inline error** (`.err`): amber text, `role="alert"`, no alerts/toasts.
- **Calendar grid**: canvas, 52 dots per row, dot radius = 0.32 × cell.
  Filled `rgba(237,234,228,.92)`, unlived `.13`, current week amber and
  pulsing. `aria-hidden` with the caption as text equivalent.
- **Chart**: canvas in an unpadded `#chart-wrap` (sized to content width),
  amber vertical scrub line with amber age chip, `touch-action: pan-y`,
  `cursor: ew-resize`. The canvas is a focusable `role="slider"`
  (arrow keys / Home / End move the age; `aria-valuetext` reads the values).
  Per-age values render in the DOM readout (`.readout`) below the canvas —
  amber age, color-dotted series values, tabular numerals — never as an
  in-canvas tooltip occluding the lines.
- **Share card**: generated canvas, 1080×1350 (4:5 portrait). Same tokens:
  `#0A0A0A` ground, dot grid with amber current week, Newsreader 300 46px
  stat line in ivory, amber 26px URL line. The card is a first-class surface
  — it must look like the page.
- **Link-preview card** (`og.png`, 1200×630) and favicon (inline SVG amber
  ember on near-black; `apple-touch-icon.png`): same tokens as the page, so
  the share loop looks like the product at every hop.

## Layout & Spacing

- Containers: 680px max (hero, chart, act), 520px (calendar), 820px (quote).
  Side padding 24px.
- Vertical rhythm is deliberately uneven — it breathes where the emotion
  peaks: hero fills `92svh`; chart section 96px padding; reframe 140px;
  act ends with 160px bottom padding.
- Forms and CTA stacks cap at 380px wide with 10–12px gaps.
- Radius scale: 8px (fields, buttons), 999px (chips). No cards, no panels —
  content sits directly on the dark ground.

## Motion

- **Calendar fill**: dots fill top-to-bottom over ~1.5s on first render — the
  emotional core ("watching your life fill up"). Current-week dot pulses
  continuously (rAF), pausing when off-screen.
- **Scroll reveals** (`[data-reveal]`): fade + 18px rise, 0.8s ease, via
  IntersectionObserver at 0.12 threshold; content is visible-by-default
  markup, only enhanced by the transition.
- **Micro**: 0.15s ease on button/hover state changes; 1px translate on
  active.
- **Reduced motion**: `prefers-reduced-motion: reduce` disables reveals; JS
  checks `prefersReduced()` to skip the fill animation, pulse, and the
  post-submit smooth scroll. Every animation has an instant/static
  equivalent.
- No parallax, no bounce, no elastic. Motion only where meaning lives.

## Voice & Copy

- Declarative, exact, unhurried: "You have lived **1,672** of your ~4,326
  weeks." Numbers are `toLocaleString`-formatted.
- No exclamation marks, no emoji, no hedging softeners.
- Honesty artifacts are part of the design: on-chart "U.S. data" caveat,
  life-expectancy small print (Australian figures: F 85.1 / M 81.1 /
  avg 83.1), "on average" qualifiers, "Stays on your device — we store
  nothing."
- Over-expectancy users get "bonus time" framing; never negative remaining
  weeks, never an error state for being old.
