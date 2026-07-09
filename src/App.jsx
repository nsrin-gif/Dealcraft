import { useMemo, useRef, useState } from 'react';
import { makeRound, runWaterfall, buildTruthTable, PARTICIPATION, SENIORITY } from './lib/waterfall';
import { DisclaimerModal, DisclaimerFooter } from './components/Disclaimer';
import Hero from './components/Hero';
import RoundsEditor from './components/RoundsEditor';
import DealInputs from './components/DealInputs';
import WaterfallChart from './components/WaterfallChart';
import OwnershipVsPayout from './components/OwnershipVsPayout';
import TruthTable from './components/TruthTable';
import SensitivityLab from './components/SensitivityLab';
import ExportBar from './components/ExportBar';

function defaultRounds() {
  return [
    makeRound({
      name: 'Seed',
      amountRaised: 1_500_000,
      prefMultiple: 1,
      participation: PARTICIPATION.NON_PARTICIPATING,
    }),
    makeRound({
      name: 'Series A',
      amountRaised: 8_000_000,
      prefMultiple: 1,
      participation: PARTICIPATION.PARTICIPATING_UNCAPPED,
    }),
    makeRound({
      name: 'Series B',
      amountRaised: 22_000_000,
      prefMultiple: 1.5,
      participation: PARTICIPATION.PARTICIPATING_UNCAPPED,
      dividendsEnabled: true,
      dividendRatePct: 8,
      dividendType: 'compounding',
      dividendYears: 3,
      dividendTiming: 'after',
    }),
  ];
}

function defaultDeal() {
  return {
    founderPct: 22,
    poolPct: 12,
    exitPrice: 45_000_000,
    txCostsPct: 2,
    carveOutPct: 0,
    founderInCarveOut: false,
    founderCarveOutSharePct: 0,
    seniorityMode: SENIORITY.STACKED,
  };
}

export default function App() {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [rounds, setRounds] = useState(defaultRounds);
  const [deal, setDeal] = useState(defaultDeal);
  const builderRef = useRef(null);

  const result = useMemo(() => runWaterfall({ ...deal, rounds }), [deal, rounds]);
  const truthTable = useMemo(() => buildTruthTable({ ...deal, rounds }), [deal, rounds]);

  function handleImport(parsed) {
    setRounds(parsed.rounds.map((r) => makeRound({ ...r, id: crypto.randomUUID() })));
    setDeal(parsed.deal);
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      {showDisclaimer && <DisclaimerModal onClose={() => setShowDisclaimer(false)} />}

      <header className="no-print sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="text-sm font-semibold tracking-tight text-slate-100">
            Deal<span className="text-emerald-400">Craft</span>
          </span>
          <span className="hidden text-xs text-slate-500 sm:block">Module 1A — Exit Waterfall Simulator</span>
        </div>
      </header>

      <div className="no-print">
        <Hero
          founderPct={deal.founderPct}
          exitPrice={deal.exitPrice}
          setExitPrice={(v) => setDeal((d) => ({ ...d, exitPrice: v }))}
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
          <RoundsEditor rounds={rounds} setRounds={setRounds} founderPct={deal.founderPct} poolPct={deal.poolPct} />
          <DealInputs deal={deal} setDeal={setDeal} />
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

      <DisclaimerFooter />
    </div>
  );
}
