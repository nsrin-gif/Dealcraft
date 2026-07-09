import { useState } from 'react';
import { PARTICIPATION, ANTI_DILUTION } from '../lib/waterfall';
import { NumberInput, TextInput, SelectInput, Toggle, SegmentedControl } from './ui/fields';
import InfoTooltip from './InfoTooltip';
import { formatUSD } from '../lib/format';

const PREF_PRESETS = [1, 1.5, 2];

const PARTICIPATION_OPTIONS = [
  { value: PARTICIPATION.NON_PARTICIPATING, label: 'Non-participating' },
  { value: PARTICIPATION.PARTICIPATING_CAPPED, label: 'Participating (capped)' },
  { value: PARTICIPATION.PARTICIPATING_UNCAPPED, label: 'Participating (uncapped)' },
];

const ANTI_DILUTION_OPTIONS = [
  { value: ANTI_DILUTION.NONE, label: 'None specified' },
  { value: ANTI_DILUTION.BROAD_BASED_WA, label: 'Broad-based weighted average' },
  { value: ANTI_DILUTION.FULL_RATCHET, label: 'Full ratchet' },
];

export default function RoundCard({ round, ownershipPct, onChange, onRemove, canRemove, index }) {
  const [expanded, setExpanded] = useState(false);
  const update = (patch) => onChange({ ...round, ...patch });

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-semibold text-emerald-400">
          {index + 1}
        </span>
        <TextInput value={round.name} onChange={(v) => update({ name: v })} placeholder="Round name" className="max-w-[140px]" />
        <NumberInput
          value={round.amountRaised}
          onChange={(v) => update({ amountRaised: v })}
          suffix="raised"
          step={100000}
          min={0}
          className="max-w-[180px]"
        />
        <span className="ml-auto text-xs text-slate-500">
          ≈ <span className="font-medium text-slate-300 tabular-nums">{ownershipPct.toFixed(1)}%</span> fully diluted
        </span>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="rounded-lg border border-slate-700 px-2.5 py-1.5 text-xs text-slate-400 hover:border-emerald-500 hover:text-emerald-400"
        >
          {expanded ? 'Collapse' : 'Terms'}
        </button>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg border border-slate-700 px-2.5 py-1.5 text-xs text-rose-400 hover:border-rose-500"
          >
            Remove
          </button>
        )}
      </div>

      {expanded && (
        <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-800 pt-4 sm:grid-cols-2">
          <div>
            <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <InfoTooltip term="liquidation-preference">Liquidation preference multiple</InfoTooltip>
            </div>
            <div className="flex items-center gap-2">
              <SegmentedControl
                value={PREF_PRESETS.includes(round.prefMultiple) ? round.prefMultiple : 'custom'}
                onChange={(v) => update({ prefMultiple: v === 'custom' ? round.prefMultiple : v })}
                options={[...PREF_PRESETS.map((p) => ({ value: p, label: `${p}x` })), { value: 'custom', label: 'Custom' }]}
              />
              <NumberInput value={round.prefMultiple} onChange={(v) => update({ prefMultiple: v })} step={0.1} min={0} suffix="x" className="max-w-[100px]" />
            </div>
          </div>

          <div>
            <div className="mb-1 text-xs font-medium text-slate-400">
              <InfoTooltip term="participating">Participation</InfoTooltip>
            </div>
            <SelectInput value={round.participation} onChange={(v) => update({ participation: v })} options={PARTICIPATION_OPTIONS} />
            {round.participation === PARTICIPATION.PARTICIPATING_CAPPED && (
              <div className="mt-2">
                <NumberInput
                  value={round.participationCapMultiple}
                  onChange={(v) => update({ participationCapMultiple: v })}
                  step={0.1}
                  min={0}
                  suffix="x total cap"
                />
              </div>
            )}
          </div>

          <div className="sm:col-span-2">
            <Toggle
              checked={round.dividendsEnabled}
              onChange={(v) => update({ dividendsEnabled: v })}
              label={<InfoTooltip term="dividends">Cumulative dividends</InfoTooltip>}
            />
            {round.dividendsEnabled && (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Rate</label>
                  <NumberInput value={round.dividendRatePct} onChange={(v) => update({ dividendRatePct: v })} step={0.5} min={0} max={10} suffix="%" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Type</label>
                  <SelectInput
                    value={round.dividendType}
                    onChange={(v) => update({ dividendType: v })}
                    options={[{ value: 'simple', label: 'Simple' }, { value: 'compounding', label: 'Compounding' }]}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Years outstanding</label>
                  <NumberInput value={round.dividendYears} onChange={(v) => update({ dividendYears: v })} step={1} min={0} max={20} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Applied</label>
                  <SelectInput
                    value={round.dividendTiming}
                    onChange={(v) => update({ dividendTiming: v })}
                    options={[{ value: 'before', label: 'Before multiple' }, { value: 'after', label: 'After multiple' }]}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="mb-1 text-xs font-medium text-slate-400">
              <InfoTooltip term="anti-dilution">Anti-dilution</InfoTooltip>
            </div>
            <SelectInput value={round.antiDilution} onChange={(v) => update({ antiDilution: v })} options={ANTI_DILUTION_OPTIONS} />
            {round.antiDilution !== ANTI_DILUTION.NONE && (
              <p className="mt-1.5 text-[11px] leading-snug text-amber-400/80">
                Flagged for awareness. This calculator works from ownership % rather than full share-price history, so
                it doesn't auto-adjust payouts for a future down round — model that by lowering this round's ownership
                override below if it's a live risk.
              </p>
            )}
          </div>

          <div>
            <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-400">
              Fully-diluted ownership override
              <span className="text-slate-600" title="Leave blank to auto-derive proportionally from capital raised">ⓘ</span>
            </div>
            <NumberInput
              value={round.ownershipPctOverride ?? NaN}
              onChange={(v) => update({ ownershipPctOverride: Number.isFinite(v) ? v : null })}
              step={0.5}
              min={0}
              max={100}
              suffix="%"
            />
            {round.ownershipPctOverride == null && (
              <p className="mt-1 text-[11px] text-slate-600">Auto-derived: {formatUSD(round.amountRaised, { compact: true })} raised → {ownershipPct.toFixed(1)}%</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
