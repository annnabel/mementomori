# mementomori

remember that you must die

**Your Life in Weeks** — a memento mori rendered as a grid: one row per year, one square per week, out to a horizon you choose (90 years by default). Enter your date of birth and the weeks you have lived light up in teal; the week you are living now burns amber; the rest wait in the dark.

## Use

Open `index.html` in a browser — it is a single self-contained file with no build step and no dependencies.

- **Born** — your date of birth (saved locally, never sent anywhere).
- **Horizon** — the number of years the grid spans (40–120).
- Hover any square for its dates and week number.
- Share a pre-filled view with URL parameters: `index.html?dob=1995-03-12&years=90`.
- Print it for a poster version (the page carries a light print stylesheet).

Honors `prefers-reduced-motion`. Weeks are the classic simplification of 52 per year.
