// Turns a runWaterfall() result into a left-to-right bridge (step-down waterfall)
// dataset: each step is a deduction from a running total, ending at founder payout.
const ROUND_COLORS = ['#f59e0b', '#fb923c', '#f97316', '#ea580c', '#c2410c'];
const PARTICIPATION_COLORS = ['#a78bfa', '#c084fc', '#d8b4fe', '#e9d5ff', '#f3e8ff'];

export function buildBridgeSteps(result) {
  const steps = [];
  let running = result.grossProceeds;

  steps.push({ name: 'Exit Price', base: 0, value: running, display: running, kind: 'total', color: '#34d399' });

  if (result.txCosts > 0) {
    running -= result.txCosts;
    steps.push({ name: 'Tx Costs / Escrow', base: running, value: result.txCosts, display: -result.txCosts, kind: 'deduction', color: '#64748b' });
  }
  if (result.carveOut > 0) {
    running -= result.carveOut;
    steps.push({ name: 'Management Carve-Out', base: running, value: result.carveOut, display: -result.carveOut, kind: 'deduction', color: '#475569' });
  }

  result.roundResults.forEach((r, i) => {
    if (r.prefAmount > 0) {
      running -= r.prefAmount;
      steps.push({
        name: `${r.name} Preference`,
        base: running,
        value: r.prefAmount,
        display: -r.prefAmount,
        kind: 'deduction',
        color: ROUND_COLORS[i % ROUND_COLORS.length],
      });
    }
  });

  result.roundResults.forEach((r, i) => {
    if (r.participationAmount > 0) {
      running -= r.participationAmount;
      steps.push({
        name: `${r.name} ${r.converted ? '(as-converted)' : 'Participation'}`,
        base: running,
        value: r.participationAmount,
        display: -r.participationAmount,
        kind: 'deduction',
        color: PARTICIPATION_COLORS[i % PARTICIPATION_COLORS.length],
      });
    }
  });

  if (result.poolPayout > 0) {
    running -= result.poolPayout;
    steps.push({ name: 'Option Pool', base: running, value: result.poolPayout, display: -result.poolPayout, kind: 'deduction', color: '#38bdf8' });
  }

  steps.push({ name: 'Founder Payout', base: 0, value: result.founderPayout, display: result.founderPayout, kind: 'result', color: '#10b981' });

  return steps;
}
