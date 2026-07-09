export function formatUSD(value, { compact = false } = {}) {
  if (!Number.isFinite(value)) return '$0';
  const abs = Math.abs(value);
  if (compact) {
    if (abs >= 1_000_000_000) return `${value < 0 ? '-' : ''}$${(abs / 1_000_000_000).toFixed(2)}B`;
    if (abs >= 1_000_000) return `${value < 0 ? '-' : ''}$${(abs / 1_000_000).toFixed(2)}M`;
    if (abs >= 1_000) return `${value < 0 ? '-' : ''}$${(abs / 1_000).toFixed(0)}K`;
  }
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
}

export function formatPct(value, digits = 1) {
  if (!Number.isFinite(value)) return '0%';
  return `${value.toFixed(digits)}%`;
}

export function formatMultiple(value) {
  if (!Number.isFinite(value)) return '0x';
  return `${Number(value.toFixed(2))}x`;
}
