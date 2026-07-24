# mementomori

> remember that you must die

**Your Life in Weeks** — a single-scroll, mobile-first web page whose only job is
to make you viscerally feel that your time is finite, then turn that feeling into
one action and one share.

It's an emotional arc in five sections: **confront → contextualize → reframe →
act → share.**

1. **Hero** — "You have about 4,000 weeks." Enter your birthdate and pick a
   life-expectancy basis (Australian figures: Female 85.1 / Male 81.1 /
   Average 83.1 years).
2. **Calendar** — a 52-column grid of dots, one per week of life, that fills
   top-to-bottom over ~1.5s. Your current week is a single pulsing amber dot.
3. **Chart** — hours per day spent with family, friends, partner, children,
   coworkers, and alone, by age (U.S. American Time Use Survey, via Our World in
   Data). Drag the amber "you are here" line; tap the legend to filter people.
4. **Reframe** — Seneca, *On the Shortness of Life*, and the idea of Time Wealth.
5. **Act + share** — text someone who came to mind, and share your dot grid as a
   card image.

Nothing is stored. Everything stays on your device.

## Running it

It's a static site with no build step and no dependencies — open `index.html` in
a browser, or serve the folder:

```sh
python3 -m http.server
```

- `index.html` — markup + styles
- `app.js` — all behavior (canvas grid, chart, share card), OWID/ATUS data
  inlined so nothing is fetched at runtime
- `fonts/` — self-hosted, subsetted Newsreader variable fonts (no third-party
  requests)
- `og.png`, `apple-touch-icon.png` — link-preview card and touch icon

## `design/`

The original Claude Design handoff bundle this implementation was built from —
the `.dc.html` prototype, the chat transcripts where the design was worked out,
and the reference images. Kept for provenance.
