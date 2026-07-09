import { SCENARIO_PRESETS } from '../data/scenarioPresets';

export default function ScenarioPicker({ activeId, onSelect }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <h3 className="text-sm font-semibold text-slate-200">Start from a scenario</h3>
      <p className="mt-1 text-xs text-slate-500">Loads example rounds and terms — edit anything afterward.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {SCENARIO_PRESETS.map((make) => {
          const preset = make();
          const active = preset.id === activeId;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelect(preset)}
              title={preset.description}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                  : 'border-slate-700 text-slate-400 hover:border-emerald-500 hover:text-emerald-400'
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
