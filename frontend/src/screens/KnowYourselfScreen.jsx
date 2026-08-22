import { AnimatePresence, motion } from 'framer-motion';
import PrimaryButton from '../components/PrimaryButton.jsx';
import { brand } from '../theme/brand.js';

const ease = [0.22, 1, 0.36, 1];
const LETTERS = ['A', 'B', 'C', 'D'];

/**
 * Question step for the Know Yourself assessment.
 * No numerical counters are shown anywhere — only a visual completion
 * percentage. Previous/Next let users revisit and change earlier answers;
 * the chosen option stays highlighted because selection lives in App.
 */
export default function KnowYourselfScreen({
  question,
  answeredCount,
  answeredHere,
  total,
  selected,
  onSelect,
  onNext,
  onPrevious,
  isFirst,
  isLast,
  busy,
}) {
  // Exact completion %: recorded answers, plus the current selection if it
  // adds a newly-answered question.
  const effective = answeredCount + (selected && !answeredHere ? 1 : 0);
  const fillPct = total > 0 ? Math.min(100, Math.round((effective / total) * 100)) : 0;
  const basePct = total > 0 ? Math.round((answeredCount / total) * 100) : 0;

  return (
    <div className="relative flex min-h-screen flex-col px-5 py-7 sm:px-10">
      {/* Logo - Top Left */}
      <motion.div
        className="absolute left-6 top-6 z-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        <img src="/logo.jpg" alt="Business Profit Architects" className="h-12 w-auto object-contain drop-shadow-lg" />
      </motion.div>

      {/* Header */}
      <header className="flex flex-col items-center pt-2 text-center sm:pt-0">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] font-semibold uppercase tracking-[0.32em] text-mist-muted"
        >
          Assessment Progress
        </motion.span>

        {/* Mobile progress bar */}
        <div className="mt-4 w-full max-w-xs sm:hidden">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${brand.mark[0]}, ${brand.accent})` }}
              animate={{ width: `${fillPct}%` }}
              transition={{ duration: 0.6, ease }}
            />
          </div>
          <div className="mt-2 flex justify-center">
            <span key={`m-${fillPct}`} className="font-display text-sm tabular-nums text-mist">
              {basePct}%
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 items-stretch justify-center py-8">
        {/* Vertical progress rail (tablet & up) */}
        <aside className="mr-10 hidden w-16 shrink-0 flex-col items-center gap-3 sm:flex lg:mr-16">
          <div className="relative h-full max-h-[26rem] w-2 overflow-hidden rounded-full bg-white/[0.08]">
            <motion.div
              className="absolute bottom-0 left-0 right-0 rounded-full"
              style={{
                background: `linear-gradient(180deg, ${brand.accent}, ${brand.mark[0]})`,
                boxShadow: `0 0 18px ${brand.accent}55`,
              }}
              animate={{ height: `${fillPct}%` }}
              transition={{ duration: 0.7, ease }}
            />
          </div>
          <motion.span
            key={fillPct}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="font-display text-lg tabular-nums text-mist"
          >
            {basePct}%
          </motion.span>
        </aside>

        {/* Question focus area */}
        <div className="flex w-full max-w-2xl flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={question.questionIndex}
              initial={{ opacity: 0, y: 30, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.99 }}
              transition={{ duration: 0.55, ease }}
              className="flex w-full flex-col items-center"
            >
              <h1 className="mb-9 text-balance text-center font-display text-[1.55rem] font-semibold leading-snug text-mist sm:text-[2.35rem] sm:leading-tight">
                {question.text}
              </h1>

              <div className="w-full space-y-3">
                {question.options.map((opt, i) => {
                  const isSel = selected === opt.optionId;
                  return (
                    <motion.button
                      key={opt.optionId}
                      type="button"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 + i * 0.07, duration: 0.45, ease }}
                      whileHover={!isSel ? { scale: 1.015 } : undefined}
                      whileTap={!isSel ? { scale: 0.985 } : undefined}
                      onClick={() => !busy && onSelect(opt.optionId)}
                      aria-pressed={isSel}
                      className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-all duration-300 sm:gap-5 sm:px-5 sm:py-[1.15rem] ${
                        isSel ? 'bg-white/[0.07]' : 'border-white/[0.12] bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.05]'
                      }`}
                      style={
                        isSel
                          ? {
                              borderColor: brand.accent,
                              boxShadow: `0 0 28px ${brand.accent}33`,
                            }
                          : undefined
                      }
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border font-display text-base font-bold transition-colors duration-300 sm:h-10 sm:w-10 sm:text-lg"
                        style={
                          isSel
                            ? { borderColor: brand.accent, color: brand.accent, background: `${brand.accent}1a` }
                            : { borderColor: 'rgba(255,255,255,0.14)', color: 'rgba(246,247,250,0.65)' }
                        }
                      >
                        {LETTERS[i]}
                      </span>
                      <span className={`flex-1 text-sm leading-relaxed sm:text-base ${isSel ? 'text-mist' : 'text-white/75'}`}>
                        {opt.text}
                      </span>
                      {isSel && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="shrink-0 text-lg"
                          style={{ color: brand.accent }}
                        >
                          ✓
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="mt-8 flex w-full items-center justify-between gap-4">
                {!isFirst ? (
                  <button
                    type="button"
                    onClick={() => !busy && onPrevious()}
                    disabled={busy}
                    className="rounded-xl border border-white/[0.14] bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white/70 transition-colors hover:border-white/30 hover:text-mist disabled:opacity-40"
                  >
                    ← Previous
                  </button>
                ) : (
                  <span />
                )}

                {isLast ? (
                  <PrimaryButton
                    onClick={() => selected && onNext(selected)}
                    disabled={!selected || busy}
                    className="min-w-[12rem]"
                  >
                    {busy ? 'Submitting…' : 'Submit Assessment'}
                  </PrimaryButton>
                ) : (
                  <PrimaryButton
                    onClick={() => selected && onNext(selected)}
                    disabled={!selected || busy}
                    className="min-w-[9rem]"
                  >
                    Next →
                  </PrimaryButton>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
