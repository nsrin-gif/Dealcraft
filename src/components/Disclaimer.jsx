const DISCLAIMER_TEXT =
  'This tool prepares you for conversations with your legal team, board, and investors. It is not legal or financial advice and is not a replacement for qualified representation.';

export function DisclaimerModal({ onClose }) {
  return (
    <div className="no-print fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-400">Before you dive in</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-100">Preparation, not representation</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">{DISCLAIMER_TEXT}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          Got it — let's model my deal
        </button>
      </div>
    </div>
  );
}

export function DisclaimerFooter() {
  return (
    <footer className="no-print border-t border-slate-800 bg-slate-950/80 px-4 py-3 text-center text-xs text-slate-500">
      {DISCLAIMER_TEXT}
    </footer>
  );
}
