import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sector } from 'recharts';
import PrimaryButton from '../components/PrimaryButton.jsx';
import { brand } from '../theme/brand.js';

const ease = [0.22, 1, 0.36, 1];
const six = brand.mark;

function HoverPopup({ data }) {
  if (!data) return null;
  return (
    <motion.div
      key={data.categoryKey}
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.25, ease }}
      className="pointer-events-none absolute left-1/2 top-2 z-10 w-72 -translate-x-1/2 rounded-2xl border bg-ink-950/95 p-4 shadow-card backdrop-blur-md"
      style={{ borderColor: `${data.displayColor}44` }}
    >
      <div className="flex items-center justify-between">
        <span className="font-display text-lg font-semibold" style={{ color: data.displayColor }}>
          {data.categoryName}
        </span>
        <span className="font-display text-2xl font-bold text-mist">{data.score}%</span>
      </div>
      {data.stage && (
        <p
          className="mt-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em]"
          style={{ color: data.stage.color }}
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: data.stage.color, boxShadow: `0 0 8px ${data.stage.color}88` }}
          />
          BYRGOP stage · {data.stage.name}
        </p>
      )}
      <div className="mt-2 flex items-center gap-2 text-[11px]">
        <span className="rounded-full border px-2 py-0.5 font-semibold" style={{ borderColor: `${data.color}44`, color: data.color }}>
          Earned {data.earned} / {data.possible}
        </span>
        <span className="text-mist-muted">
          contributes {data.contribution}% of your overall result
        </span>
      </div>
      {data.title && (
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: brand.accent }}>
          {data.title}
        </p>
      )}
      {data.interpretation && (
        <p className="mt-2 text-xs leading-relaxed text-mist-muted">{data.interpretation}</p>
      )}
      {data.recommendations && data.recommendations.length > 0 && (
        <ul className="mt-3 space-y-1">
          {data.recommendations.map((r, i) => (
            <li key={i} className="flex gap-2 text-[11px] leading-snug text-mist-muted">
              <span style={{ color: data.displayColor }}>◆</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

export default function ResultScreen({ result, onKY }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const totalPossible = result?.overallPossible || 0;
  const data = (result?.scores || []).map((s) => {
    const earned = s.earned ?? 0;
    return {
      categoryKey: s.categoryKey,
      categoryName: s.categoryName,
      earned,
      possible: s.possible ?? 0,
      score: s.score ?? 0,
      hasScore: s.hasScore,
      color: s.color,
      stage: s.stage || null,
      displayColor: s.stage?.color || s.color,
      title: s.content?.title,
      interpretation: s.content?.interpretation,
      recommendations: s.content?.recommendations || [],
      contribution: totalPossible > 0 ? Math.round((earned / totalPossible) * 100) : 0,
    };
  });

  const active = activeIndex != null ? data[activeIndex] : null;
  const timedOut = result?.totalTimedOut || 0;

  return (
    <div className="flex min-h-screen flex-col px-6 py-7 sm:px-10">
      {/* Logo - Top Left */}
      <motion.div
        className="absolute top-6 left-6 z-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        <img
          src="/logo.jpg"
          alt="Business Profit Architects"
          className="h-12 w-auto object-contain drop-shadow-lg"
        />
      </motion.div>

      {/* Telugu & Hindi - Top Right */}
      <motion.div
        className="absolute top-6 right-6 z-10 flex flex-col items-end gap-0.5"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        <motion.span
          className="text-lg font-semibold tracking-wider leading-none"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.span
            className="inline-block"
            animate={{
              color: six,
              transition: {
                duration: 6,
                repeat: Infinity,
                ease: "linear"
              }
            }}
          >
            బిర్ గాప్
          </motion.span>
        </motion.span>
        <motion.span
          className="text-lg font-semibold tracking-wider leading-none"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.span
            className="inline-block"
            animate={{
              color: six,
              transition: {
                duration: 6,
                repeat: Infinity,
                ease: "linear",
                delay: 1
              }
            }}
          >
            बिरगाप
          </motion.span>
        </motion.span>
      </motion.div>

      {/* Header - Top Center */}
      <header className="flex items-center justify-center">
        <span className="text-[10px] uppercase tracking-[0.28em] text-mist-muted">
          Diagnostic complete
        </span>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center py-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="flex flex-col items-center"
        >
          <span className="mb-3 text-[11px] uppercase tracking-[0.3em] text-mist-muted">
            {brand.tagline}
          </span>
          <h1 className="font-display text-center text-4xl font-semibold text-mist sm:text-5xl">
            Your Business <span className="italic" style={{ color: brand.accent }}>Snapshot</span>
          </h1>
          <p className="mt-3 max-w-xl text-center text-sm leading-relaxed text-mist-muted">
            Three dimensions, weighted and scored by BYRGOP&rsquo;s methodology. Your answers
            resolve each dimension to its current BYRGOP stage — hover a segment to read the
            consultant&rsquo;s take on that area.
          </p>
          {timedOut > 0 && (
            <p className="mt-2 text-xs text-red-400">
              {timedOut} question{timedOut > 1 ? 's were' : ' was'} timed out and replaced during
              this assessment.
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease }}
          className="relative mt-9 w-full max-w-lg"
        >
          <div className="relative h-72 w-full sm:h-80">
            <div className="flex h-full w-full items-center justify-center">
              <motion.svg
                viewBox="0 0 300 300"
                className="h-60 w-60 sm:h-72 sm:w-72"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.35, ease }}
                style={{ overflow: 'visible' }}
              >
                {data.map((d, i) => {
                  const center = i * 120;
                  const start = center - 60 + 3;
                  const end = center + 60 - 3;
                  const span = end - start;
                  const frac =
                    d.possible > 0 ? Math.max(0, Math.min(1, d.earned / d.possible)) : 0;
                  const fillEnd = start + span * frac;
                  return (
                    <g
                      key={d.categoryKey}
                      onMouseEnter={() => setActiveIndex(i)}
                      onMouseLeave={() => setActiveIndex(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Sector
                        cx={150}
                        cy={150}
                        innerRadius={88}
                        outerRadius={124}
                        startAngle={start}
                        endAngle={end}
                        fill={d.displayColor}
                        style={{
                          transition: 'filter 0.3s ease',
                          filter:
                            activeIndex === i ? `drop-shadow(0 0 16px ${d.displayColor}88)` : 'none',
                        }}
                      />
                      {frac > 0 && (
                        <Sector
                          cx={150}
                          cy={150}
                          innerRadius={88}
                          outerRadius={124}
                          startAngle={start}
                          endAngle={fillEnd}
                          fill={d.displayColor}
                          cornerRadius={7}
                          style={{
                            transition: 'filter 0.3s ease',
                            filter:
                              activeIndex === i ? `drop-shadow(0 0 16px ${d.displayColor}88)` : 'none',
                          }}
                        />
                      )}
                    </g>
                  );
                })}
              </motion.svg>
            </div>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase tracking-[0.25em] text-mist-muted">Overall</span>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6, ease }}
                className="font-display text-5xl font-bold text-mist"
              >
                {result.overallPct}%
              </motion.span>
            </div>
            <AnimatePresence>
              <HoverPopup data={active} />
            </AnimatePresence>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {data.map((d, i) => (
              <button
                key={d.categoryKey}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                className="group flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 transition-colors hover:border-white/25"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full transition-transform group-hover:scale-125"
                    style={{ background: d.displayColor, boxShadow: `0 0 10px ${d.displayColor}66` }}
                  />
                  <span className="text-sm font-medium text-mist">{d.categoryName}</span>
                </span>
                {d.stage ? (
                  <span
                    className="text-[11px] font-semibold uppercase tracking-[0.12em]"
                    style={{ color: d.stage.color }}
                  >
                    {d.stage.name}
                  </span>
                ) : (
                  <span className="text-[11px] uppercase tracking-[0.12em] text-mist-muted/50">
                    no stage
                  </span>
                )}
                <span className="text-[11px] tabular-nums text-mist-muted">
                  {d.earned}/{d.possible} pts · {d.contribution}% of total
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Question Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease }}
          className="mt-12 flex flex-col items-center"
        >
          <h2 className="font-display text-2xl font-semibold text-white text-center sm:text-3xl">
            Know more about ?
          </h2>
          <p className="mt-2 text-sm text-white/50 text-center">
            Choose an option below to continue your journey
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease }}
          className="mt-6 flex flex-col items-center gap-3 sm:flex-row"
        >
          <PrimaryButton onClick={onKY} className="min-w-[13rem]">
            Your Business
          </PrimaryButton>
          <PrimaryButton
            variant="dark"
            onClick={() => window.open('#', '_blank')}
            className="min-w-[13rem]"
          >
            BYRGOP
          </PrimaryButton>
        </motion.div>
      </div>
    </div>
  );
}