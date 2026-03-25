'use client';
import { useState, useEffect } from 'react';

export default function CountdownTimer({ endTime, isFinished }: { endTime: number, isFinished: boolean }) {
  const [timeLeft, setTimeLeft] = useState(Math.max(0, endTime - Date.now()));

  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      const remaining = endTime - Date.now();
      if (remaining <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime, isFinished]);

  if (isFinished || timeLeft <= 0) {
    return <span className="text-rose-400 font-bold">Yakunlangan</span>;
  }

  const d = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const h = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const m = Math.floor((timeLeft / 1000 / 60) % 60);
  const s = Math.floor((timeLeft / 1000) % 60);

  return (
    <span className="font-mono font-bold tracking-widest text-indigo-400">
      {d > 0 && `${d}k `}{h.toString().padStart(2, '0')}:{m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}
    </span>
  );
}
