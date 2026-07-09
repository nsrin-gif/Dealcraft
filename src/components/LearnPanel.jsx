import { useState } from 'react';
import { GLOSSARY } from '../data/glossary';

const HOW_TO_STEPS = [
  {
    title: 'Enter your financing rounds',
    body: "Add each round you've raised (Seed, Series A, etc.) with its amount raised and terms. Click \"Terms\" on any round to set its liquidation preference, participation, dividends, and anti-dilution.",
  },
  {
    title: 'Enter your stake and the exit',
    body: 'Fill in your fully-diluted ownership %, the option pool size, and a hypothetical exit price. These drive everything below.',
  },
  {
    title: 'Read the waterfall chart',
    body: "It shows exactly where every dollar of the exit goes, in order — costs, carve-outs, each round's preference, participation — until what's left lands with you.",
  },
  {
    title: 'Compare expectation vs. reality',
    body: '"What you think you get" is just ownership % × exit price. "What you actually get" runs the full preference stack. The gap between them is the whole point of this tool.',
  },
  {
    title: 'Check the truth table',
    body: 'See your payout automatically recalculated for a home run, a solid exit, and a messy exit — the same terms can mean wildly different outcomes depending on how big the exit is.',
  },
  {
    title: 'Try the sensitivity lab',
    body: 'Flip one term at a time (participating vs. not, 1x vs. 2x, dividends on/off) and see the exact dollar impact on your payout, holding everything else constant.',
  },
  {
    title: 'Export before you talk to your lawyer',
    body: 'Save your scenario as JSON to reload later, or export a PDF to bring into a conversation with your legal team, board, or counterparty.',
  },
];

function GlossaryList({ query }) {
  const entries = Object.entries(GLOSSARY).filter(([, v]) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return v.term.toLowerCase().includes(q) || v.def.toLowerCase().includes(q);
  });

  if (entries.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-500">No terms match "{query}".</p>;
  }

  return (
    <dl className="divide-y divide-slate-800">
      {entries.map(([key, v]) => (
        <div key={key} className="py-4">
          <dt className="text-sm font-semibold text-emerald-400">{v.term}</dt>
          <dd className="mt-1 text-sm leading-relaxed text-slate-300">{v.def}</dd>
          <dd className="mt-1.5 text-xs leading-relaxed text-slate-500">
            <span className="font-medium text-slate-400">Example: </span>
            {v.example}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function LearnPanel({ onClose }) {
  const [tab, setTab] = useState('how-to');
  const [query, setQuery] = useState('');

  return (
    <div className="no-print fixed inset-0 z-[90] flex justify-end bg-black/60" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-lg flex-col overflow-hidden border-l border-slate-800 bg-slate-950 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-100">Learn</h2>
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-700 px-2.5 py-1 text-xs text-slate-400 hover:border-emerald-500 hover:text-emerald-400">
            Close
          </button>
        </div>

        <div className="flex gap-1 border-b border-slate-800 px-5 pt-3">
          <button
            type="button"
            onClick={() => setTab('how-to')}
            className={`rounded-t-lg px-3 py-2 text-xs font-medium ${tab === 'how-to' ? 'border-b-2 border-emerald-500 text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            How to use this tool
          </button>
          <button
            type="button"
            onClick={() => setTab('glossary')}
            className={`rounded-t-lg px-3 py-2 text-xs font-medium ${tab === 'glossary' ? 'border-b-2 border-emerald-500 text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Glossary
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {tab === 'how-to' && (
            <ol className="space-y-5">
              {HOW_TO_STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-semibold text-emerald-400">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{step.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-slate-400">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}

          {tab === 'glossary' && (
            <div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search terms…"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
              />
              <GlossaryList query={query} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
