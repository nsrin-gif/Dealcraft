import AnimatedNumber from './AnimatedNumber';
import { formatUSD } from '../lib/format';

export default function Hero({ founderPct, exitPrice, setExitPrice, founderPayout, onJumpToBuilder }) {
  const min = 20_000_000;
  const max = 120_000_000;

  return (
    <section className="border-b border-slate-800 bg-gradient-to-b from-slate-900/60 to-transparent px-4 pb-12 pt-14 sm:pt-20">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
          DealCraft — Founder Equity Coach
        </span>
        <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-slate-50 sm:text-5xl">
          You own {founderPct}%. Here's how you walk away with{' '}
          <span className={founderPayout < 1000 ? 'text-rose-400' : 'text-emerald-400'}>
            <AnimatedNumber value={founderPayout} compact />
          </span>
          .
        </h1>
        <p className="mt-4 text-base text-slate-400">
          Ownership percentage is not payout percentage. Drag the exit price below and watch a real preference stack —
          seed, Series A, and Series B, with participation and compounding dividends — decide what you actually take
          home. No signup.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Exit price</span>
            <span className="font-semibold text-slate-300 tabular-nums">{formatUSD(exitPrice, { compact: true })}</span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={1_000_000}
            value={exitPrice}
            onChange={(e) => setExitPrice(Number(e.target.value))}
            className="mt-2 w-full accent-emerald-500"
          />
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-950/60 p-4 text-left">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">What ownership % implied</p>
              <AnimatedNumber value={(founderPct / 100) * exitPrice} compact className="mt-1 block text-xl font-semibold text-slate-300" />
            </div>
            <div className="rounded-xl bg-slate-950/60 p-4 text-left">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">What you actually get</p>
              <AnimatedNumber
                value={founderPayout}
                compact
                className={`mt-1 block text-xl font-semibold ${founderPayout < 1000 ? 'text-rose-400' : 'text-emerald-400'}`}
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onJumpToBuilder}
          className="mt-8 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          Build my real cap table ↓
        </button>
      </div>
    </section>
  );
}
