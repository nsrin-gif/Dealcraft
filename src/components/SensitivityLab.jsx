import { useMemo, useState } from 'react';
import { runWaterfall, PARTICIPATION } from '../lib/waterfall';
import { SegmentedControl } from './ui/fields';
import { formatUSD } from '../lib/format';

const PARTICIPATION_TOGGLES = [
  { value: 'baseline', label: 'As entered' },
  { value: PARTICIPATION.NON_PARTICIPATING, label: 'Force non-participating' },
  { value: PARTICIPATION.PARTICIPATING_UNCAPPED, label: 'Force participating' },
];

const PREF_TOGGLES = [
  { value: 'baseline', label: 'As entered' },
  { value: 1, label: 'Force 1x' },
  { value: 2, label: 'Force 2x' },
];

const DIVIDEND_TOGGLES = [
  { value: 'baseline', label: 'As entered' },
  { value: 'off', label: 'Force off' },
  { value: 'on', label: 'Force on (8%, compounding)' },
];

function applyOverrides(rounds, { participation, prefMultiple, dividends }) {
  return rounds.map((r) => {
    let next = { ...r };
    if (participation !== 'baseline') next.participation = participation;
    if (prefMultiple !== 'baseline') next.prefMultiple = prefMultiple;
    if (dividends === 'off') next.dividendsEnabled = false;
    if (dividends === 'on') next = { ...next, dividendsEnabled: true, dividendRatePct: 8, dividendType: 'compounding', dividendYears: next.dividendYears || 4, dividendTiming: 'after' };
    return next;
  });
}

function Row({ title, options, value, onChange, delta }) {
  return (
    <div className="flex flex-col gap-2 border-t border-slate-800 py-4 first:border-t-0 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-slate-200">{title}</p>
      </div>
      <div className="flex items-center gap-4">
        <SegmentedControl value={value} onChange={onChange} options={options} />
        <span className={`w-28 text-right text-sm font-semibold tabular-nums ${delta === 0 ? 'text-slate-600' : delta > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {delta === 0 ? '—' : `${delta > 0 ? '+' : '−'}${formatUSD(Math.abs(delta), { compact: true })}`}
        </span>
      </div>
    </div>
  );
}

export default function SensitivityLab({ deal, rounds }) {
  const [participation, setParticipation] = useState('baseline');
  const [prefMultiple, setPrefMultiple] = useState('baseline');
  const [dividends, setDividends] = useState('baseline');

  const baseline = useMemo(
    () => runWaterfall({ ...deal, rounds }).founderPayout,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deal, rounds]
  );

  const withParticipation = useMemo(
    () => runWaterfall({ ...deal, rounds: applyOverrides(rounds, { participation, prefMultiple: 'baseline', dividends: 'baseline' }) }).founderPayout,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deal, rounds, participation]
  );
  const withPref = useMemo(
    () => runWaterfall({ ...deal, rounds: applyOverrides(rounds, { participation: 'baseline', prefMultiple, dividends: 'baseline' }) }).founderPayout,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deal, rounds, prefMultiple]
  );
  const withDividends = useMemo(
    () => runWaterfall({ ...deal, rounds: applyOverrides(rounds, { participation: 'baseline', prefMultiple: 'baseline', dividends }) }).founderPayout,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deal, rounds, dividends]
  );

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <h3 className="text-sm font-semibold text-slate-200">Sensitivity lab</h3>
      <p className="mt-1 text-xs text-slate-500">Flip one term at a time. Watch your payout move, at today's exit price.</p>
      <div className="mt-3">
        <Row
          title="Participation"
          options={PARTICIPATION_TOGGLES}
          value={participation}
          onChange={setParticipation}
          delta={withParticipation - baseline}
        />
        <Row title="Preference multiple" options={PREF_TOGGLES} value={prefMultiple} onChange={setPrefMultiple} delta={withPref - baseline} />
        <Row title="Cumulative dividends" options={DIVIDEND_TOGGLES} value={dividends} onChange={setDividends} delta={withDividends - baseline} />
      </div>
    </div>
  );
}
