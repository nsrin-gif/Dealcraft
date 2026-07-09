import { useState, useRef, useEffect } from 'react';
import { GLOSSARY } from '../data/glossary';

export default function InfoTooltip({ term, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const entry = GLOSSARY[term];

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (!entry) return children ?? null;

  return (
    <span className="relative inline-flex items-center gap-1" ref={ref}>
      <span>{children ?? entry.term}</span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`What is ${entry.term}?`}
        className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-slate-500 text-[10px] leading-none text-slate-400 hover:border-emerald-400 hover:text-emerald-400 cursor-help"
      >
        i
      </button>
      {open && (
        <div className="absolute left-0 top-6 z-50 w-64 rounded-lg border border-slate-700 bg-slate-900 p-3 text-left shadow-xl">
          <p className="text-xs font-semibold text-emerald-400">{entry.term}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">{entry.def}</p>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
            <span className="font-medium text-slate-400">Example: </span>
            {entry.example}
          </p>
        </div>
      )}
    </span>
  );
}
