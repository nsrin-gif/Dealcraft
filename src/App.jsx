import { useState } from 'react';
import { DisclaimerModal, DisclaimerFooter } from './components/Disclaimer';
import LearnPanel from './components/LearnPanel';
import WaterfallSimulatorView from './components/WaterfallSimulatorView';
import FriendsAndFamilyCalculator from './components/fnf/FriendsAndFamilyCalculator';
import CoachPanel from './components/coach/CoachPanel';

const TABS = [
  { id: 'waterfall', label: 'Exit Waterfall' },
  { id: 'fnf', label: 'F&F / Sweat Equity' },
];

export default function App() {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [showLearn, setShowLearn] = useState(false);
  const [view, setView] = useState('waterfall');
  const [apiKey, setApiKey] = useState('');
  const [coachOpen, setCoachOpen] = useState(false);
  const [coachSeed, setCoachSeed] = useState({ mode: 'general', contextSummary: null });

  function openCoach(mode, contextSummary = null) {
    setCoachSeed({ mode, contextSummary });
    setCoachOpen(true);
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      {showDisclaimer && <DisclaimerModal onClose={() => setShowDisclaimer(false)} />}
      {showLearn && <LearnPanel onClose={() => setShowLearn(false)} />}
      {coachOpen && (
        <CoachPanel
          key={JSON.stringify(coachSeed)}
          seed={coachSeed}
          apiKey={apiKey}
          onSetApiKey={setApiKey}
          onClose={() => setCoachOpen(false)}
        />
      )}

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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openCoach('general')}
              className="rounded-lg border border-emerald-700 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20"
            >
              Ask the Coach
            </button>
            <button
              type="button"
              onClick={() => setShowLearn(true)}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-emerald-500 hover:text-emerald-400"
            >
              Learn the terms
            </button>
          </div>
        </div>
      </header>

      {view === 'waterfall' ? (
        <WaterfallSimulatorView onAskCoach={(summary) => openCoach('waterfall', summary)} />
      ) : (
        <FriendsAndFamilyCalculator onAskCoach={(summary) => openCoach('fnf', summary)} />
      )}

      <DisclaimerFooter />
    </div>
  );
}
