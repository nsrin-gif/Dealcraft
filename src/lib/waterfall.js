// Core exit-waterfall math engine. Pure functions, no React/DOM deps, so it can be
// unit-tested and reused by the sensitivity lab / truth table without re-render cost.

export const PARTICIPATION = {
  NON_PARTICIPATING: 'non-participating',
  PARTICIPATING_CAPPED: 'participating-capped',
  PARTICIPATING_UNCAPPED: 'participating-uncapped',
};

export const SENIORITY = {
  STACKED: 'stacked',
  PARI_PASSU: 'pari-passu',
};

export const ANTI_DILUTION = {
  NONE: 'none',
  FULL_RATCHET: 'full-ratchet',
  BROAD_BASED_WA: 'broad-based-wa',
};

export function makeRound(overrides = {}) {
  return {
    id: overrides.id ?? crypto.randomUUID(),
    name: 'Seed',
    amountRaised: 2_000_000,
    prefMultiple: 1,
    participation: PARTICIPATION.NON_PARTICIPATING,
    participationCapMultiple: 3,
    dividendsEnabled: false,
    dividendRatePct: 8,
    dividendType: 'compounding', // 'simple' | 'compounding'
    dividendTiming: 'after', // 'before' | 'after' the pref multiple
    dividendYears: 4,
    antiDilution: ANTI_DILUTION.NONE,
    ownershipPctOverride: null, // null => derive proportionally from capital raised
    ...overrides,
  };
}

function accruedDividends(round) {
  if (!round.dividendsEnabled) return 0;
  const rate = (round.dividendRatePct || 0) / 100;
  const years = round.dividendYears || 0;
  if (rate <= 0 || years <= 0) return 0;
  return round.dividendType === 'compounding'
    ? round.amountRaised * (Math.pow(1 + rate, years) - 1)
    : round.amountRaised * rate * years;
}

/** The fixed-dollar liquidation preference claim, before any participation. */
function preferenceClaim(round) {
  const div = accruedDividends(round);
  if (round.dividendTiming === 'before') {
    return (round.amountRaised + div) * round.prefMultiple;
  }
  return round.amountRaised * round.prefMultiple + div;
}

/**
 * Derives each round's fully-diluted ownership %. If the user supplied an explicit
 * override (they know their real cap table), use it. Otherwise split the investor
 * pool (100% - founder% - option pool%) proportionally by capital raised — a
 * standard simplifying assumption for a proceeds-based calculator that doesn't
 * track per-round share price.
 */
export function deriveOwnership(rounds, founderPct, poolPct) {
  const investorPoolPct = Math.max(0, 100 - founderPct - poolPct);
  const totalRaised = rounds.reduce((sum, r) => sum + (r.amountRaised || 0), 0);
  const overridden = rounds.filter((r) => r.ownershipPctOverride != null);
  const overriddenPct = overridden.reduce((sum, r) => sum + r.ownershipPctOverride, 0);
  const remainingPct = Math.max(0, investorPoolPct - overriddenPct);
  const nonOverridden = rounds.filter((r) => r.ownershipPctOverride == null);
  const nonOverriddenRaised = nonOverridden.reduce((sum, r) => sum + (r.amountRaised || 0), 0);

  const map = new Map();
  for (const r of rounds) {
    if (r.ownershipPctOverride != null) {
      map.set(r.id, r.ownershipPctOverride);
    } else if (nonOverriddenRaised > 0) {
      map.set(r.id, (r.amountRaised / nonOverriddenRaised) * remainingPct);
    } else {
      map.set(r.id, 0);
    }
  }
  return { ownershipById: map, investorPoolPct, totalRaised };
}

/**
 * Runs the full exit waterfall for a single exit price.
 * Returns per-round payouts, founder payout, pool payout, and diagnostic detail
 * for the chart/step-down visualization.
 */
export function runWaterfall(inputs) {
  const {
    rounds,
    founderPct,
    poolPct,
    exitPrice,
    txCostsPct = 0,
    carveOutPct = 0,
    founderInCarveOut = false,
    founderCarveOutSharePct = 0,
    seniorityMode = SENIORITY.STACKED,
  } = inputs;

  const grossProceeds = Math.max(0, exitPrice || 0);
  const txCosts = grossProceeds * ((txCostsPct || 0) / 100);
  const carveOut = grossProceeds * ((carveOutPct || 0) / 100);
  const netProceeds = Math.max(0, grossProceeds - txCosts - carveOut);

  const { ownershipById } = deriveOwnership(rounds, founderPct, poolPct);

  // Step 1: decide each round's election — take the fixed preference, or convert
  // to common and take its as-converted pro-rata share instead. Non-participating
  // preferred always takes the greater of the two. Capped participating preferred
  // converts only if its as-converted value would exceed its capped total.
  const decided = rounds.map((r, roundIndex) => {
    const ownershipPct = ownershipById.get(r.id) || 0;
    const claim = preferenceClaim(r);
    const asConvertedValue = (ownershipPct / 100) * netProceeds;

    if (r.participation === PARTICIPATION.NON_PARTICIPATING) {
      const converts = asConvertedValue > claim;
      return { round: r, roundIndex, ownershipPct, claim, asConvertedValue, converts, capped: false };
    }

    if (r.participation === PARTICIPATION.PARTICIPATING_CAPPED) {
      const cappedTotal = r.amountRaised * (r.participationCapMultiple || 1);
      const converts = asConvertedValue > cappedTotal;
      return { round: r, roundIndex, ownershipPct, claim, asConvertedValue, converts, capped: true, cappedTotal };
    }

    // participating-uncapped always takes preference + full participation
    return { round: r, roundIndex, ownershipPct, claim, asConvertedValue, converts: false, capped: false };
  });

  const preferredPayees = decided.filter((d) => !d.converts);
  const convertedRounds = decided.filter((d) => d.converts);

  // Step 2: pay preference claims in seniority order out of netProceeds.
  let remaining = netProceeds;
  const orderedTiers =
    seniorityMode === SENIORITY.STACKED
      ? [...preferredPayees].sort((a, b) => b.roundIndex - a.roundIndex) // later rounds = senior = paid first
      : preferredPayees.map((d) => ({ ...d, tier: 0 }));

  const tierGroups = new Map();
  for (const d of orderedTiers) {
    const key = seniorityMode === SENIORITY.STACKED ? d.round.id : 'pari-passu';
    if (seniorityMode === SENIORITY.STACKED) {
      tierGroups.set(key, [d]);
    } else {
      if (!tierGroups.has(key)) tierGroups.set(key, []);
      tierGroups.get(key).push(d);
    }
  }

  const prefPaid = new Map();
  for (const group of tierGroups.values()) {
    const tierClaim = group.reduce((s, d) => s + d.claim, 0);
    if (tierClaim <= 0) continue;
    const payable = Math.min(tierClaim, remaining);
    for (const d of group) {
      const share = tierClaim > 0 ? (d.claim / tierClaim) * payable : 0;
      prefPaid.set(d.round.id, share);
    }
    remaining -= payable;
  }

  // Step 3: participating preferred also joins the common pool below, alongside
  // converted rounds, the founder, and the option pool. Weight by fully-diluted
  // ownership %, renormalized among only those still eligible (since converted-out
  // or preference-only rounds already got their money above).
  const commonRecipients = [
    { id: 'founder', label: 'Founder', weight: founderPct, kind: 'founder' },
    { id: 'pool', label: 'Option Pool', weight: poolPct, kind: 'pool' },
    ...convertedRounds.map((d) => ({ id: d.round.id, label: d.round.name, weight: d.ownershipPct, kind: 'converted' })),
    ...preferredPayees
      .filter((d) => d.round.participation !== PARTICIPATION.NON_PARTICIPATING)
      .map((d) => ({ id: d.round.id, label: d.round.name, weight: d.ownershipPct, kind: 'participating', cap: d.capped ? d.cappedTotal - (prefPaid.get(d.round.id) || 0) : null })),
  ].filter((r) => r.weight > 0);

  const commonPaid = new Map();
  let poolForCommon = remaining;

  // Two-pass allocation: cap any capped-participating recipients, then reallocate
  // the excess proportionally among uncapped recipients.
  const capped = commonRecipients.filter((r) => r.cap != null);
  const uncapped = commonRecipients.filter((r) => r.cap == null);
  const totalWeight = commonRecipients.reduce((s, r) => s + r.weight, 0);

  if (totalWeight > 0 && poolForCommon > 0) {
    let excess = 0;
    for (const r of capped) {
      const uncappedShare = (r.weight / totalWeight) * poolForCommon;
      const capAmount = Math.max(0, r.cap);
      const paid = Math.min(uncappedShare, capAmount);
      commonPaid.set(r.id, paid);
      excess += uncappedShare - paid;
    }
    const uncappedWeight = uncapped.reduce((s, r) => s + r.weight, 0);
    for (const r of uncapped) {
      const baseShare = totalWeight > 0 ? (r.weight / totalWeight) * poolForCommon : 0;
      const reallocShare = uncappedWeight > 0 ? (r.weight / uncappedWeight) * excess : 0;
      commonPaid.set(r.id, baseShare + reallocShare);
    }
  }

  const founderPayout = commonPaid.get('founder') || 0;
  const poolPayout = commonPaid.get('pool') || 0;

  const founderCarveOut = founderInCarveOut ? carveOut * ((founderCarveOutSharePct || 0) / 100) : 0;

  const roundResults = rounds.map((r) => {
    const d = decided.find((x) => x.round.id === r.id);
    const prefAmount = prefPaid.get(r.id) || 0;
    const commonAmount = commonPaid.get(r.id) || 0;
    return {
      id: r.id,
      name: r.name,
      converted: d.converts,
      ownershipPct: d.ownershipPct,
      claim: d.claim,
      prefAmount,
      participationAmount: commonAmount,
      total: prefAmount + commonAmount,
    };
  });

  const totalPreferredPaid = [...prefPaid.values()].reduce((s, v) => s + v, 0);
  const totalCommonPaid = [...commonPaid.values()].reduce((s, v) => s + v, 0);

  return {
    grossProceeds,
    txCosts,
    carveOut,
    founderCarveOut,
    netProceeds,
    totalPreferredPaid,
    totalCommonPaid,
    remainingUnallocated: Math.max(0, netProceeds - totalPreferredPaid - totalCommonPaid),
    founderPayout: founderPayout + founderCarveOut,
    founderPayoutFromCommon: founderPayout,
    poolPayout,
    roundResults,
    naiveExpectation: (founderPct / 100) * grossProceeds,
  };
}

export function totalCapitalRaised(rounds) {
  return rounds.reduce((sum, r) => sum + (r.amountRaised || 0), 0);
}

export function buildTruthTable(inputs) {
  const raised = totalCapitalRaised(inputs.rounds);
  // With no capital raised (bootstrapped), "multiple of capital raised" is undefined —
  // fall back to an anchor derived from the entered exit price, keeping the same
  // relative spread (10x / 3x / 1.5x) so the three scenarios still fan out sensibly.
  const bootstrapped = raised <= 0;
  const anchor = bootstrapped ? Math.max(inputs.exitPrice || 0, 1) / 3 : raised;
  const scenarios = bootstrapped
    ? [
        { key: 'homeRun', label: 'Home Run', multiple: 10, blurb: 'high-multiple exit' },
        { key: 'solid', label: 'Solid', multiple: 3, blurb: 'exit near your entered price' },
        { key: 'messy', label: 'Messy', multiple: 1.5, blurb: 'soft exit' },
      ]
    : [
        { key: 'homeRun', label: 'Home Run', multiple: 10, blurb: '10x capital raised' },
        { key: 'solid', label: 'Solid', multiple: 3, blurb: '~3x capital raised (2–4x range)' },
        { key: 'messy', label: 'Messy', multiple: 1.5, blurb: '<2x capital raised' },
      ];
  return scenarios.map((s) => {
    const exitPrice = anchor * s.multiple;
    const result = runWaterfall({ ...inputs, exitPrice });
    return {
      ...s,
      exitPrice,
      founderPayout: result.founderPayout,
      naiveExpectation: result.naiveExpectation,
      founderPctOfExit: exitPrice > 0 ? (result.founderPayout / exitPrice) * 100 : 0,
    };
  });
}
