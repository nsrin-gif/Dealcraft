export const CONTEXTS = {
  fundraising: 'Term Sheet / Fundraising',
  exit: 'Exit / M&A',
  employment: 'Job Offer / Comp',
  fnf: 'Friends & Family / Sweat Equity',
};

export const GLOSSARY = {
  'liquidation-preference': {
    term: 'Liquidation Preference',
    def: 'The multiple of their investment an investor is guaranteed to get back before common stockholders (including founders) get anything.',
    example: 'A 1x preference on $5M means that investor collects the first $5M of exit proceeds before any common shareholder sees a dollar.',
    contexts: {
      fundraising: 'This is one of the first numbers to negotiate on a term sheet. 1x is standard; anything above 1x should raise questions about why the investor needs extra downside protection.',
      exit: "This is the mechanic that runs first in any exit waterfall — every preferred round's claim gets paid before common stock sees anything.",
      employment: "If you're joining as an employee with options, the preference stack ahead of you determines how much has to be paid out before your common shares are worth anything at all.",
    },
  },
  participating: {
    term: 'Participating Preferred',
    def: "After taking their liquidation preference off the top, participating investors ALSO share pro-rata in whatever's left — a double dip.",
    example: 'On a $40M exit, a $12M 1x participating investor holding 30% ownership gets $12M + 30% of the remaining $28M = $20.4M total.',
    contexts: {
      fundraising: 'Full participation is often called the "founder killer" clause — it is one of the highest-leverage terms to push back on before signing, especially uncapped.',
      exit: 'This is the term that most explains why founder payout can look nothing like ownership percentage, especially in a "solid but not huge" exit.',
      employment: "If your equity is common stock, participating preferred ahead of you shrinks what's left for you even in a decent-sized exit — worth understanding before you value an offer.",
    },
  },
  'non-participating': {
    term: 'Non-Participating Preferred',
    def: 'The investor takes the greater of (a) their fixed preference, or (b) converting to common and taking their pro-rata ownership share. Not both.',
    example: 'At a large enough exit, non-participating investors usually convert to common because their ownership % is worth more than their fixed preference.',
    contexts: {
      fundraising: 'This is the founder-favorable default to push for — it caps what an investor can extract to whichever is larger of their preference or their ownership share, never both.',
      exit: 'This is why founder outcomes in a home-run exit often track ownership percentage closely, while messy exits still hurt — the investor takes the preference when it is worth more than converting.',
    },
  },
  'as-converted': {
    term: 'As-Converted',
    def: 'What a share of preferred stock would be worth if it were treated as an ordinary common share instead of exercising its liquidation preference.',
    example: "Comparing a series' as-converted value against its fixed preference is exactly how a non-participating investor decides which one to take.",
    contexts: {
      fundraising: "Ask what your as-converted ownership percentage is, not just your nominal ownership — it's the number that actually matters in most exit math.",
      exit: 'The waterfall runs this comparison for every non-participating series automatically: convert to common, or take the fixed preference — whichever pays more.',
    },
  },
  'pari-passu': {
    term: 'Pari Passu',
    def: 'Latin for "equal footing" — all preferred series get paid at the same time, pro-rata, if there is not enough to cover every claim in full.',
    example: 'If Seed and Series A are pari passu and there is only enough proceeds to cover 60% of claims, both get exactly 60% of what they are owed.',
    contexts: {
      fundraising: "Rare in current deals — most investors negotiate seniority instead. If a term sheet does offer pari passu, it's usually a mark in the founder's favor relative to the stacked default.",
      exit: 'Only matters in a shortfall scenario — if proceeds cover every series in full, pari passu vs. stacked makes no difference to anyone.',
    },
  },
  stacked: {
    term: 'Stacked / Senior Preference',
    def: 'The default in most modern deals: later rounds get paid before earlier rounds. Series B is senior to Series A, which is senior to Seed.',
    example: 'In a low exit, Series B collects its full preference first; Seed and Series A may split whatever is left over, or get nothing.',
    contexts: {
      fundraising: 'Assume this is the structure you are being offered unless the term sheet explicitly says pari passu — it is the market default, not the exception.',
      exit: 'This is why a "solid" exit can still leave earlier investors and the founder with very little: the newest, largest round eats first.',
    },
  },
  seniority: {
    term: 'Seniority',
    def: "The order in which preferred series get paid out of exit proceeds — determines who's first in line before anyone else sees money.",
    example: "Seniority only matters when proceeds fall short of covering every series' preference in full; in a big exit, everyone gets paid regardless of order.",
    contexts: {
      fundraising: 'A later round demanding explicit seniority over your existing investors is a signal worth flagging to your board — it changes the risk profile for everyone already on the cap table.',
      exit: 'Only bites in a messy or moderate exit — this is exactly the scenario the "Messy" row in a truth table is built to expose.',
    },
  },
  dividends: {
    term: 'Cumulative Dividends',
    def: 'A guaranteed return that accrues on the preferred investment over time, paid out on top of the liquidation preference.',
    example: 'A 6% compounding dividend over 5 years adds about 34% to the original preference amount — easy to overlook, expensive to ignore.',
    contexts: {
      fundraising: 'Compounding dividends over a multi-year hold can meaningfully inflate a preference claim well past the headline multiple — model the actual years-to-exit before agreeing to a rate.',
      exit: "This adds to the preference claim before anyone else gets paid — a term that's easy to skim past on a term sheet but shows up as real dollars at exit.",
    },
  },
  'anti-dilution': {
    term: 'Anti-Dilution Protection',
    def: "Protects investors' ownership % if a future round prices below this one (a 'down round'). Full ratchet is far more punitive to founders than broad-based weighted average.",
    example: "Full ratchet can reset an investor's conversion price to match the new, lower round price — sharply increasing their share count at common's expense.",
    contexts: {
      fundraising: 'Broad-based weighted average is the market standard; full ratchet is aggressive and usually only accepted under real leverage imbalance — worth asking why if it is proposed.',
      exit: 'Only triggers if a future round prices below this one — irrelevant if you never raise a down round, painful for common stock if you do.',
    },
  },
  'option-pool': {
    term: 'Option Pool',
    def: "Shares reserved for future employee equity grants. It dilutes existing holders and is almost always carved out of the founder's side of the cap table before a new round.",
    example: 'A 10% option pool means 10% of the fully-diluted company is set aside for employees — it is not part of the founder or investor stake.',
    contexts: {
      fundraising: 'Ask whether the pool expansion is being taken from pre-money (you and existing holders bear it alone) or shared with the incoming investor — this is a real, negotiable point.',
      employment: "As a candidate, your equity grant comes out of this pool. Ask how large the pool is and how much has already been granted — a 10% offer sounds different in a fresh pool vs. a nearly-exhausted one.",
      exit: 'The pool participates in the exit distribution like common stock, so it dilutes the founder\'s share of proceeds just as much as it dilutes ownership on paper.',
    },
  },
  'carve-out': {
    term: 'Management Carve-Out',
    def: 'A pool of exit proceeds set aside for management/key employees, taken off the top before the preference stack — common in messy exits where common stock is worth little.',
    example: 'Founders are often NOT included in the carve-out by default, even though they built the company — worth confirming explicitly.',
    contexts: {
      exit: 'This is specifically designed for scenarios where the preference stack wipes out common stock — it exists to keep key people motivated to close a deal that otherwise pays them nothing.',
      employment: 'If you are being recruited into a leadership role at a company already loaded with preference, ask directly whether a carve-out exists and whether your role is included — this can matter more than your equity grant.',
    },
  },
  'fully-diluted': {
    term: 'Fully-Diluted Ownership',
    def: 'Your ownership percentage counting every share that could exist — issued shares, the entire option pool, and anything preferred holders could convert into.',
    example: 'A founder holding 4M shares out of 10M fully-diluted shares owns 40%, even if only 7M shares have actually been issued so far.',
    contexts: {
      fundraising: 'Always ask whether a quoted ownership percentage is fully-diluted or not — an "un-diluted" number that ignores the option pool and outstanding preferred is misleadingly high.',
      employment: 'A job offer stating "0.5% equity" only means something if you know whether that is fully-diluted — ask, since companies sometimes quote the more flattering non-diluted figure.',
      exit: 'This is the denominator the entire waterfall runs on — every payout calculation in this tool assumes the ownership percentages you enter are fully diluted.',
    },
  },
  'cap-table': {
    term: 'Cap Table',
    def: "A ledger of who owns what: every shareholder, option holder, and preferred series, and what percentage of the company each represents.",
    example: 'A clean cap table shows founders, the option pool, and each financing round as separate rows that sum to 100% fully diluted.',
    contexts: {
      fundraising: "Ask to see the actual cap table, not just a summary — it is the only way to verify the ownership percentages a term sheet's economics are being quoted against.",
      fnf: 'A friends-and-family round still needs a real cap table from day one, even if it is informal — it is much easier to keep one accurate from the start than to reconstruct it later.',
    },
  },
  bootstrapped: {
    term: 'Bootstrapped',
    def: 'Funded entirely from founder savings, revenue, or informal contributions — no institutional or priced financing round has happened yet.',
    example: 'A bootstrapped company has no liquidation preference stack at all: an exit splits proceeds by ownership % alone.',
    contexts: {
      fundraising: 'Staying bootstrapped as long as possible is itself a negotiating position — every month of runway you don\'t need outside capital for is leverage in the eventual term sheet conversation.',
      fnf: 'Most bootstrapped companies still take some outside money eventually — usually from friends and family first, which is exactly the scenario the Slicing Pie calculator is built for.',
    },
  },
  'pre-seed': {
    term: 'Pre-Seed',
    def: "The earliest formal round, often before there's a product or real revenue — typically a small check from angels or friends and family.",
    example: 'Pre-seed terms are usually simple: a modest amount, 1x non-participating preference, no dividends, no anti-dilution complexity.',
    contexts: {
      fundraising: 'Simple, founder-favorable terms are the norm at pre-seed — a pre-seed investor pushing for aggressive terms (high multiples, participation, dividends) is worth a second look.',
    },
  },
  'sweat-equity': {
    term: 'Sweat Equity',
    def: 'Ownership earned through unpaid or below-market labor instead of cash — the value of time and effort someone puts in rather than money.',
    example: 'A co-founder working full-time for no salary is contributing sweat equity worth their fair-market rate for every hour worked.',
    contexts: {
      fnf: 'This is the core problem the Slicing Pie calculator solves: putting sweat equity and cash on the same defensible scale instead of guessing a split.',
      employment: 'Accepting below-market salary in exchange for equity is a sweat-equity trade — know your fair-market rate so you can evaluate whether the equity offered actually compensates for the gap.',
    },
  },
  slice: {
    term: 'Slice',
    def: 'The common unit the Slicing Pie model converts every contribution into — fair market value × a risk multiplier — so cash and sweat equity can be compared on one scale.',
    example: 'Someone who contributes $10,000 in fair-market-value slices out of 100,000 total slices owns 10% under this model.',
    contexts: {
      fnf: "Slices are the whole mechanism — every contributor's ownership percentage is just their slices divided by the total.",
    },
  },
  multiplier: {
    term: 'Risk Multiplier',
    def: 'A factor applied to a contribution\'s fair market value to reflect how risky or scarce that type of contribution is — cash is scarcer and riskier to give up than time, so it typically carries a higher multiplier.',
    example: 'The Slicing Pie model\'s defaults are 4x for cash and 2x for time: a $10,000 cash check is worth the same slices as $20,000 of fair-market-value unpaid labor.',
    contexts: {
      fnf: 'These are negotiable within your group, not fixed by law — agree on them explicitly and in writing before contributions start piling up, not after a disagreement.',
    },
  },
  'grunt-fund': {
    term: 'Grunt Fund / Deferred Income',
    def: 'The running tally of unpaid fair-market value someone has contributed by working for less than they could earn elsewhere — effectively income converted into equity.',
    example: 'Someone who could earn $80/hour but takes no salary for 500 hours has $40,000 sitting in the grunt fund, even though no cash changed hands.',
    contexts: {
      fnf: 'Tracking this number keeps a founding team honest about who has actually put in what, especially once the company starts generating cash and the question of back-pay comes up.',
      employment: 'If you are ever offered "equity now, market salary later," the gap between what you are paid and what you are worth in the meantime is effectively this same concept — informal, uncompensated deferred income.',
    },
  },
  'fair-market-value': {
    term: 'Fair Market Value (FMV)',
    def: "What a contribution would cost at arm's length — a cash amount at face value, or time valued at the contributor's normal market rate.",
    example: "A developer who'd normally charge $100/hour contributing 200 unpaid hours has an FMV contribution of $20,000, before any risk multiplier is applied.",
    contexts: {
      fnf: 'Agree on each contributor\'s fair-market hourly rate up front, ideally by referencing what they\'d actually charge or earn elsewhere — this is the number the whole split depends on, so vague or inflated rates undermine the fairness of the result.',
      employment: 'Knowing your own fair-market rate is the baseline for evaluating any offer that includes below-market pay plus equity — without it you can\'t tell if the trade is fair.',
    },
  },
};
