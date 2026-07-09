export function FieldLabel({ children, hint }) {
  return (
    <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-400">
      {children}
      {hint && <span className="text-slate-600" title={hint}>ⓘ</span>}
    </label>
  );
}

export function NumberInput({ value, onChange, min, max, step = 1, suffix, className = '' }) {
  return (
    <div className={`flex items-center rounded-lg border border-slate-700 bg-slate-950 px-2.5 focus-within:border-emerald-500 ${className}`}>
      <input
        type="number"
        value={Number.isFinite(value) ? value : ''}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
        className="w-full bg-transparent py-2 text-sm text-slate-100 outline-none tabular-nums"
      />
      {suffix && <span className="ml-1 shrink-0 text-xs text-slate-500">{suffix}</span>}
    </div>
  );
}

export function TextInput({ value, onChange, placeholder, className = '' }) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500 ${className}`}
    />
  );
}

export function SelectInput({ value, onChange, options, className = '' }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500 ${className}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <span className="flex items-center gap-2 text-sm text-slate-300">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        className={`relative h-5 w-9 shrink-0 rounded-full transition ${checked ? 'bg-emerald-500' : 'bg-slate-700'}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`}
        />
      </button>
      {label}
    </span>
  );
}

export function SegmentedControl({ value, onChange, options }) {
  return (
    <div className="inline-flex rounded-lg border border-slate-700 bg-slate-950 p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
            value === opt.value ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
