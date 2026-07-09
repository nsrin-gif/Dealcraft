import { formatUSD, formatPct } from '../../lib/format';
import OwnershipChart from './OwnershipChart';

export default function ResultsPanel({ split, colorByContributorId }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="text-sm font-semibold text-slate-200">Ownership split</h3>
        <p className="mt-1 text-xs text-slate-500">Each contributor's share of total slices.</p>
        <div className="mt-4">
          <OwnershipChart results={split.results} colorByContributorId={colorByContributorId} />
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="text-sm font-semibold text-slate-200">Deferred income</h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          The unpaid fair-market value of sweat-equity time — the income each person has effectively converted into
          equity instead of taking as salary.
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th className="pb-2 pr-4 font-medium">Contributor</th>
                <th className="pb-2 pr-4 font-medium">FMV contributed</th>
                <th className="pb-2 pr-4 font-medium">Deferred income</th>
                <th className="pb-2 font-medium">Ownership</th>
              </tr>
            </thead>
            <tbody>
              {split.results.map((r) => (
                <tr key={r.contributorId} className="border-t border-slate-800">
                  <td className="py-2.5 pr-4 text-slate-200">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full align-middle" style={{ backgroundColor: colorByContributorId.get(r.contributorId) }} />
                    {r.name || 'Unnamed'}
                  </td>
                  <td className="py-2.5 pr-4 tabular-nums text-slate-400">{formatUSD(r.fmv, { compact: true })}</td>
                  <td className="py-2.5 pr-4 tabular-nums text-amber-400">
                    {r.deferredIncome > 0 ? formatUSD(r.deferredIncome, { compact: true }) : '—'}
                  </td>
                  <td className="py-2.5 tabular-nums font-semibold text-emerald-400">{formatPct(r.ownershipPct, 1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {split.totalDeferredIncome > 0 && (
          <p className="mt-3 text-xs text-slate-500">
            Total deferred income across the team:{' '}
            <span className="font-medium text-amber-400">{formatUSD(split.totalDeferredIncome, { compact: true })}</span>
            {' '}— worth tracking even if you never formalize it as debt, so everyone remembers what was actually put in.
          </p>
        )}
      </div>
    </div>
  );
}
