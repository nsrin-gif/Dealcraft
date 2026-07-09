import { CONTRIBUTION_TYPE } from '../../lib/slicingPie';
import { NumberInput } from '../ui/fields';

export default function MultipliersPanel({ multipliers, onChange }) {
  const update = (type, v) => onChange({ ...multipliers, [type]: v });

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <h3 className="text-sm font-semibold text-slate-200">Risk multipliers</h3>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">
        Cash and sweat equity carry different risk, so each fair-market dollar is worth a different number of slices.
        Defaults follow the Slicing Pie model's standard 4x cash / 2x time — adjust if your group agrees on a
        different risk premium.
      </p>
      <div className="mt-3 grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1 block text-xs text-slate-500">Cash</label>
          <NumberInput value={multipliers[CONTRIBUTION_TYPE.CASH]} onChange={(v) => update(CONTRIBUTION_TYPE.CASH, v)} step={0.5} min={1} suffix="x" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Time</label>
          <NumberInput value={multipliers[CONTRIBUTION_TYPE.TIME]} onChange={(v) => update(CONTRIBUTION_TYPE.TIME, v)} step={0.5} min={1} suffix="x" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Expenses</label>
          <NumberInput value={multipliers[CONTRIBUTION_TYPE.EXPENSE]} onChange={(v) => update(CONTRIBUTION_TYPE.EXPENSE, v)} step={0.5} min={1} suffix="x" />
        </div>
      </div>
    </div>
  );
}
