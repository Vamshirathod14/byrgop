import { motion } from 'framer-motion';
import PrimaryButton from '../components/PrimaryButton.jsx';
import { brand } from '../theme/brand.js';

const ease = [0.22, 1, 0.36, 1];

function bandColor(band) {
  if (band === 'STRONG FOUNDATION') return '#4ade80';
  if (band === 'MODERATE PERFORMANCE') return '#facc15';
  if (band === 'SIGNIFICANT GAPS') return '#fb923c';
  return '#f87171';
}

/* ── Radar / spider chart (six axes) ────────────────────── */
const CX = 130;
const CY = 122;
const R = 84;

function polar(angleDeg, radius) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [CX + radius * Math.cos(a), CY + radius * Math.sin(a)];
}

function labelLines(name) {
  const words = name.split(' ');
  if (words.length <= 2) return words;
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}

function RadarChart({ categories }) {
  const n = categories.length;
  const step = 360 / n;
  const point = (i, value) => polar(i * step, (R * value) / 100);

  const shape = categories.map((c, i) => point(i, c.percent).join(',')).join(' ');

  return (
    <svg viewBox="0 0 260 248" className="mx-auto h-auto w-full max-w-[340px]" role="img" aria-label="Six-category business health radar">
      {/* rings */}
      {[25, 50, 75, 100].map((ring) => (
        <polygon
          key={ring}
          points={categories.map((_, i) => polar(i * step, (R * ring) / 100).join(',')).join(' ')}
          fill="none"
          stroke="rgba(255,255,255,0.09)"
          strokeWidth={1}
        />
      ))}
      {/* axes */}
      {categories.map((c, i) => {
        const [x, y] = polar(i * step, R);
        return <line key={c.key} x1={CX} y1={CY} x2={x} y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />;
      })}
      {/* cobweb polygon */}
      <motion.polygon
        points={shape}
        fill={`${brand.accent}26`}
        stroke={brand.accent}
        strokeWidth={2}
        strokeLinejoin="round"
        initial={{ opacity: 0, scale: 0.55 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
        transition={{ duration: 1, delay: 0.35, ease }}
      />
      {/* vertices */}
      {categories.map((c, i) => {
        const [x, y] = point(i, c.percent);
        return (
          <motion.circle
            key={`dot-${c.key}`}
            cx={x}
            cy={y}
            r={3.4}
            fill={c.color || brand.accent}
            stroke="#0a0a0f"
            strokeWidth={1.5}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{ transformOrigin: `${x}px ${y}px` }}
            transition={{ delay: 0.9 + i * 0.06, duration: 0.3 }}
          />
        );
      })}
      {/* labels */}
      {categories.map((c, i) => {
        const a = ((i * step - 90) * Math.PI) / 180;
        const lx = CX + (R + 20) * Math.cos(a);
        const ly = CY + (R + 20) * Math.sin(a);
        const anchor = Math.abs(Math.cos(a)) < 0.35 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end';
        const lines = labelLines(c.name);
        return (
          <text key={`lbl-${c.key}`} x={lx} y={ly} textAnchor={anchor} className="fill-white/60" style={{ fontSize: 8.6, letterSpacing: '0.04em' }}>
            {lines.map((ln, li) => (
              <tspan key={li} x={lx} dy={li === 0 ? (lines.length > 1 ? -2 : 2.5) : 10}>
                {ln}
              </tspan>
            ))}
          </text>
        );
      })}
    </svg>
  );
}

/* ── Circular overall score indicator ───────────────────── */
function ScoreRing({ percent, size = 190, label = 'Overall' }) {
  const color = bandColor(percent >= 80 ? 'STRONG FOUNDATION' : percent >= 63 ? 'MODERATE PERFORMANCE' : percent >= 44 ? 'SIGNIFICANT GAPS' : '');
  const r = 85;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <circle cx={100} cy={100} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={12} />
        <motion.circle
          cx={100}
          cy={100}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - percent / 100) }}
          transition={{ duration: 1.5, delay: 0.4, ease }}
          transform="rotate(-90 100 100)"
          style={{ filter: `drop-shadow(0 0 12px ${color}66)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] uppercase tracking-[0.25em] text-mist-muted">{label}</span>
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="font-display text-5xl font-bold tabular-nums text-mist"
        >
          {percent}
          <span className="text-2xl">%</span>
        </motion.span>
      </div>
    </div>
  );
}

function ContextChips({ businessTypeLabel, domainLabel }) {
  if (!businessTypeLabel && !domainLabel) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {businessTypeLabel && (
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium text-white/75">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: brand.mark[0] }} />
          {businessTypeLabel}
        </span>
      )}
      {domainLabel && (
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium text-white/75">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: brand.mark[3] }} />
          {domainLabel}
        </span>
      )}
    </div>
  );
}

/* ── Main ───────────────────────────────────────────────── */
export default function KnowYourselfResult({ result, sessionId, onExplore }) {
  const data = result?.result;
  const isV2 = !!data?.version && Array.isArray(data.categories);

  /* Legacy sessions (pre-redesign): simple readable summary. */
  if (!isV2) {
    const score = data?.score ?? 0;
    const maxScore = data?.maxScore ?? 80;
    const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
        <ContextChips businessTypeLabel={result.businessTypeLabel} domainLabel={result.domainLabel || data?.domainLabel} />
        <h1 className="font-display mt-8 text-center text-4xl font-semibold text-mist">
          Business <span className="italic" style={{ color: brand.accent }}>Assessment</span>
        </h1>
        <div className="mt-10 flex flex-col items-center">
          <ScoreRing percent={pct} label="Score" />
          <h2 className="font-display mt-6 text-2xl font-bold uppercase tracking-[0.12em]" style={{ color: bandColor(data?.band) }}>
            {data?.band}
          </h2>
          <p className="mt-2 max-w-md text-center text-sm leading-relaxed text-mist-muted">{data?.message}</p>
        </div>
        <p className="mt-8 text-xs text-mist-muted/60">Earlier assessment format — take a new assessment for a full six-dimension analysis.</p>
        <div className="mt-10">
          <PrimaryButton onClick={onExplore} className="min-w-[13rem]">Explore BYRGOP</PrimaryButton>
        </div>
      </div>
    );
  }

  const cats = data.categories;

  return (
    <div className="flex min-h-screen flex-col px-5 pb-16 pt-20 sm:px-10">
      {/* Header */}
      <header className="flex flex-col items-center text-center">
        <span className="text-[10px] uppercase tracking-[0.32em] text-mist-muted">{brand.tagline}</span>
        <h1 className="font-display mt-2 text-3xl font-semibold uppercase tracking-wide text-mist sm:text-5xl">
          Business <span className="italic normal-case" style={{ color: brand.accent }}>Health</span> Score
        </h1>
        <div className="mt-5">
          <ContextChips
            businessTypeLabel={result.businessTypeLabel || data.businessTypeLabel}
            domainLabel={result.domainLabel || data.domainLabel}
          />
        </div>
      </header>

      {/* Overall score + radar */}
      <div className="mx-auto mt-8 grid w-full max-w-4xl gap-8 md:grid-cols-[auto_1fr] md:items-center">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="flex flex-col items-center"
        >
          <ScoreRing percent={data.overallPercent} />
          <h2 className="font-display mt-4 text-lg font-bold uppercase tracking-[0.12em]" style={{ color: bandColor(data.band) }}>
            {data.band}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-6"
        >
          <RadarChart categories={cats} />
        </motion.div>
      </div>

      {/* Six category scores */}
      <div className="mx-auto mt-8 grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {cats.map((c, i) => (
          <motion.div
            key={c.key}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.08, duration: 0.5, ease }}
            className="overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.03]"
          >
            <div className="h-1 w-full" style={{ background: c.color }} />
            <div className="px-4 py-3.5 sm:px-5">
              <p className="truncate text-xs font-medium text-mist-muted">{c.name}</p>
              <p className="font-display mt-1 text-2xl font-bold tabular-nums text-mist sm:text-3xl">
                {c.percent}
                <span className="text-base">%</span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Primary insight — driven by the lowest category score */}
      {data.priority && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.65, ease }}
          className="mx-auto mt-6 w-full max-w-4xl overflow-hidden rounded-2xl border px-6 py-5 sm:px-8"
          style={{ borderColor: `${data.priority.color}40`, background: `${data.priority.color}0d` }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.24em]" style={{ color: `${data.priority.color}cc` }}>
            Primary area to strengthen
          </span>
          <p className="font-display mt-1.5 text-xl font-semibold text-mist sm:text-2xl">{data.priority.name}</p>
          <p className="mt-0.5 text-sm tabular-nums" style={{ color: data.priority.color }}>
            {data.priority.percent}% · {data.priority.score} of {data.priority.maxScore} points
          </p>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-mist-muted">
            Focusing here offers the greatest opportunity to lift your overall business health.
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.3, ease }}
        className="mt-12 flex flex-col items-center"
      >
        <PrimaryButton onClick={onExplore} className="min-w-[13rem]">
          Explore BYRGOP
        </PrimaryButton>
      </motion.div>
    </div>
  );
}
