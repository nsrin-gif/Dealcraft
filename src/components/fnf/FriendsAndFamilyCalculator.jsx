import { useMemo, useRef, useState } from 'react';
import { makeContributor, makeContribution, defaultMultipliers, runSlicingPie, CONTRIBUTION_TYPE } from '../../lib/slicingPie';
import { summarizeFnfSplit } from '../../lib/coachContext';
import { SERIES_COLORS } from './seriesColors';
import ContributorCard from './ContributorCard';
import MultipliersPanel from './MultipliersPanel';
import ResultsPanel from './ResultsPanel';
import FrameworkNote from './FrameworkNote';

function defaultContributors() {
  const founder = makeContributor({ name: 'You (founder)' });
  const investor = makeContributor({ name: 'Aunt / Uncle (cash)' });
  const advisor = makeContributor({ name: 'Friend (part-time help)' });
  return {
    contributors: [founder, investor, advisor],
    contributions: [
      makeContribution({ contributorId: founder.id, type: CONTRIBUTION_TYPE.TIME, hours: 1200, hourlyRate: 60, amountPaid: 0 }),
      makeContribution({ contributorId: investor.id, type: CONTRIBUTION_TYPE.CASH, amount: 25_000 }),
      makeContribution({ contributorId: advisor.id, type: CONTRIBUTION_TYPE.TIME, hours: 150, hourlyRate: 50, amountPaid: 2_000 }),
    ],
  };
}

export default function FriendsAndFamilyCalculator({ onAskCoach }) {
  const seed = useMemo(defaultContributors, []);
  const [contributors, setContributors] = useState(seed.contributors);
  const [contributions, setContributions] = useState(seed.contributions);
  const [multipliers, setMultipliers] = useState(defaultMultipliers);
  const fileInputRef = useRef(null);

  const split = useMemo(() => runSlicingPie(contributors, contributions, multipliers), [contributors, contributions, multipliers]);

  // Keyed by contributor id, in contributor-list order — stable across
  // recalculation so a color never gets reassigned just because someone's
  // ownership rank changed (color must follow identity, not sort order).
  const colorByContributorId = useMemo(() => {
    const map = new Map();
    contributors.forEach((c, i) => map.set(c.id, SERIES_COLORS[i % SERIES_COLORS.length]));
    return map;
  }, [contributors]);

  function addContributor() {
    if (contributors.length >= 8) return;
    const next = makeContributor({ name: `Contributor ${contributors.length + 1}` });
    setContributors([...contributors, next]);
    setContributions([...contributions, makeContribution({ contributorId: next.id, type: CONTRIBUTION_TYPE.CASH })]);
  }

  function removeContributor(id) {
    setContributors(contributors.filter((c) => c.id !== id));
    setContributions(contributions.filter((c) => c.contributorId !== id));
  }

  function renameContributor(next) {
    setContributors(contributors.map((c) => (c.id === next.id ? next : c)));
  }

  function addContribution(contribution) {
    setContributions([...contributions, contribution]);
  }

  function changeContribution(next) {
    setContributions(contributions.map((c) => (c.id === next.id ? next : c)));
  }

  function removeContribution(id) {
    setContributions(contributions.filter((c) => c.id !== id));
  }

  function exportJson() {
    const payload = { version: 1, exportedAt: new Date().toISOString(), contributors, contributions, multipliers };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dealcraft-fnf-split-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (parsed.contributors && parsed.contributions && parsed.multipliers) {
          setContributors(parsed.contributors);
          setContributions(parsed.contributions);
          setMultipliers(parsed.multipliers);
        } else {
          alert('That file does not look like a DealCraft F&F split export.');
        }
      } catch {
        alert('Could not parse that file as JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Friends &amp; family / sweat equity split</h2>
          <p className="text-sm text-slate-500">Mix cash and time contributions and see a defensible ownership split.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onAskCoach?.(summarizeFnfSplit(contributors, contributions, multipliers, split))}
            className="rounded-lg border border-emerald-700 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20"
          >
            Ask the Coach about this split
          </button>
          <button type="button" onClick={exportJson} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 hover:border-emerald-500 hover:text-emerald-400">
            Save split (JSON)
          </button>
          <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 hover:border-emerald-500 hover:text-emerald-400">
            Load split
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileChange} />
        </div>
      </div>

      <FrameworkNote />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-3">
          {contributors.map((contributor) => (
            <ContributorCard
              key={contributor.id}
              contributor={contributor}
              contributions={contributions.filter((c) => c.contributorId === contributor.id)}
              result={split.results.find((r) => r.contributorId === contributor.id)}
              onRenameContributor={renameContributor}
              onRemoveContributor={() => removeContributor(contributor.id)}
              onAddContribution={addContribution}
              onChangeContribution={changeContribution}
              onRemoveContribution={removeContribution}
              canRemove={contributors.length > 1}
            />
          ))}
          {contributors.length < 8 && (
            <button
              type="button"
              onClick={addContributor}
              className="w-full rounded-xl border border-dashed border-slate-700 py-3 text-sm text-slate-400 hover:border-emerald-500 hover:text-emerald-400"
            >
              + Add contributor ({contributors.length}/8)
            </button>
          )}

          <MultipliersPanel multipliers={multipliers} onChange={setMultipliers} />
        </div>

        <div>
          <ResultsPanel split={split} colorByContributorId={colorByContributorId} />
        </div>
      </div>
    </main>
  );
}
