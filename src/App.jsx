import { useState } from 'react';
import { DisclaimerModal, DisclaimerFooter } from './components/Disclaimer';
import LearnPanel from './components/LearnPanel';
import WaterfallSimulatorView from './components/WaterfallSimulatorView';
import FriendsAndFamilyCalculator from './components/fnf/FriendsAndFamilyCalculator';

const TABS = [
  { id: 'waterfall', label: 'Exit Waterfall' },
  { id: 'fnf', label: 'F&F / Sweat Equity' },
];

export default function App() {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [showLearn, setShowLearn] = useState(false);
  const [view, setView] = useState('waterfall');

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      {showDisclaimer && <DisclaimerModal onClose={() => setShowDisclaimer(false)} />}
      {showLearn && <LearnPanel onClose={() => setShowLearn(false)} />}

      <header className="no-print sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-semibold tracking-tight text-slate-100">
            Deal<span className="text-emerald-400">Craft</span>
          </span>

          <nav className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/60 p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setView(t.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  view === t.id ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setShowLearn(true)}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-emerald-500 hover:text-emerald-400"
          >
            Learn the terms
          </button>
        </div>
      </header>

      {view === 'waterfall' ? <WaterfallSimulatorView /> : <FriendsAndFamilyCalculator />}

      <DisclaimerFooter />
    </div>
  );
}
