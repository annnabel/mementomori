# Product

## Register

brand

## Users

Anyone 15–75 who lands here via a shared link or social post — a friend's
Instagram story, a group-chat message. Assume zero context, 8-second patience,
and a phone in one hand. The design must work for a skeptical first-time
visitor on 4G mobile who was sent here by someone they trust.

The job to be done: feel — viscerally, personally, in under a minute — that
their time is finite, and convert that feeling into one concrete action (text
someone) and one share (send a friend the same jolt).

Two user modes matter:

- **Fresh visitor**: enters their birthdate, watches their life fill in.
- **Share recipient**: arrives with `?age=` prefilled but must confirm their
  own date — the loop restarts cleanly, never showing the sharer's data.

## Product Purpose

A single-scroll, mobile-first page that renders your life as ~4,000+ dots —
one per week — with the weeks already lived filled in. The page is an
emotional arc in five sections, and the arc IS the product:

1. **Confront** — the calendar: "This is how much is gone."
2. **Contextualize** — the time-spent chart: "This is who fills what's left."
   (Increasingly: alone.)
3. **Reframe** — Seneca: "Scarcity is what makes it beautiful."
4. **Act** — name someone, text them now. "Your week #X+1 starts Monday."
5. **Share** — one tap generates a personalized card image; the viral loop.

Success looks like: ≥70% of visitors activate (enter a date), ≥15% of
activated users share, viral coefficient K ≥ 0.4. The share is the retention
mechanism — users visiting once is by design, not a problem to fix.

Everything is stateless and client-side. No accounts, no capture, no
monetization between the user and the share action. Shared links carry
`?age=` only, never a birthdate.

## Brand Personality

**Solemn, precise, humane.**

- The voice of a stoic letter, not a wellness app: plain declarative
  sentences, exact numbers ("You have lived 1,672 of your ~4,326 weeks"),
  no exclamation marks, no softening emoji.
- Dark by conviction: the page is a candlelit room, not a dashboard. The
  darkness gives the single amber dot — your current week, still burning —
  its weight.
- Honest to a fault: data caveats on the chart, life-expectancy assumptions
  in small print with sources, "on average" where it belongs. Precision is
  what makes the confrontation land as *mine* rather than theoretical.
- It must end on agency. The peak-end rule governs the sequencing: the last
  thing felt is power over the remaining weeks, never the countdown.

## Anti-references

- **Doom/edgy memento mori**: skull iconography, gothic blackletter, horror
  tropes. This is a candle, not a crypt.
- **Wellness-app softness**: pastel gradients, rounded mascots, "you've got
  this!" copy. Comfort defuses the confrontation the product depends on.
- **Productivity SaaS**: KPI tiles, streaks, progress rings, gamification.
  The calendar is not a metric to optimize.
- **Instagram quote-poster aesthetics**: script fonts on stock sunsets. The
  Seneca quote is typography-as-monument, not decoration.
- **Anything that stores, captures, or gates.** Email walls, cookie banners
  beyond the legally required, sign-in prompts — each one breaks both the
  trust claim ("we store nothing") and the viral loop.

## Design Principles

1. **The arc is the product.** Every design decision serves the sequence
   confront → contextualize → reframe → act → share. Nothing may reorder it,
   and the page always ends on agency.
2. **One idea per fold.** Single-column, deliberate pacing, generous dark
   space. A section earns the full viewport; competing elements dilute the
   punch.
3. **Precision earns the emotion.** Exact weeks from the exact birthdate,
   real ATUS data, visible caveats. The moment a number feels rounded or
   hand-wavy, it stops being *my* life.
4. **Zero friction at peak motivation.** The action (text a name) and the
   share must be near-zero effort exactly when the quote lands. One CTA pair,
   pre-filled drafts, native share sheet.
5. **Private by architecture, and say so.** All computation on-device;
   birthdates never leave the browser or enter a URL. The privacy microcopy
   is part of the activation funnel, not legal boilerplate.
6. **The share card is a first-class surface.** If the generated image is
   ugly, K collapses regardless of on-page emotion. The card gets the same
   design scrutiny as the hero.

## Accessibility & Inclusion

- Target WCAG 2.1 AA. Body and interactive text ≥4.5:1 against the near-black
  background; muted captions stay above 4.5:1 or are decorative-only.
- `prefers-reduced-motion` fully honored: the calendar fill, pulsing
  current-week dot, and scroll reveals all have instant/static alternatives.
- Touch targets ≥44px; the chart scrubber must not trap vertical page scroll
  (`touch-action: pan-y`).
- Canvas surfaces (calendar, chart) carry text equivalents: the caption states
  the same numbers the grid shows; the chart has `role="img"` with a
  descriptive label and a text insight line.
- Inline, gentle validation — never alerts, never mockery. Age > life
  expectancy gets "bonus time" framing, not an error or negative numbers.
- The subject matter is mortality: copy must stay motivating for a 70-year-old
  as well as a 20-year-old, and never shame, panic, or moralize.
