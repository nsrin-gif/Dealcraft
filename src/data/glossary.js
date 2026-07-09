export const GLOSSARY = {
  'liquidation-preference': {
    term: 'Liquidation Preference',
    def: 'The multiple of their investment an investor is guaranteed to get back before common stockholders (including founders) get anything.',
    example: 'A 1x preference on $5M means that investor collects the first $5M of exit proceeds before any common shareholder sees a dollar.',
  },
  participating: {
    term: 'Participating Preferred',
    def: "After taking their liquidation preference off the top, participating investors ALSO share pro-rata in whatever's left — a double dip.",
    example: 'On a $40M exit, a $12M 1x participating investor holding 30% ownership gets $12M + 30% of the remaining $28M = $20.4M total.',
  },
  'non-participating': {
    term: 'Non-Participating Preferred',
    def: 'The investor takes the greater of (a) their fixed preference, or (b) converting to common and taking their pro-rata ownership share. Not both.',
    example: 'At a large enough exit, non-participating investors usually convert to common because their ownership % is worth more than their fixed preference.',
  },
  'as-converted': {
    term: 'As-Converted',
    def: 'What a share of preferred stock would be worth if it were treated as an ordinary common share instead of exercising its liquidation preference.',
    example: "Comparing a series' as-converted value against its fixed preference is exactly how a non-participating investor decides which one to take.",
  },
  'pari-passu': {
    term: 'Pari Passu',
    def: 'Latin for "equal footing" — all preferred series get paid at the same time, pro-rata, if there is not enough to cover every claim in full.',
    example: 'If Seed and Series A are pari passu and there is only enough proceeds to cover 60% of claims, both get exactly 60% of what they are owed.',
  },
  stacked: {
    term: 'Stacked / Senior Preference',
    def: 'The default in most modern deals: later rounds get paid before earlier rounds. Series B is senior to Series A, which is senior to Seed.',
    example: 'In a low exit, Series B collects its full preference first; Seed and Series A may split whatever is left over, or get nothing.',
  },
  seniority: {
    term: 'Seniority',
    def: "The order in which preferred series get paid out of exit proceeds — determines who's first in line before anyone else sees money.",
    example: "Seniority only matters when proceeds fall short of covering every series' preference in full; in a big exit, everyone gets paid regardless of order.",
  },
  dividends: {
    term: 'Cumulative Dividends',
    def: 'A guaranteed return that accrues on the preferred investment over time, paid out on top of the liquidation preference.',
    example: 'A 6% compounding dividend over 5 years adds about 34% to the original preference amount — easy to overlook, expensive to ignore.',
  },
  'anti-dilution': {
    term: 'Anti-Dilution Protection',
    def: "Protects investors' ownership % if a future round prices below this one (a 'down round'). Full ratchet is far more punitive to founders than broad-based weighted average.",
    example: "Full ratchet can reset an investor's conversion price to match the new, lower round price — sharply increasing their share count at common's expense.",
  },
  'option-pool': {
    term: 'Option Pool',
    def: "Shares reserved for future employee equity grants. It dilutes existing holders and is almost always carved out of the founder's side of the cap table before a new round.",
    example: 'A 10% option pool means 10% of the fully-diluted company is set aside for employees — it is not part of the founder or investor stake.',
  },
  'carve-out': {
    term: 'Management Carve-Out',
    def: 'A pool of exit proceeds set aside for management/key employees, taken off the top before the preference stack — common in messy exits where common stock is worth little.',
    example: 'Founders are often NOT included in the carve-out by default, even though they built the company — worth confirming explicitly.',
  },
  'fully-diluted': {
    term: 'Fully-Diluted Ownership',
    def: 'Your ownership percentage counting every share that could exist — issued shares, the entire option pool, and anything preferred holders could convert into.',
    example: 'A founder holding 4M shares out of 10M fully-diluted shares owns 40%, even if only 7M shares have actually been issued so far.',
  },
  'cap-table': {
    term: 'Cap Table',
    def: "A ledger of who owns what: every shareholder, option holder, and preferred series, and what percentage of the company each represents.",
    example: 'A clean cap table shows founders, the option pool, and each financing round as separate rows that sum to 100% fully diluted.',
  },
  bootstrapped: {
    term: 'Bootstrapped',
    def: 'Funded entirely from founder savings, revenue, or informal contributions — no institutional or priced financing round has happened yet.',
    example: 'A bootstrapped company has no liquidation preference stack at all: an exit splits proceeds by ownership % alone.',
  },
  'pre-seed': {
    term: 'Pre-Seed',
    def: "The earliest formal round, often before there's a product or real revenue — typically a small check from angels or friends and family.",
    example: 'Pre-seed terms are usually simple: a modest amount, 1x non-participating preference, no dividends, no anti-dilution complexity.',
  },
  'sweat-equity': {
    term: 'Sweat Equity',
    def: 'Ownership earned through unpaid or below-market labor instead of cash — the value of time and effort someone puts in rather than money.',
    example: 'A co-founder working full-time for no salary is contributing sweat equity worth their fair-market rate for every hour worked.',
  },
  slice: {
    term: 'Slice',
    def: 'The common unit the Slicing Pie model converts every contribution into — fair market value × a risk multiplier — so cash and sweat equity can be compared on one scale.',
    example: 'Someone who contributes $10,000 in fair-market-value slices out of 100,000 total slices owns 10% under this model.',
  },
  multiplier: {
    term: 'Risk Multiplier',
    def: 'A factor applied to a contribution\'s fair market value to reflect how risky or scarce that type of contribution is — cash is scarcer and riskier to give up than time, so it typically carries a higher multiplier.',
    example: 'The Slicing Pie model\'s defaults are 4x for cash and 2x for time: a $10,000 cash check is worth the same slices as $20,000 of fair-market-value unpaid labor.',
  },
  'grunt-fund': {
    term: 'Grunt Fund / Deferred Income',
    def: 'The running tally of unpaid fair-market value someone has contributed by working for less than they could earn elsewhere — effectively income converted into equity.',
    example: 'Someone who could earn $80/hour but takes no salary for 500 hours has $40,000 sitting in the grunt fund, even though no cash changed hands.',
  },
  'fair-market-value': {
    term: 'Fair Market Value (FMV)',
    def: "What a contribution would cost at arm's length — a cash amount at face value, or time valued at the contributor's normal market rate.",
    example: "A developer who'd normally charge $100/hour contributing 200 unpaid hours has an FMV contribution of $20,000, before any risk multiplier is applied.",
  },
};
