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
- **Layout**: single column, max-width 680px, long scroll, one idea per fold

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
| Family | `#95C98C` (sage) |
| Friends | `#699FDE` (dusty blue) |
| Children | `#E0876F` (terracotta) |
| Partner | `#C99BEB` (lilac) |
| Coworkers | `#8A867F` (warm gray) |
| Alone | `#EDEAE4` (the ivory ink — Alone is "you") |

Series order (legend, labels, readout) is fixed as listed: blue and lilac are
deliberately non-adjacent, and the hues are stepped so every adjacent pair
clears color-vision-deficiency separation (validated CVD ΔE ≥ 16, normal ≥ 16
on the dark ground). Direct labels back the colors up, so identity never
rides on hue alone.

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
- Reframe quote: `clamp(30px, 7vw, 58px)`, weight 300 italic, line-height 1.3
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
  `outline: 2px solid var(--amber); outline-offset: 1px`. All buttons and
  links share the amber `focus-visible` outline (2px, offset 2px) — one focus
  language everywhere.
- **Primary button** (`.primary`, `.sms-link`): ivory fill, near-black text,
  8px radius, min-height 52px, weight 600. Hover brightens to `#FFFFFF`;
  active nudges down 1px. One per section, max.
- **Secondary button** (`.share-btn`): ghost — 1px ivory border, transparent
  fill; hover inverts to ivory fill.
- **Segmented control** (`.seg`): pill-adjacent buttons, `aria-pressed`;
  selected state inverts (ivory fill, dark text). Min-height 44px. The
  life-expectancy basis control lives in the calendar section behind the
  "Change life expectancy" quiet link (progressive disclosure), never in the
  hero form — activation asks for the birthdate alone.
- **Quiet link** (`.quiet-link`): amber underlined text-button for in-flow
  corrections ("Change life expectancy", "Born May 14, 1993 — edit") set at
  small-print size; hover shifts to `--amber-hi`.
- **Legend chips** (`.legend button`): 999px radius pills with 8px color dot,
  `aria-pressed` toggles, min-height 44px (touch target); off state drops to
  `.55` text / `.16` border.
- **Inline error** (`.err`): amber text, `role="alert"`, no alerts/toasts.
- **Calendar grid**: canvas, one column per year of age with 52 weeks top to
  bottom — a life reads left to right like a timeline, and the page grid is
  the same picture as the share card that may have invited the reader. Dot
  radius = 0.32 × cell. Filled `rgba(237,234,228,.92)`, unlived `.13`,
  current week amber and pulsing, with an amber "NOW · age" marker ticked to
  the ember's column and an AGE 20/40/60/80 axis below. A small-print key
  sits above the grid ("Each column is a year. One dot per week — the amber
  dot is this week.") so the metaphor is decoded before the fill
  finishes. Past expectancy the ember clamps to the last cell (on the grid
  and the share card alike) — the current week is always still burning, never
  "complete". `aria-hidden` with the caption as text equivalent; the caption
  takes focus (`tabindex="-1"`) after submit.
- **Birthdate field**: free text, not a native date picker — scrolling
  decades in a picker is high friction on mobile; typing is faster. A
  forgiving parser reads "24 July 1999", "July 24 1999", "24/7/1999",
  "1999-07-24", "24.07.99", and "24071999"; bare numbers are day-first
  (the page is Australian) with a month-first fallback when day-first is
  impossible. Placeholder shows an example; the parse-failure error names
  two formats.
- **Chart**: canvas in an unpadded `#chart-wrap` (sized to content width),
  amber vertical scrub line with amber age chip, `touch-action: pan-y`,
  `cursor: ew-resize`. Values plot as a share of a 16-hour waking day
  (percent, 0–50% gridlines), not raw hours — "16% of your waking day"
  lands harder than "2.6h" — and lines are lightly smoothed (1-2-1 kernel)
  at 2px so survey jitter doesn't hide the shape; the source line declares
  both. On viewports ≥ 480px each visible line gets a direct end label
  (color dot + ivory text, nudged apart on collision) in a reserved right
  margin sized once for the longest label, so toggling never reflows the
  plot. The canvas is a focusable `role="slider"`
  (arrow keys / Home / End move the age; `aria-valuetext` reads the values).
  Three series start on — Alone, Partner, Friends, the ones the insight copy
  speaks to — and the rest are a chip-tap away, so the fold stays under the
  4-option working-memory line. The one-instruction hint ("Drag the amber
  line to any age.") sits after the chart. The scrub label says
  "YOU ARE HERE · N" only at the user's real age; anywhere else it reads
  "AGE N" and a small amber tick holds the user's position on the axis —
  precision earns the emotion, so the marker never lies. The survey ends at
  80: the caveat says so, and for users past 80 the scrub pins to the edge
  with "YOUR DATA ENDS HERE · 80+" instead of dropping "you" off the chart.
  Per-age values render in the DOM readout (`.readout`) below the canvas in
  fixed series order — amber age, color-dotted series values, tabular
  numerals — never as an in-canvas tooltip occluding the lines.
- **Text-someone CTA** (`.sms-link`): `sms:` draft on platforms that have a
  handler; elsewhere the click copies the drafted message and a `role=status`
  microcopy line says "Message copied — text {name} from your phone." The
  conversion moment never fails silently.
- **Share card**: generated canvas, 1080×1350 (4:5 portrait). Same tokens:
  `#0A0A0A` ground, ivory ink, one amber moment. Unlike the page grid, the
  card's grid runs sideways — one column per year of age, 52 weeks top to
  bottom — so a life reads left to right like a timeline and the lived share
  is legible at arm's length. Top to bottom: letterspaced sans eyebrow
  ("YOUR LIFE IN WEEKS", `.55` ivory), Newsreader 300 58px stat
  ("I've lived 1,408 weeks."), italic 33px subline ("About 2,908 of my
  ~4,316 remain." — or the bonus-time line), an amber "NOW · age" marker
  ticked to the ember's column, the grid (glowing amber ember, `.16`
  unlived dots), an AGE 20/40/60/80 axis, the italic invite line
  ("You have about 4,000 weeks. See yours.") and the amber URL. The card
  is a first-class surface — it must look like the page, and it invites, not
  just states.
- **Link-preview card** (`og.png`, 1200×630) and favicon (inline SVG amber
  ember on near-black; `apple-touch-icon.png`): same tokens as the page, so
  the share loop looks like the product at every hop.

## Layout & Spacing

- Containers: 680px max (hero, calendar, chart, act), 820px (quote).
  Side padding 24px.
- Vertical rhythm is deliberately uneven — it breathes where the emotion
  peaks: hero fills `92svh`; chart section 96px padding; reframe 140px;
  act ends with 160px bottom padding.
- Forms and CTA stacks cap at 380px wide with 10–12px gaps.
- Radius scale: 8px (fields, buttons), 999px (chips). No cards, no panels —
  content sits directly on the dark ground.

## Motion

- **Calendar fill**: dots fill left-to-right over ~1.5s on first render — the
  emotional core ("watching your life fill up"). Current-week dot pulses
  continuously (rAF), pausing when off-screen. When the fill completes, if
  the caption's numbers sit below the fold and the user hasn't scrolled on
  their own, the page eases them into view once.
- **Scroll reveals** (`[data-reveal]`): fade + 18px rise, 0.8s ease, via
  IntersectionObserver at 0.12 threshold. Content is visible by default in
  both markup and CSS; JS adds a `.pre-reveal` class in the same tick it
  starts observing, so a failed enhancement path can never blank a section.
  A passive scroll listener catches sections jumped past between frames
  (scrollbar drag, End key) and reveals them instantly.
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
- Honesty artifacts are part of the design: on-chart "U.S. data" caveat with
  "The data ends at age 80", life-expectancy small print (Australian figures:
  F 85.1 / M 81.1 / avg 83.1, with "where this page was made" naming why
  Australia), "on average" qualifiers, "Stays on your device — we store
  nothing."
- The privacy sentence repeats **verbatim** in the hero and the act section —
  repetition reads as a promise; variation reads as copywriting.
- Precision details: the "Born …" date renders in the reader's own locale;
  the week line names the birth weekday and the *next* week's number
  ("Your week #1,734 starts Friday." — week #lived+1 is the ember, already
  burning); the insight line opens "At your age," so it can't be misread as
  describing a scrubbed age.
- Em-dashes are brand voice but rationed: kept where they're signature (the
  privacy line, "Born … — edit", source and quote attributions), replaced
  with periods, commas, or colons elsewhere.
- Errors stay in the page's register — specific, unhurried, never blaming:
  "Enter your birthdate to begin." / "That's more than 99 years ago — check
  the year."
- Over-expectancy users get "bonus time" framing; never negative remaining
  weeks, never an error state for being old.
