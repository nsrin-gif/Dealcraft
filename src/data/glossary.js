export const GLOSSARY = {
  'liquidation-preference': {
    term: 'Liquidation Preference',
    def: 'The multiple of their investment an investor is guaranteed to get back before common stockholders (including founders) get anything.',
    example: 'A 1x preference on $10M means that investor gets the first $10M of exit proceeds, no matter what the exit price is.',
  },
  participating: {
    term: 'Participating Preferred',
    def: "After taking their liquidation preference off the top, participating investors ALSO share pro-rata in whatever's left — a double dip.",
    example: 'On a $30M exit, a $10M 1x participating investor with 40% ownership gets $10M + 40% of the remaining $20M = $18M total.',
  },
  'non-participating': {
    term: 'Non-Participating Preferred',
    def: 'The investor takes the greater of (a) their fixed preference, or (b) converting to common and taking their pro-rata ownership share. Not both.',
    example: 'At a big exit, non-participating investors usually convert to common because their ownership % is worth more than their fixed preference.',
  },
  'pari-passu': {
    term: 'Pari Passu',
    def: 'Latin for "equal footing" — all preferred series get paid at the same time, pro-rata, if there is not enough to cover every claim in full.',
    example: 'If Seed and Series A are pari passu and there is only enough for 50% of claims, both get exactly 50% of what they are owed.',
  },
  stacked: {
    term: 'Stacked / Senior Preference',
    def: 'The default in most modern deals: later rounds get paid before earlier rounds. Series B is senior to Series A, which is senior to Seed.',
    example: 'In a down exit, Series B collects its full preference first; Seed and Series A may get little or nothing left over.',
  },
  dividends: {
    term: 'Cumulative Dividends',
    def: 'A guaranteed return that accrues on the preferred investment over time, paid out on top of the liquidation preference.',
    example: 'An 8% compounding dividend over 7 years adds roughly 56%+ to the original preference amount — a huge, easy-to-miss number.',
  },
  'anti-dilution': {
    term: 'Anti-Dilution Protection',
    def: "Protects investors' ownership % if a future round prices below this one (a 'down round'). Full ratchet is far more punitive to founders than broad-based weighted average.",
    example: 'Full ratchet can reset an investor\'s conversion price to the new, lower round price — sharply increasing their share count at the expense of common.',
  },
  'option-pool': {
    term: 'Option Pool',
    def: "Shares reserved for future employee equity grants. It dilutes existing holders and is almost always carved out of the founder's side of the cap table before a new round.",
    example: 'A 12% option pool means 12% of the fully-diluted company is set aside for employees — it is not part of the founder or investor stake.',
  },
  'carve-out': {
    term: 'Management Carve-Out',
    def: 'A pool of exit proceeds set aside for management/key employees, taken off the top before the preference stack — common in messy exits where common stock is worth little.',
    example: 'Founders are often NOT included in the carve-out by default, even though they built the company — worth confirming explicitly.',
  },
};
