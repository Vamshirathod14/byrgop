import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { brand } from '../theme/brand.js';

const ease = [0.22, 1, 0.36, 1];

export default function KnowYourselfScreen({ question, index, total, onAnswer }) {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelected(null);
  }, [question.questionIndex]);

  const handleSelect = (optionId) => {
    if (selected || optionId == null) return;
    setSelected(optionId);
    setTimeout(() => onAnswer(optionId), 380);
  };

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
              color: brand.mark,
              transition: { duration: 6, repeat: Infinity, ease: 'linear' },
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
              color: brand.mark,
              transition: { duration: 6, repeat: Infinity, ease: 'linear', delay: 1 },
            }}
          >
            बिरगाप
          </motion.span>
        </motion.span>
      </motion.div>

      {/* Progress Bar - Top Center */}
      <header className="flex items-center justify-center">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-mist-muted">
            Question {index + 1} of {total}
          </span>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center py-10">
        <div className="flex w-full max-w-2xl flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={question.questionIndex}
              initial={{ opacity: 0, y: 34, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.99 }}
              transition={{ duration: 0.6, ease }}
              className="flex w-full flex-col items-center"
            >
              <h1 className="mb-10 font-display max-w-2xl text-balance text-center text-3xl font-semibold leading-snug text-mist sm:text-[2.6rem] sm:leading-tight">
                {question.text}
              </h1>

              <div className="grid w-full max-w-lg grid-cols-2 gap-4">
                {question.options.map((opt, i) => (
                  <motion.button
                    key={opt.optionId}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.08, duration: 0.5, ease }}
                    whileHover={{ scale: selected ? 1 : 1.03 }}
                    whileTap={{ scale: selected ? 1 : 0.97 }}
                    onClick={() => handleSelect(opt.optionId)}
                    disabled={!!selected}
                    className="relative flex items-center justify-center overflow-hidden rounded-2xl border py-7 font-display text-xl font-semibold tracking-wide transition-colors duration-300 sm:text-2xl"
                    style={{
                      borderColor:
                        selected === opt.optionId
                          ? brand.accent
                          : 'rgba(255,255,255,0.12)',
                      background:
                        selected === opt.optionId
                          ? `linear-gradient(135deg, ${brand.accent}38, transparent)`
                          : 'rgba(255,255,255,0.03)',
                      color:
                        selected === opt.optionId
                          ? brand.accent
                          : 'rgba(246,247,250,0.72)',
                      boxShadow:
                        selected === opt.optionId
                          ? `0 0 28px ${brand.accent}44`
                          : 'none',
                    }}
                  >
                    {selected === opt.optionId && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute right-5 text-xl"
                        style={{ color: brand.accent }}
                      >
                        ✓
                      </motion.span>
                    )}
                    {opt.text}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
