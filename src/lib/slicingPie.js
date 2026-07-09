// Dynamic equity split engine based on the Slicing Pie model (Mike Moyer):
// https://slicingpie.com — "Slices = Fair Market Value x Multiplier". Cash and
// sweat-equity (time) contributions are both converted to a common "slice" unit
// so a friends-and-family round with mixed cash and labor can be split on one
// consistent, defensible basis instead of an arbitrary handshake percentage.

export const CONTRIBUTION_TYPE = {
  CASH: 'cash',
  TIME: 'time',
  EXPENSE: 'expense',
};

export function defaultMultipliers() {
  return {
    [CONTRIBUTION_TYPE.CASH]: 4,
    [CONTRIBUTION_TYPE.TIME]: 2,
    [CONTRIBUTION_TYPE.EXPENSE]: 1,
  };
}

export function makeContributor(overrides = {}) {
  return {
    id: overrides.id ?? crypto.randomUUID(),
    name: 'Contributor',
    ...overrides,
  };
}

export function makeContribution(overrides = {}) {
  return {
    id: overrides.id ?? crypto.randomUUID(),
    contributorId: overrides.contributorId ?? null,
    type: CONTRIBUTION_TYPE.CASH,
    amount: 0, // cash / expense
    hours: 0, // time
    hourlyRate: 0, // time — the person's fair-market rate, not what they're actually paid
    amountPaid: 0, // time — cash actually received for those hours, if any (below-market salary)
    ...overrides,
  };
}

/** The unweighted dollar value of a single contribution, before any multiplier. */
export function fairMarketValue(contribution) {
  switch (contribution.type) {
    case CONTRIBUTION_TYPE.CASH:
    case CONTRIBUTION_TYPE.EXPENSE:
      return Math.max(0, contribution.amount || 0);
    case CONTRIBUTION_TYPE.TIME: {
      const earned = (contribution.hours || 0) * (contribution.hourlyRate || 0);
      const paid = contribution.amountPaid || 0;
      return Math.max(0, earned - paid);
    }
    default:
      return 0;
  }
}

export function slices(contribution, multipliers) {
  return fairMarketValue(contribution) * (multipliers[contribution.type] || 1);
}

/**
 * Runs the full split: groups contributions by contributor, converts each to
 * slices via its type's multiplier, and normalizes to an ownership percentage.
 * Also surfaces each contributor's unpaid "grunt fund" value — the deferred
 * income they've effectively invested by working below fair market rate.
 */
export function runSlicingPie(contributors, contributions, multipliers) {
  const byContributor = new Map(contributors.map((c) => [c.id, { contributor: c, fmv: 0, slices: 0, deferredIncome: 0 }]));

  for (const contribution of contributions) {
    const bucket = byContributor.get(contribution.contributorId);
    if (!bucket) continue;
    const fmv = fairMarketValue(contribution);
    const contributionSlices = slices(contribution, multipliers);
    bucket.fmv += fmv;
    bucket.slices += contributionSlices;
    if (contribution.type === CONTRIBUTION_TYPE.TIME) {
      bucket.deferredIncome += fmv;
    }
  }

  const totalSlices = [...byContributor.values()].reduce((s, b) => s + b.slices, 0);

  const results = [...byContributor.values()].map((b) => ({
    contributorId: b.contributor.id,
    name: b.contributor.name,
    fmv: b.fmv,
    slices: b.slices,
    deferredIncome: b.deferredIncome,
    ownershipPct: totalSlices > 0 ? (b.slices / totalSlices) * 100 : 0,
  }));

  return {
    totalSlices,
    totalFmv: results.reduce((s, r) => s + r.fmv, 0),
    totalDeferredIncome: results.reduce((s, r) => s + r.deferredIncome, 0),
    results: results.sort((a, b) => b.ownershipPct - a.ownershipPct),
  };
}
