import { formatUSD, formatPct } from '../lib/format';

export default function TruthTable({ scenarios }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <h3 className="text-sm font-semibold text-slate-200">Three-scenario truth table</h3>
      <p className="mt-1 text-xs text-slate-500">Term sensitivity is invisible in a home run and explosive in a messy exit.</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-slate-500">
              <th className="pb-2 pr-4 font-medium">Scenario</th>
              <th className="pb-2 pr-4 font-medium">Exit price</th>
              <th className="pb-2 pr-4 font-medium">You'd expect</th>
              <th className="pb-2 pr-4 font-medium">You actually get</th>
              <th className="pb-2 font-medium">% of exit</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((s) => {
              const shortfall = s.founderPayout < s.naiveExpectation * 0.9;
              return (
                <tr key={s.key} className="border-t border-slate-800">
                  <td className="py-3 pr-4">
                    <span className="font-medium text-slate-200">{s.label}</span>
                    <span className="block text-[11px] text-slate-600">{s.blurb}</span>
                  </td>
                  <td className="py-3 pr-4 tabular-nums text-slate-300">{formatUSD(s.exitPrice, { compact: true })}</td>
                  <td className="py-3 pr-4 tabular-nums text-slate-500">{formatUSD(s.naiveExpectation, { compact: true })}</td>
                  <td className={`py-3 pr-4 tabular-nums font-semibold ${shortfall ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {formatUSD(s.founderPayout, { compact: true })}
                  </td>
                  <td className="py-3 tabular-nums text-slate-400">{formatPct(s.founderPctOfExit, 1)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
