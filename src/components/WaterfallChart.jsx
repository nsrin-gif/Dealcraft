import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { buildBridgeSteps } from '../lib/buildBridgeSteps';
import { formatUSD } from '../lib/format';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const step = payload[0].payload;
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-slate-200">{step.name}</p>
      <p className={step.display < 0 ? 'text-rose-400' : 'text-emerald-400'}>
        {step.display < 0 ? '−' : ''}
        {formatUSD(Math.abs(step.display))}
      </p>
    </div>
  );
}

export default function WaterfallChart({ result }) {
  const steps = buildBridgeSteps(result);

  return (
    <div className="h-[380px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={steps} margin={{ top: 10, right: 10, left: 10, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            angle={-35}
            textAnchor="end"
            interval={0}
            height={70}
          />
          <YAxis tickFormatter={(v) => formatUSD(v, { compact: true })} tick={{ fill: '#94a3b8', fontSize: 11 }} width={70} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
          <Bar dataKey="base" stackId="bridge" fill="transparent" isAnimationActive={true} />
          <Bar dataKey="value" stackId="bridge" radius={[3, 3, 0, 0]} isAnimationActive={true} animationDuration={500}>
            {steps.map((s, i) => (
              <Cell key={i} fill={s.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
