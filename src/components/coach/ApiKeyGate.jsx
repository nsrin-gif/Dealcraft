import { useState } from 'react';

export default function ApiKeyGate({ onSubmit }) {
  const [value, setValue] = useState('');

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
      <div className="max-w-sm">
        <h3 className="text-sm font-semibold text-slate-100">Connect your Claude API key</h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          The coach calls Claude directly from your browser using your own API key. It is kept in memory for this
          session only — never saved, never sent to any server DealCraft controls. Closing or refreshing this tab
          clears it.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Don't have a key?{' '}
          <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
            Get one at console.anthropic.com
          </a>
          .
        </p>
        <form
          className="mt-4 flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (value.trim()) onSubmit(value.trim());
          }}
        >
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="sk-ant-..."
            autoComplete="off"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!value.trim()}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-40"
          >
            Connect
          </button>
        </form>
      </div>
    </div>
  );
}
