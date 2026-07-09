import { SENIORITY } from '../lib/waterfall';
import { NumberInput, SegmentedControl, Toggle } from './ui/fields';
import InfoTooltip from './InfoTooltip';

export default function DealInputs({ deal, setDeal }) {
  const update = (patch) => setDeal({ ...deal, ...patch });

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <h3 className="text-sm font-semibold text-slate-200">Your stake &amp; the exit</h3>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Founder fully-diluted ownership</label>
          <NumberInput value={deal.founderPct} onChange={(v) => update({ founderPct: v })} step={0.5} min={0} max={100} suffix="%" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">
            <InfoTooltip term="option-pool">Option pool size</InfoTooltip>
          </label>
          <NumberInput value={deal.poolPct} onChange={(v) => update({ poolPct: v })} step={0.5} min={0} max={100} suffix="%" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Exit price</label>
          <NumberInput value={deal.exitPrice} onChange={(v) => update({ exitPrice: v })} step={1_000_000} min={0} suffix="$" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Transaction costs / escrow holdback</label>
          <NumberInput value={deal.txCostsPct} onChange={(v) => update({ txCostsPct: v })} step={0.5} min={0} max={30} suffix="%" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">
            <InfoTooltip term="carve-out">Management carve-out</InfoTooltip>
          </label>
          <NumberInput value={deal.carveOutPct} onChange={(v) => update({ carveOutPct: v })} step={0.5} min={0} max={30} suffix="%" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Seniority structure</label>
          <SegmentedControl
            value={deal.seniorityMode}
            onChange={(v) => update({ seniorityMode: v })}
            options={[
              { value: SENIORITY.STACKED, label: 'Stacked (senior)' },
              { value: SENIORITY.PARI_PASSU, label: 'Pari passu' },
            ]}
          />
        </div>
      </div>

      {deal.carveOutPct > 0 && (
        <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/60 p-3">
          <Toggle checked={deal.founderInCarveOut} onChange={(v) => update({ founderInCarveOut: v })} label="Founder included in carve-out pool" />
          <p className="mt-1 pl-11 text-[11px] text-slate-600">Defaults to no — this is the lesson: the person who built the company is often left out of the pool that rewards the team for closing the deal.</p>
          {deal.founderInCarveOut && (
            <div className="mt-2 max-w-[180px] pl-11">
              <NumberInput
                value={deal.founderCarveOutSharePct}
                onChange={(v) => update({ founderCarveOutSharePct: v })}
                step={1}
                min={0}
                max={100}
                suffix="% of carve-out"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
