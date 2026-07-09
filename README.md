# DealCraft — Founder Equity Coach

Interactive calculators (and an AI coach) answering: **"If my company sells for $X, what do I actually take
home?"** and **"How should we split equity between cash and sweat equity?"**

Built with React + Vite + Tailwind CSS + Recharts, per `equity-coach-spec.md`.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run lint     # oxlint
```

## What's implemented

### Exit Waterfall Simulator (Module 1A)

A pure-math, no-signup simulator that models up to 5 financing rounds against an exit price and shows exactly
how liquidation preferences, participation, cumulative dividends, seniority, transaction costs, and carve-outs
turn a founder's ownership % into an actual dollar figure.

- Multi-round preference stack: amount raised, liquidation preference multiple, participating (capped/uncapped)
  vs. non-participating with an as-converted test, stacked vs. pari passu seniority, cumulative dividends
  (simple/compounding, before/after the multiple)
- Deal-level inputs: founder fully-diluted ownership %, option pool %, exit price, transaction costs/escrow,
  management carve-out (with an explicit "founder included?" toggle, default no)
- Scenario presets: Bootstrapped (zero rounds), Pre-Seed, Seed → Series B
- Step-down waterfall chart, "what you think you get" vs. "what you actually get" comparison, auto-generated
  three-scenario truth table (Home Run / Solid / Messy), a sensitivity lab for flipping individual terms
- Landing hero with a live mini-waterfall demo, no signup required
- JSON export/import for saving scenarios (no localStorage — explicit file-based persistence only); PDF export
  via the browser's native print dialog

Anti-dilution (full ratchet / broad-based weighted average) is captured per round and surfaced with an
explanatory note, but is not used to auto-adjust payouts — modeling it precisely requires full share-price
history that a proceeds-based calculator like this doesn't track.

### Friends & Family / Sweat Equity Calculator

Implements the **Slicing Pie** dynamic equity model (Mike Moyer): cash, sweat-equity time, and unreimbursed
expenses all convert to a common "slice" unit (fair market value × a risk multiplier), normalized into an
ownership percentage. Also surfaces each contributor's deferred income — the unpaid fair-market value of their
time.

### Learn panel

A slide-over reachable from the header with a step-by-step how-to guide per tool and a searchable glossary.
Every glossary term carries contextual notes for up to four situations (Term Sheet / Fundraising, Exit / M&A,
Job Offer / Comp, Friends & Family / Sweat Equity) — the same term means something different depending on what
you're actually facing.

### Ask the Coach (AI chat)

A chat panel that calls Claude directly from the browser to help you understand your numbers or review a
document (term sheet, job offer, employment agreement, M&A terms, advisor agreement). Reachable from the header
for general questions, or from inside either calculator's results ("Ask the Coach about these numbers" / "...
about this split") to auto-attach your actual scenario as context.

**This is bring-your-own-key by design, not an oversight.** You paste your own Anthropic API key
(console.anthropic.com), which stays in memory for the browser session only — it's sent directly from your
browser to Anthropic (via the SDK's `dangerouslyAllowBrowser` option) and never touches any server this app
controls. That matches the project's privacy stance: no contract text or deal data is ever stored or proxied
server-side. The tradeoff is that every user needs their own key rather than a seamless no-setup experience — a
shared-key proxy server (so users don't need their own key) is a reasonable v2 direction if this needs to
support non-technical users at scale, likely as a paid tier to cover the shared API cost.

Contract review supports pasted text or PDF upload (sent as a base64 document block, per Anthropic's API).
Model: `claude-opus-4-8` with adaptive thinking.

Everything else in `equity-coach-spec.md` (Modules 1B–1F, and the rest of Module 2/3 beyond the chat) is out of
scope for this build.
