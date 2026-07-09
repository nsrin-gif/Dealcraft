# Build Spec: "DealCraft" — Founder Equity & Contract Negotiation Coach

## Instructions for Coding Agent

Build a web application that turns first-time founders from one-time players into prepared negotiators. The app has three modules: (1) a **Founder Equity Coach** that teaches and simulates cap table / exit mechanics, (2) a **Contract Review Coach** that analyzes any contract (term sheet, job offer, M&A terms, employment agreement) and produces negotiation points with alignment-based framing, and (3) an **Adaptive Learning Engine** that calibrates every explanation, quiz, and output to the user's knowledge level and preferred learning modality.

**Positioning (bake into all product copy):** This tool prepares founders to have better conversations with their legal teams, boards, and counterparties. It is preparation, not representation.

The conceptual foundation is the "value creation ≠ value capture" framework: ownership percentage does not equal payout percentage; outcomes are determined by the interaction of a payout machine (waterfall), a control machine (governance), and an employment machine (protections).

---

## Tech Stack

- **Frontend:** React (single-page app), Tailwind CSS, Recharts for waterfall visualizations
- **AI:** Anthropic Claude API (`claude-sonnet-4-6`) via `/v1/messages` for the coaching and contract-analysis features
- **Storage:** Local-first (in-memory state + export to JSON/PDF). No user accounts in v1. No contract text stored server-side — privacy is a selling point given the sensitivity of deal documents
- **File input:** Accept pasted text and PDF upload (send PDF as base64 `document` block to the Claude API)
- **Audio:** Browser Web Speech API (SpeechSynthesis) for v1 audio playback; optional upgrade path to a TTS API for two-voice podcast quality
- **Disclaimer:** Persistent footer + first-run modal: "This tool prepares you for conversations with your legal team, board, and investors. It is not legal or financial advice and is not a replacement for qualified representation."

---

## Module 1: Founder Equity Coach

### 1A. Exit Waterfall Simulator (the centerpiece)

Interactive calculator answering: **"If my company sells for $X, what do I actually take home?"**

**Inputs (per financing round, support 1–5 rounds):**
- Amount raised, round name (Seed/A/B/C)
- Liquidation preference multiple (1x, 1.5x, 2x, custom)
- Participating vs. non-participating preferred (if participating: capped or uncapped, cap multiple)
- Seniority: pari passu vs. stacked/senior (default to stacked — reflect that most current deals are NOT pari passu)
- Cumulative dividends: rate (0–10%), simple vs. compounding, years outstanding, applied before or after the preference multiple
- Anti-dilution: full ratchet vs. broad-based weighted average (used in down-round scenarios)

**Other inputs:**
- Founder fully-diluted ownership %
- Option pool size %
- Exit price
- Transaction costs / escrow holdback %
- Management carve-out % (and whether founder is included — default NO, to teach the lesson)

**Outputs:**
- Stacked bar / step-down waterfall chart: exit proceeds flowing through each preference layer, participation, dividends, carve-outs, costs → what's left for common → founder's actual dollar figure
- Side-by-side: "What you think you get (ownership % × exit price)" vs. "What you actually get"
- **Three-scenario truth table** auto-generated: Home run (10x capital raised), Solid (2–4x), Messy (<2x) — showing how term sensitivity explodes in solid/messy exits
- Sensitivity toggles: flip participating→non-participating, 2x→1x preference, dividends on/off, and watch the founder payout change in real time. Show the dollar delta of each single term.

### 1B. Option Pool Shuffle Calculator

- Inputs: pre-round founder %, current pool %, investor-requested post-money pool %, round size, pre-money valuation
- Show dilution from pool expansion (charged to pre-money, i.e., borne by existing holders) separately from dilution from new investment
- Output: "This pool expansion costs you X points = $Y at a $Z exit, before the round even closes"
- Include the counter-question the user should ask: should pool expansion be shared with the incoming investor rather than borne solely by existing holders?

### 1C. Four Buckets Protection Audit

Interactive checklist scoring the founder's current protections across:
1. **Economic:** acceleration triggers (single/double), transaction bonus, carve-out inclusion
2. **Governance:** board composition by stage, founder consent rights, information rights, truly independent directors (no investment, no significant equity)
3. **Employment:** severance, definition of "cause," notice periods
4. **Exit:** secondary sale rights, drag-along thresholds, tag-along rights

Output: radar chart + gap list + "founders typically negotiate bucket 2 and ignore 1, 3, 4 — executives negotiate all four."

### 1D. Leverage Timeline

Visual timeline with four stages — Pre-term-sheet (max leverage) → Term sheet signed (narrowing) → Closing (commercial terms fixed) → Post-close (minimal) — with a checklist of what MUST be negotiated at each stage. Emphasize: leverage is perishable; the window is before signing.

### 1E. Founder vs. Executive Comparison

Static educational view + interactive comparison showing why a VP with 1–1.5% can out-earn a founder with 22%: carve-out pools, transaction bonuses, double-trigger acceleration, retention packages vs. common stock under a preference stack.

### 1F. Seven Disciplines Self-Assessment

Short quiz mapping the founder against seven pillars: (1) psychology & resilience, (2) brand authority & narrative control, (3) capital architecture & payout mechanics, (4) negotiation under asymmetry, (5) governance & control engineering, (6) systems for scale, (7) exit orchestration & legacy. Output a spider chart + Claude-generated coaching summary per weak pillar.

---

## Module 2: Contract Review Coach

### Flow
1. User pastes contract text or uploads PDF, selects contract type: **Term Sheet / Job Offer / Employment Agreement / M&A-Acquisition Terms / Advisor-Consulting Agreement / Other**
2. App sends document + type-specific system prompt to Claude API
3. Claude returns structured JSON (strip markdown fences before parsing); render as an interactive report

### Analysis Output (structured JSON schema)
```json
{
  "summary": "plain-English 3-sentence summary of what this contract does",
  "key_terms": [{"term": "", "clause_text": "", "plain_english": "", "market_standard": "", "assessment": "favorable|standard|unfavorable|red_flag"}],
  "red_flags": [{"issue": "", "why_it_matters": "", "dollar_impact_scenario": ""}],
  "missing_protections": ["protections absent that the user should ask for"],
  "negotiation_points": [{"point": "", "priority": "high|medium|low", "leverage_stage": "when to raise it", "alignment_framing": "exact script phrased as alignment, not demand"}],
  "questions_to_ask": ["diligence questions before signing"],
  "walk_away_signals": ["conditions under which not to sign"]
}
```

### Alignment-Framing Engine (critical feature)
Every negotiation point must include a ready-to-use script reframed from demand → alignment. Build these transformations into the system prompt with examples:
- "I want a transaction bonus" → "How do we make sure the team that gets this company to exit is still motivated at close?"
- "What protections do I get?" → "What's the standard founder protection package across your portfolio companies?"
- "I'm worried about downside" → "How do we structure this so everyone is aligned if the exit is smaller than we hope?"

### Term-Type Playbooks (system prompt knowledge per contract type)
- **Term sheets:** liquidation preference multiple & seniority, participation (flag full participation as the founder-killer), anti-dilution mechanics, cumulative dividends (flag compounding — 8% over 7 years ≈ 56%+ on the preference), pool shuffle, protective provisions, board composition, drag-along thresholds
- **Job offers / employment:** equity instrument type, vesting & acceleration (push double-trigger), severance, cause definition, transaction bonus, non-compete scope, IP assignment breadth
- **M&A terms:** escrow/holdback size and duration, indemnity caps and survival (especially IP indemnities), carve-out allocation, earnout structure and control of earnout metrics, retention packages, rep & warranty insurance
- Cross-cutting rule: always quantify — "this clause could cost you $X in a $Y exit"

### Follow-up Chat
After the report, allow conversational Q&A about the contract. Send full conversation history + original document context in each API call (Claude has no memory between calls).

---

## Module 3: Adaptive Learning Engine

The engine personalizes depth, pace, and modality. Two users must have completely different experiences: a first-time founder who has never seen a term sheet gets patient scaffolding; an experienced operator who "just needs a little help" gets terse expert-level answers with no hand-holding.

### 3A. Onboarding Calibration (2 minutes max)

On first launch, run a quick calibration — NOT a boring intake form:
1. **Self-report:** "Where are you right now?" → Never raised / Raised once / Multiple rounds / Been through an exit
2. **Diagnostic micro-quiz (5 questions, adaptive difficulty):** e.g., "An investor has a 1x participating preference on $10M invested. Company sells for $30M. Do they get $10M, $10M + a pro-rata share of $20M, or their choice of one?" Score placement, not pass/fail.
3. **Immediate stakes:** "What's in front of you right now?" → Just learning / Term sheet in hand / Job offer to review / Exit conversation happening
4. **Learning-style preference:** Read / Listen / Watch-and-interact / Test me

Output a **learner profile** stored in app state (and included in every Claude API call as context):
```json
{
  "knowledge_level": "novice|intermediate|advanced",
  "weak_areas": ["participation", "dividends", "governance"],
  "urgency": "learning|live_deal",
  "modality_preference": ["simulate", "listen", "quiz"],
  "vocabulary_unlocked": ["liquidation_preference", "pro_rata"]
}
```

### 3B. Adaptive Depth (applies everywhere in the app)

- **Novice mode:** every technical term rendered as a tappable chip → plain-English tooltip + one concrete example; analogies before mechanics; one concept per screen; dollar examples use small round numbers
- **Intermediate mode:** definitions collapsed but available; focus on interactions between terms (preference × participation × dividends)
- **Advanced mode:** skip explanations entirely; lead with market-standard benchmarks, edge cases, and negotiation counter-moves; terse output
- Users can override level per-topic ("explain this one like I'm new")
- **Progressive unlocking:** when a user correctly uses or answers questions about a concept, mark it `vocabulary_unlocked` and stop re-explaining it. The app should visibly get faster and denser as the user gets smarter — that IS the product experience.

### 3C. Teach-Back Quiz Engine

After any lesson, simulation, or contract review, offer a teach-back:
- Claude generates scenario-based questions from what the user just saw — including questions built from THE USER'S OWN numbers ("In the cap table you just built, why did adding participation cost you $2.1M?")
- **Teach-back format:** free-text answer — "Explain participating preferred to your co-founder in two sentences." Claude grades the explanation for accuracy and gaps, responds as a friendly co-founder asking one follow-up question the user's explanation didn't cover.
- Wrong answers update `weak_areas`; the engine schedules spaced repetition — resurface weak concepts as a 30-second warm-up question on the next session.

### 3D. Example Generator

"Show me another example" button available on every concept:
- Claude generates fresh worked examples calibrated to the user's industry (ask industry at onboarding — medtech, SaaS, consumer, biotech) and knowledge level
- Each example includes the trap ("spot what's wrong with this term sheet") variant for intermediate+ users
- Examples always end with the dollar consequence

### 3E. Comparison Table Generator

On-demand side-by-side tables, Claude-generated as structured JSON and rendered natively:
- Any two terms ("participating vs. non-participating vs. capped participation")
- Any two contract versions (paste v1 and v2 of a term sheet → diff table of what changed and who it favors, with dollar impact per change — this is a killer feature during live negotiations)
- Founder package vs. typical executive package
- Columns adapt to level: novice gets "what it means for you"; advanced gets "market prevalence" and "counter-ask"

### 3F. Negotiation Roleplay Simulator

The highest-value adaptive feature. Claude plays the counterparty:
- Modes: VC partner pushing a term sheet / acquirer's corp-dev lead / hiring manager on a job offer / board member in a comp discussion
- Counterparty difficulty scales with user level: novice gets a patient investor; advanced gets a repeat player who anchors hard, uses time pressure, and punishes demand-framing
- After each user message, optional "coach whisper" sidebar: what just happened tactically, what the alignment-framed response would be
- End-of-session debrief: what the user conceded without realizing, which framings triggered defensiveness vs. collaboration, graded against the alignment-framing playbook
- Uses the user's real scenario (their actual cap table / uploaded contract) when in live-deal mode

### 3G. Audio Briefing Generator (podcast-style)

For "listen" learners and commute-time prep:
- Claude generates a two-host dialogue script (curious founder + experienced operator) covering: a chosen concept, the user's contract review results, or their waterfall scenario — personalized, using their numbers
- v1: render with two distinct Web Speech API voices, playable in-app with a script transcript below
- Upgrade path (v2): server-side TTS (e.g., ElevenLabs) for NotebookLM-grade quality and downloadable MP3
- Preset lengths: 3-min primer / 10-min deep dive / 5-min "night before the negotiation" briefing

### 3H. Visual Explainer Generator (in place of video generation)

True video generation is not feasible or necessary in a client-side web app. Instead, build **animated interactive explainers** that deliver the same value:
- Claude generates a scene-by-scene "storyboard" JSON (narration text + which visualization state to show)
- The app plays it back: waterfall bars filling step by step, dilution shrinking the founder's slice round by round, synchronized with narration text (and audio via 3G)
- User can pause any scene and manipulate the numbers mid-explainer — something video can't do
- If the user explicitly wants exportable video later, v2 can render these storyboards to MP4 server-side; do not attempt in v1

### 3I. Cadence & Session Design

- **Live-deal mode:** urgency-first. Skip curriculum; jump straight to their document/scenario; surface only what matters for the decision in front of them; offer the roleplay simulator and night-before audio briefing
- **Learning mode:** structured path through the core curriculum (waterfall → four key terms → pool shuffle → four buckets → leverage timeline → negotiation framing), each unit ending with a teach-back
- Session length presets: 5 / 15 / 30 minutes — the engine sizes content to fit
- Streak-free by design: no guilt mechanics; a founder mid-raise doesn't need gamification pressure, they need answers

---

## System Prompt (core coach persona — use for both modules)

"You are a founder-side deal coach with the pattern recognition of a repeat player: an investor who has seen 50 deals and a lawyer who has seen 500. Your job is to close the knowledge asymmetry for a one-time player. You are direct, quantitative, and calm. You never frame the other side as evil — they are repeat players optimizing their portfolio; this is the game. For every risk you identify: (1) explain the mechanism in plain English, (2) quantify the dollar impact with a concrete exit scenario, (3) give the negotiation move, (4) give exact alignment-framed language to use, (5) state when in the deal timeline the leverage exists. Always distinguish ownership percentage from payout percentage.

ADAPT TO THE LEARNER PROFILE provided in context: for novices, define every term at first use, one concept at a time, analogies first; for intermediates, focus on how terms interact; for advanced users, be terse — lead with benchmarks and counter-moves, skip definitions. Never re-explain concepts listed in vocabulary_unlocked. If urgency is live_deal, answer the decision in front of them first and teach second.

Your role is to prepare the founder for conversations with their legal team, board, and counterparties — not to replace representation. End serious analyses with a reminder that a founder-side attorney should review before signing."

---

## UI/UX Requirements

- Mobile-first responsive design
- Landing page hook: "You own 22%. Here's how you walk away with $0." → live mini-waterfall demo, no signup
- Dark, financial-grade aesthetic; every dollar figure animated on recalculation
- Export: waterfall results and contract reports to PDF ("bring this to your lawyer / board conversation")
- Never use `<form>` tags; use onClick/onChange handlers
- No localStorage/sessionStorage — React state only, with explicit JSON export/import for saving scenarios

## Build Order (v1 scope discipline)
1. Waterfall simulator (works standalone, no AI — pure math, instantly shareable)
2. Onboarding calibration + learner profile (cheap to build, makes everything downstream adaptive)
3. Contract Review Coach with adaptive depth (the AI differentiator)
4. Teach-back quiz engine + example generator + comparison tables (all reuse the same Claude call pattern)
5. Negotiation roleplay simulator
6. Option pool calculator + four buckets audit + leverage timeline
7. Audio briefings (Web Speech API version) + animated explainers

## Out of Scope for v1
Accounts, payments, saved document history, multi-user collaboration, jurisdiction-specific legal rules, true video generation, server-side TTS (both are documented v2 upgrade paths).
