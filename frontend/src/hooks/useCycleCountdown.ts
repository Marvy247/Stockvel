import { useEffect, useState } from 'react';

export function useCycleCountdown(cycleStart: bigint, cycleDuration: bigint) {
  const endsAt = Number(cycleStart + cycleDuration) * 1000;
  const [remaining, setRemaining] = useState(endsAt - Date.now());

  useEffect(() => {
    const id = setInterval(() => setRemaining(endsAt - Date.now()), 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  const s = Math.max(0, Math.floor(remaining / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;

  return {
    expired: remaining <= 0,
    formatted: `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`,
  };
}
