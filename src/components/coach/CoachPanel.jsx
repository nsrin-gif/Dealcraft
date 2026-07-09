import { useRef, useState } from 'react';
import { createCoachClient, streamCoachReply, readFileAsBase64 } from '../../lib/coachClient';
import { buildSystemPrompt, CONTRACT_TYPE_OPTIONS } from '../../lib/coachPrompts';
import { SelectInput } from '../ui/fields';
import ApiKeyGate from './ApiKeyGate';
import MiniMarkdown from './MiniMarkdown';

const MODE_TABS = [
  { value: 'waterfall', label: 'Waterfall numbers' },
  { value: 'fnf', label: 'F&F split' },
  { value: 'document', label: 'Review a document' },
  { value: 'general', label: 'General question' },
];

export default function CoachPanel({ seed, apiKey, onSetApiKey, onClose }) {
  const [mode, setMode] = useState(seed.mode || 'general');
  const [contractType, setContractType] = useState('term_sheet');
  const [pastedDocText, setPastedDocText] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  const hasDocInput = pastedDocText.trim().length > 0 || pdfFile != null;

  function scrollToBottom() {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    });
  }

  async function handleSend() {
    if (busy) return;
    const trimmedInput = input.trim();
    const isFirstMessage = messages.length === 0;
    if (!trimmedInput && !(mode === 'document' && isFirstMessage && hasDocInput)) return;

    let apiContent = trimmedInput;
    let display = trimmedInput;

    if (mode === 'document' && isFirstMessage && hasDocInput) {
      const blocks = [];
      if (pdfFile) {
        try {
          const base64 = await readFileAsBase64(pdfFile);
          blocks.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } });
        } catch {
          setError('Could not read that PDF file.');
          return;
        }
      }
      const questionText = trimmedInput || 'Please review this document.';
      const fullText = pastedDocText.trim() ? `${questionText}\n\n--- Pasted document text ---\n${pastedDocText.trim()}` : questionText;
      blocks.push({ type: 'text', text: fullText });
      apiContent = blocks;
      const attachmentNote = pdfFile ? ` (${pdfFile.name} attached)` : pastedDocText.trim() ? ' (pasted document attached)' : '';
      display = questionText + attachmentNote;
    }

    const userMsg = { role: 'user', content: apiContent, display };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setError(null);
    setBusy(true);
    scrollToBottom();

    try {
      const client = createCoachClient(apiKey);
      const system = buildSystemPrompt({ mode, contractType, contextSummary: seed.contextSummary });
      const apiMessages = nextMessages.map((m) => ({ role: m.role, content: m.content }));

      setMessages((prev) => [...prev, { role: 'assistant', content: '', display: '' }]);
      let accumulated = '';
      for await (const delta of streamCoachReply(client, { system, messages: apiMessages })) {
        accumulated += delta;
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: 'assistant', content: accumulated, display: accumulated };
          return copy;
        });
        scrollToBottom();
      }
    } catch (err) {
      setError(err?.message || 'Something went wrong talking to Claude.');
      // Drop the empty placeholder bubble if nothing ever streamed into it —
      // otherwise a stuck "Thinking…" bubble sits above the error forever.
      setMessages((prev) => (prev[prev.length - 1]?.role === 'assistant' && !prev[prev.length - 1].display ? prev.slice(0, -1) : prev));
    } finally {
      setBusy(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="no-print fixed inset-0 z-[95] flex justify-end bg-black/60" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-lg flex-col overflow-hidden border-l border-slate-800 bg-slate-950 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-100">Ask the Coach</h2>
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-700 px-2.5 py-1 text-xs text-slate-400 hover:border-emerald-500 hover:text-emerald-400">
            Close
          </button>
        </div>

        {!apiKey ? (
          <ApiKeyGate onSubmit={onSetApiKey} />
        ) : (
          <>
            <div className="flex flex-wrap gap-1 border-b border-slate-800 px-5 py-3">
              {MODE_TABS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  disabled={messages.length > 0}
                  onClick={() => setMode(t.value)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    mode === t.value ? 'bg-emerald-500/15 text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {mode === 'waterfall' && !seed.contextSummary && (
              <p className="mx-5 mt-3 rounded-lg border border-amber-900/40 bg-amber-950/20 p-2.5 text-xs text-amber-300">
                Open this from inside the waterfall simulator's results to attach your actual numbers.
              </p>
            )}
            {mode === 'fnf' && !seed.contextSummary && (
              <p className="mx-5 mt-3 rounded-lg border border-amber-900/40 bg-amber-950/20 p-2.5 text-xs text-amber-300">
                Open this from inside the F&amp;F calculator's results to attach your actual split.
              </p>
            )}

            {mode === 'document' && messages.length === 0 && (
              <div className="space-y-2 border-b border-slate-800 px-5 py-3">
                <SelectInput value={contractType} onChange={setContractType} options={CONTRACT_TYPE_OPTIONS} />
                <textarea
                  value={pastedDocText}
                  onChange={(e) => setPastedDocText(e.target.value)}
                  placeholder="Paste contract text here…"
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none focus:border-emerald-500"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
                    className="text-xs text-slate-400 file:mr-2 file:rounded-lg file:border file:border-slate-700 file:bg-slate-900 file:px-2 file:py-1 file:text-xs file:text-slate-300"
                  />
                  {pdfFile && (
                    <button type="button" onClick={() => setPdfFile(null)} className="text-xs text-rose-400 hover:underline">
                      Remove
                    </button>
                  )}
                </div>
              </div>
            )}

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {messages.length === 0 && (
                <p className="py-6 text-center text-xs text-slate-500">
                  {mode === 'document'
                    ? 'Attach a document above (optional), then ask your question or hit send to get a full review.'
                    : 'Ask anything — the coach will use the context from this tab if available.'}
                </p>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                      m.role === 'user' ? 'bg-emerald-500/15 text-emerald-100' : 'bg-slate-900 text-slate-200'
                    }`}
                  >
                    {m.role === 'assistant' ? (
                      m.display ? <MiniMarkdown text={m.display} /> : <span className="text-slate-500">Thinking…</span>
                    ) : (
                      <span className="whitespace-pre-wrap">{m.display}</span>
                    )}
                  </div>
                </div>
              ))}
              {error && <p className="rounded-lg border border-rose-900/50 bg-rose-950/30 p-2.5 text-xs text-rose-300">{error}</p>}
            </div>

            <div className="border-t border-slate-800 p-3">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message… (Enter to send, Shift+Enter for a new line)"
                  rows={2}
                  className="flex-1 resize-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={busy}
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-40"
                >
                  {busy ? '…' : 'Send'}
                </button>
              </div>
              <p className="mt-2 text-[11px] text-slate-600">
                Not legal or financial advice. Your key and messages go straight from this browser to Anthropic — never through a
                DealCraft server.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
