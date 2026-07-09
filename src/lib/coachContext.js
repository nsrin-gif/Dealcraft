import { formatUSD, formatPct } from './format';
import { PARTICIPATION } from './waterfall';
import { CONTRIBUTION_TYPE, fairMarketValue } from './slicingPie';

const PARTICIPATION_LABEL = {
  [PARTICIPATION.NON_PARTICIPATING]: 'non-participating',
  [PARTICIPATION.PARTICIPATING_CAPPED]: 'participating (capped)',
  [PARTICIPATION.PARTICIPATING_UNCAPPED]: 'participating (uncapped)',
};

export function summarizeWaterfallScenario(deal, rounds, result) {
  const lines = [];
  lines.push(
    `Founder fully-diluted ownership: ${formatPct(deal.founderPct, 1)}. Option pool: ${formatPct(deal.poolPct, 1)}. Exit price: ${formatUSD(deal.exitPrice)}. Transaction costs: ${formatPct(deal.txCostsPct, 1)} of exit price.`
  );
  if (rounds.length === 0) {
    lines.push('No financing rounds — fully bootstrapped.');
  } else {
    lines.push('Financing rounds:');
    for (const r of rounds) {
      const bits = [
        `${r.name}: ${formatUSD(r.amountRaised)} raised`,
        `${r.prefMultiple}x`,
        PARTICIPATION_LABEL[r.participation],
      ];
      if (r.participation === PARTICIPATION.PARTICIPATING_CAPPED) bits.push(`capped at ${r.participationCapMultiple}x`);
      if (r.dividendsEnabled) bits.push(`${r.dividendRatePct}% ${r.dividendType} dividends over ${r.dividendYears} years`);
      lines.push(`- ${bits.join(', ')}`);
    }
    lines.push(`Seniority structure: ${deal.seniorityMode}.`);
  }
  lines.push(
    `Result: naive expectation (ownership % × exit price) = ${formatUSD(result.naiveExpectation)}. Actual founder payout = ${formatUSD(result.founderPayout)}.`
  );
  return lines.join('\n');
}

export function summarizeFnfSplit(contributors, contributions, multipliers, split) {
  const lines = [];
  lines.push(`Multipliers: cash ${multipliers[CONTRIBUTION_TYPE.CASH]}x, time ${multipliers[CONTRIBUTION_TYPE.TIME]}x, expenses ${multipliers[CONTRIBUTION_TYPE.EXPENSE]}x.`);
  lines.push('Contributors:');
  for (const c of contributors) {
    const result = split.results.find((r) => r.contributorId === c.id);
    const contribs = contributions.filter((x) => x.contributorId === c.id);
    const contribBits = contribs.map((x) => {
      if (x.type === CONTRIBUTION_TYPE.CASH) return `${formatUSD(x.amount)} cash`;
      if (x.type === CONTRIBUTION_TYPE.EXPENSE) return `${formatUSD(x.amount)} unreimbursed expense`;
      return `${x.hours} hrs at $${x.hourlyRate}/hr fair rate, ${formatUSD(x.amountPaid)} actually paid (FMV ${formatUSD(fairMarketValue(x))})`;
    });
    lines.push(`- ${c.name}: ${contribBits.join('; ') || 'no contributions yet'} → ${formatPct(result?.ownershipPct ?? 0, 1)} ownership`);
  }
  return lines.join('\n');
}
