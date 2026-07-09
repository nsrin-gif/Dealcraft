import { useEffect, useRef, useState } from 'react';
import { formatUSD } from '../lib/format';

export default function AnimatedNumber({ value, compact = false, className = '' }) {
  const [display, setDisplay] = useState(value);
  const frame = useRef(null);
  const from = useRef(value);

  useEffect(() => {
    const start = performance.now();
    const startValue = from.current;
    const duration = 450;

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(startValue + (value - startValue) * eased);
      if (t < 1) {
        frame.current = requestAnimationFrame(tick);
      } else {
        from.current = value;
      }
    }
    frame.current = requestAnimationFrame(tick);
    return () => frame.current && cancelAnimationFrame(frame.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span className={`tabular-nums ${className}`}>{formatUSD(display, { compact })}</span>;
}
