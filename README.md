# DealCraft — Exit Waterfall Simulator (Module 1A)

Interactive calculator answering: **"If my company sells for $X, what do I actually take home?"**

Built with React + Vite + Tailwind CSS + Recharts, per `equity-coach-spec.md`. This is Module 1A of the
DealCraft founder equity coach — a pure-math, no-signup simulator that models up to 5 financing rounds
against an exit price and shows exactly how liquidation preferences, participation, cumulative dividends,
seniority, transaction costs, and carve-outs turn a founder's ownership % into an actual dollar figure.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run lint     # oxlint
```

## What's implemented

- Multi-round preference stack (1–5 rounds): amount raised, liquidation preference multiple, participating
  (capped/uncapped) vs. non-participating with an as-converted test, stacked vs. pari passu seniority,
  cumulative dividends (simple/compounding, before/after the multiple)
- Deal-level inputs: founder fully-diluted ownership %, option pool %, exit price, transaction costs/escrow,
  management carve-out (with an explicit "founder included?" toggle, default no)
- Step-down waterfall chart (exit price → costs/carve-outs → preference stack → participation → founder payout)
- "What you think you get" vs. "what you actually get" comparison
- Auto-generated three-scenario truth table (Home Run / Solid / Messy)
- Sensitivity lab: flip participation, preference multiple, or dividends and see the real-time dollar delta
- Landing hero with a live mini-waterfall demo, no signup required
- JSON export/import for saving scenarios (no localStorage — explicit file-based persistence only)
- PDF export via the browser's native print dialog, styled for a clean lawyer-facing document
- Persistent disclaimer footer + first-run modal ("preparation, not representation")

Anti-dilution (full ratchet / broad-based weighted average) is captured per round and surfaced with an
explanatory note, but is not used to auto-adjust payouts — modeling it precisely requires full share-price
history that a proceeds-based calculator like this doesn't track. See the in-app tooltip on that field.

Everything else in `equity-coach-spec.md` (Modules 1B–1F, 2, 3) is out of scope for this build.
