import { formatPct } from '../../lib/format';

export default function OwnershipChart({ results, colorByContributorId }) {
  if (results.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-500">Add a contributor and a contribution to see the split.</p>;
  }

  const max = Math.max(...results.map((r) => r.ownershipPct), 1);

  return (
    <div className="space-y-3">
      {results.map((r) => (
        <div key={r.contributorId}>
          <div className="mb-1 flex items-baseline justify-between text-xs">
            <span className="font-medium text-slate-300">{r.name || 'Unnamed'}</span>
            <span className="font-semibold text-slate-200 tabular-nums">{formatPct(r.ownershipPct, 1)}</span>
          </div>
          <div className="h-4 w-full rounded-sm bg-slate-800/60">
            <div
              className="h-4 rounded-sm transition-all"
              style={{
                width: `${Math.max(1, (r.ownershipPct / max) * 100)}%`,
                backgroundColor: colorByContributorId.get(r.contributorId),
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
