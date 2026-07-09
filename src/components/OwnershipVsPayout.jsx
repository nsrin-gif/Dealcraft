import AnimatedNumber from './AnimatedNumber';
import { formatPct } from '../lib/format';

export default function OwnershipVsPayout({ result, founderPct }) {
  const delta = result.founderPayout - result.naiveExpectation;
  const gapPct = result.naiveExpectation > 0 ? (delta / result.naiveExpectation) * 100 : 0;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">What you think you get</p>
        <p className="mt-1 text-[11px] text-slate-600">{formatPct(founderPct, 0)} ownership × exit price</p>
        <AnimatedNumber value={result.naiveExpectation} className="mt-3 block text-3xl font-semibold text-slate-300" />
      </div>
      <div className={`rounded-xl border p-5 ${delta < 0 ? 'border-rose-900/60 bg-rose-950/20' : 'border-emerald-900/60 bg-emerald-950/20'}`}>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">What you actually get</p>
        <p className="mt-1 text-[11px] text-slate-600">after prefs, participation, dividends, costs</p>
        <AnimatedNumber value={result.founderPayout} className={`mt-3 block text-3xl font-semibold ${delta < 0 ? 'text-rose-400' : 'text-emerald-400'}`} />
        <p className={`mt-2 text-xs font-medium ${delta < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
          {delta < 0 ? '−' : '+'}
          {formatPct(Math.abs(gapPct), 0)} vs. what ownership % implied
        </p>
      </div>
    </div>
  );
}
