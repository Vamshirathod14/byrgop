const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function Timer({ secondsLeft, total, color = '#FCA700' }) {
  const fraction = Math.max(0, Math.min(1, secondsLeft / total));
  const low = secondsLeft <= 10;
  const stroke = low ? '#E52032' : color;

  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <div
        className="absolute inset-0 rounded-full blur-md"
        style={{ background: `${stroke}22`, transition: 'background 0.5s' }}
      />
      <svg width="96" height="96" viewBox="0 0 120 120" className="-rotate-90">
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="5"
        />
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          stroke={stroke}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-display text-3xl font-semibold tabular-nums"
          style={{ color: stroke, transition: 'color 0.5s' }}
        >
          {String(Math.max(0, secondsLeft)).padStart(2, '0')}
        </span>
        <span className="text-[9px] uppercase tracking-[0.22em] text-mist-muted">seconds</span>
      </div>
    </div>
  );
}
