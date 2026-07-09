import { makeRound, PARTICIPATION, SENIORITY } from '../lib/waterfall';

function baseDeal(overrides = {}) {
  return {
    founderPct: 80,
    poolPct: 10,
    exitPrice: 20_000_000,
    txCostsPct: 2,
    carveOutPct: 0,
    founderInCarveOut: false,
    founderCarveOutSharePct: 0,
    seniorityMode: SENIORITY.STACKED,
    ...overrides,
  };
}

export function bootstrappedPreset() {
  return {
    id: 'bootstrapped',
    label: 'Bootstrapped',
    description: 'No institutional capital raised. No preference stack — the option pool aside, everything flows to you.',
    rounds: [],
    deal: baseDeal({ founderPct: 90, poolPct: 10, exitPrice: 15_000_000 }),
  };
}

export function preSeedPreset() {
  return {
    id: 'pre-seed',
    label: 'Pre-Seed',
    description: 'One small first check — typically a friends-and-family or angel round with plain-vanilla terms.',
    rounds: [
      makeRound({
        name: 'Pre-Seed',
        amountRaised: 400_000,
        prefMultiple: 1,
        participation: PARTICIPATION.NON_PARTICIPATING,
      }),
    ],
    deal: baseDeal({ founderPct: 82, poolPct: 8, exitPrice: 20_000_000 }),
  };
}

export function seedToSeriesBPreset() {
  return {
    id: 'seed-to-series-b',
    label: 'Seed → Series B',
    description: 'Three institutional rounds with a mix of participation and dividend terms — the fuller picture.',
    rounds: [
      makeRound({
        name: 'Seed',
        amountRaised: 2_000_000,
        prefMultiple: 1,
        participation: PARTICIPATION.NON_PARTICIPATING,
      }),
      makeRound({
        name: 'Series A',
        amountRaised: 12_000_000,
        prefMultiple: 1,
        participation: PARTICIPATION.PARTICIPATING_UNCAPPED,
      }),
      makeRound({
        name: 'Series B',
        amountRaised: 30_000_000,
        prefMultiple: 2,
        participation: PARTICIPATION.PARTICIPATING_UNCAPPED,
        dividendsEnabled: true,
        dividendRatePct: 6,
        dividendType: 'simple',
        dividendYears: 5,
        dividendTiming: 'after',
      }),
    ],
    deal: baseDeal({ founderPct: 34, poolPct: 10, exitPrice: 65_000_000 }),
  };
}

export const SCENARIO_PRESETS = [bootstrappedPreset, preSeedPreset, seedToSeriesBPreset];
