import { makeRound, deriveOwnership } from '../lib/waterfall';
import RoundCard from './RoundCard';

const ROUND_NAME_SEQUENCE = ['Seed', 'Series A', 'Series B', 'Series C', 'Series D'];

export default function RoundsEditor({ rounds, setRounds, founderPct, poolPct }) {
  const { ownershipById } = deriveOwnership(rounds, founderPct, poolPct);

  function updateRound(id, next) {
    setRounds(rounds.map((r) => (r.id === id ? next : r)));
  }

  function addRound() {
    if (rounds.length >= 5) return;
    setRounds([
      ...rounds,
      makeRound({ name: ROUND_NAME_SEQUENCE[rounds.length] ?? `Round ${rounds.length + 1}`, amountRaised: 5_000_000 }),
    ]);
  }

  function removeRound(id) {
    setRounds(rounds.filter((r) => r.id !== id));
  }

  return (
    <div className="space-y-3">
      {rounds.map((round, idx) => (
        <RoundCard
          key={round.id}
          round={round}
          index={idx}
          ownershipPct={ownershipById.get(round.id) || 0}
          onChange={(next) => updateRound(round.id, next)}
          onRemove={() => removeRound(round.id)}
          canRemove={rounds.length > 1}
        />
      ))}
      {rounds.length < 5 && (
        <button
          type="button"
          onClick={addRound}
          className="w-full rounded-xl border border-dashed border-slate-700 py-3 text-sm text-slate-400 hover:border-emerald-500 hover:text-emerald-400"
        >
          + Add financing round ({rounds.length}/5)
        </button>
      )}
    </div>
  );
}
