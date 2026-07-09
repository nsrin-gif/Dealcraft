import { useRef } from 'react';

export default function ExportBar({ rounds, deal, onImport }) {
  const fileInputRef = useRef(null);

  function exportJson() {
    const payload = { version: 1, exportedAt: new Date().toISOString(), rounds, deal };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dealcraft-waterfall-scenario-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (parsed.rounds && parsed.deal) {
          onImport(parsed);
        } else {
          alert('That file does not look like a DealCraft scenario export.');
        }
      } catch {
        alert('Could not parse that file as JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 hover:border-emerald-500 hover:text-emerald-400"
      >
        Export PDF — bring to your lawyer
      </button>
      <button type="button" onClick={exportJson} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 hover:border-emerald-500 hover:text-emerald-400">
        Save scenario (JSON)
      </button>
      <button type="button" onClick={handleImportClick} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 hover:border-emerald-500 hover:text-emerald-400">
        Load scenario
      </button>
      <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileChange} />
    </div>
  );
}
