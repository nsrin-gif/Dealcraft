// Minimal markdown rendering for coach replies: ## headers, **bold**, "- " bullet
// lists, paragraphs. Deliberately not a full markdown library — the system
// prompt constrains the model to this small subset, so a full parser would be
// unused weight.

function renderInline(text, keyPrefix) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

export default function MiniMarkdown({ text }) {
  const lines = text.split('\n');
  const blocks = [];
  let listBuffer = [];

  function flushList(key) {
    if (listBuffer.length > 0) {
      blocks.push(
        <ul key={`ul-${key}`} className="my-1.5 list-disc space-y-1 pl-5">
          {listBuffer.map((item, i) => (
            <li key={i}>{renderInline(item, `li-${key}-${i}`)}</li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  }

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      listBuffer.push(trimmed.slice(2));
      return;
    }
    flushList(i);
    if (trimmed.startsWith('## ')) {
      blocks.push(
        <p key={i} className="mt-2 text-sm font-semibold text-slate-100 first:mt-0">
          {renderInline(trimmed.slice(3), `h-${i}`)}
        </p>
      );
    } else if (trimmed.length > 0) {
      blocks.push(
        <p key={i} className="leading-relaxed">
          {renderInline(trimmed, `p-${i}`)}
        </p>
      );
    }
  });
  flushList('end');

  return <div className="space-y-1.5">{blocks}</div>;
}
