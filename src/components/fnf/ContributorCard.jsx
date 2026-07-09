import { makeContribution } from '../../lib/slicingPie';
import { TextInput } from '../ui/fields';
import { formatUSD, formatPct } from '../../lib/format';
import ContributionRow from './ContributionRow';

export default function ContributorCard({ contributor, contributions, result, onRenameContributor, onRemoveContributor, onAddContribution, onChangeContribution, onRemoveContribution, canRemove }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <TextInput value={contributor.name} onChange={(v) => onRenameContributor({ ...contributor, name: v })} placeholder="Name" className="max-w-[220px]" />
        <div className="ml-auto flex items-center gap-3 text-right">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-500">Ownership</p>
            <p className="text-lg font-semibold text-emerald-400 tabular-nums">{formatPct(result?.ownershipPct ?? 0, 1)}</p>
          </div>
          {result && result.deferredIncome > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-wide text-slate-500">Deferred income</p>
              <p className="text-sm font-medium text-amber-400 tabular-nums">{formatUSD(result.deferredIncome, { compact: true })}</p>
            </div>
          )}
        </div>
        {canRemove && (
          <button type="button" onClick={onRemoveContributor} className="rounded-lg border border-slate-700 px-2.5 py-1.5 text-xs text-rose-400 hover:border-rose-500">
            Remove
          </button>
        )}
      </div>

      <div className="mt-3 space-y-2">
        {contributions.map((c) => (
          <ContributionRow key={c.id} contribution={c} onChange={onChangeContribution} onRemove={() => onRemoveContribution(c.id)} />
        ))}
      </div>

      <button
        type="button"
        onClick={() => onAddContribution(makeContribution({ contributorId: contributor.id }))}
        className="mt-2 w-full rounded-lg border border-dashed border-slate-700 py-2 text-xs text-slate-400 hover:border-emerald-500 hover:text-emerald-400"
      >
        + Add contribution
      </button>
    </div>
  );
}
