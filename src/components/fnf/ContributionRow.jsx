import { CONTRIBUTION_TYPE, fairMarketValue } from '../../lib/slicingPie';
import { NumberInput, SelectInput } from '../ui/fields';
import { formatUSD } from '../../lib/format';

const TYPE_OPTIONS = [
  { value: CONTRIBUTION_TYPE.CASH, label: 'Cash' },
  { value: CONTRIBUTION_TYPE.TIME, label: 'Time (sweat equity)' },
  { value: CONTRIBUTION_TYPE.EXPENSE, label: 'Expense' },
];

export default function ContributionRow({ contribution, onChange, onRemove }) {
  const update = (patch) => onChange({ ...contribution, ...patch });
  const fmv = fairMarketValue(contribution);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <SelectInput value={contribution.type} onChange={(v) => update({ type: v })} options={TYPE_OPTIONS} className="max-w-[180px]" />

        {contribution.type === CONTRIBUTION_TYPE.CASH && (
          <NumberInput value={contribution.amount} onChange={(v) => update({ amount: v })} suffix="$" step={500} min={0} className="max-w-[160px]" />
        )}

        {contribution.type === CONTRIBUTION_TYPE.EXPENSE && (
          <NumberInput value={contribution.amount} onChange={(v) => update({ amount: v })} suffix="$ unreimbursed" step={50} min={0} className="max-w-[180px]" />
        )}

        {contribution.type === CONTRIBUTION_TYPE.TIME && (
          <>
            <NumberInput value={contribution.hours} onChange={(v) => update({ hours: v })} suffix="hrs" step={10} min={0} className="max-w-[110px]" />
            <NumberInput value={contribution.hourlyRate} onChange={(v) => update({ hourlyRate: v })} suffix="$/hr fair rate" step={5} min={0} className="max-w-[170px]" />
            <NumberInput value={contribution.amountPaid} onChange={(v) => update({ amountPaid: v })} suffix="$ actually paid" step={100} min={0} className="max-w-[170px]" />
          </>
        )}

        <span className="ml-auto whitespace-nowrap text-xs text-slate-500">
          FMV <span className="font-medium text-slate-300">{formatUSD(fmv, { compact: true })}</span>
        </span>
        <button type="button" onClick={onRemove} className="rounded-lg border border-slate-700 px-2 py-1 text-xs text-rose-400 hover:border-rose-500">
          Remove
        </button>
      </div>
    </div>
  );
}
