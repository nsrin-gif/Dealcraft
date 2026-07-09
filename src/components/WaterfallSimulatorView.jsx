import { useMemo, useRef, useState } from 'react';
import { makeRound, runWaterfall, buildTruthTable } from '../lib/waterfall';
import { seedToSeriesBPreset } from '../data/scenarioPresets';
import Hero from './Hero';
import ScenarioPicker from './ScenarioPicker';
import RoundsEditor from './RoundsEditor';
import DealInputs from './DealInputs';
import WaterfallChart from './WaterfallChart';
import OwnershipVsPayout from './OwnershipVsPayout';
import TruthTable from './TruthTable';
import SensitivityLab from './SensitivityLab';
import ExportBar from './ExportBar';

const initialPreset = seedToSeriesBPreset();

export default function WaterfallSimulatorView() {
  const [activePresetId, setActivePresetId] = useState(initialPreset.id);
  const [rounds, setRounds] = useState(initialPreset.rounds);
  const [deal, setDeal] = useState(initialPreset.deal);
  const builderRef = useRef(null);

  const result = useMemo(() => runWaterfall({ ...deal, rounds }), [deal, rounds]);
  const truthTable = useMemo(() => buildTruthTable({ ...deal, rounds }), [deal, rounds]);

  function handleImport(parsed) {
    setActivePresetId(null);
    setRounds(parsed.rounds.map((r) => makeRound({ ...r, id: crypto.randomUUID() })));
    setDeal(parsed.deal);
  }

  function handleSelectPreset(preset) {
    setActivePresetId(preset.id);
    setRounds(preset.rounds.map((r) => makeRound({ ...r, id: crypto.randomUUID() })));
    setDeal(preset.deal);
  }

  function handleRoundsChange(next) {
    setActivePresetId(null);
    setRounds(next);
  }

  function handleDealChange(next) {
    setActivePresetId(null);
    setDeal(next);
  }

  return (
    <>
      <div className="no-print">
        <Hero
          founderPct={deal.founderPct}
          exitPrice={deal.exitPrice}
          setExitPrice={(v) => handleDealChange({ ...deal, exitPrice: v })}
          founderPayout={result.founderPayout}
          onJumpToBuilder={() => builderRef.current?.scrollIntoView({ behavior: 'smooth' })}
        />
      </div>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <div ref={builderRef} className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Build your cap table</h2>
            <p className="text-sm text-slate-500">Up to 5 rounds. Everything recalculates live.</p>
          </div>
          <ExportBar rounds={rounds} deal={deal} onImport={handleImport} />
        </div>

        <div className="mb-6">
          <ScenarioPicker activeId={activePresetId} onSelect={handleSelectPreset} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
          <RoundsEditor rounds={rounds} setRounds={handleRoundsChange} founderPct={deal.founderPct} poolPct={deal.poolPct} />
          <DealInputs deal={deal} setDeal={handleDealChange} />
        </div>

        <div className="mt-10 space-y-6">
          <OwnershipVsPayout result={result} founderPct={deal.founderPct} />

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h3 className="text-sm font-semibold text-slate-200">Exit waterfall</h3>
            <p className="mt-1 text-xs text-slate-500">
              Every dollar, in order: exit price → costs &amp; carve-outs → preference stack → participation → what's
              left for you.
            </p>
            <div className="mt-2">
              <WaterfallChart result={result} />
            </div>
          </div>

          <TruthTable scenarios={truthTable} />
          <SensitivityLab deal={deal} rounds={rounds} />
        </div>
      </main>
    </>
  );
}
