import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BrandLockup from '../components/BrandLockup.jsx';
import Timer from '../components/Timer.jsx';
import { brand } from '../theme/brand.js';

const ease = [0.22, 1, 0.36, 1];

function matchOption(question, prefix) {
  return (question.options || []).find((o) =>
    String(o.text).trim().toLowerCase().startsWith(prefix)
  );
}

export default function QuestionScreen({ question, index, total, onAnswer, onTimeout }) {
  const [secondsLeft, setSecondsLeft] = useState(question.timeoutSeconds);
  const [selected, setSelected] = useState(null);
  const [tick, setTick] = useState(0);

  const cat = brand.categories[question.category] || {
    name: question.category,
    color: brand.palette.blue[500],
    soft: brand.palette.blue[500] + '22',
  };

  const yesOption = matchOption(question, 'yes') || question.options?.[0];
  const noOption = matchOption(question, 'no') || question.options?.[1];

  useEffect(() => {
    setSecondsLeft(question.timeoutSeconds);
    setSelected(null);
    setTick(0);
    const timer = setInterval(() => {
      const elapsed = (Date.now() - new Date(question.startedAt).getTime()) / 1000;
      setSecondsLeft(Math.max(0, Math.ceil(question.timeoutSeconds - elapsed)));
    }, 500);
    return () => clearInterval(timer);
  }, [question.questionId, question.startedAt, question.timeoutSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0 && tick === 0 && !selected) {
      setTick(1);
      onTimeout?.();
    }
  }, [secondsLeft, tick, selected, onTimeout]);

  const handleSelect = (optionId) => {
    if (selected || optionId == null) return;
    setSelected(optionId);
    setTimeout(() => onAnswer(optionId), 380);
  };

  const answerButton = (label, option, tone, delay) => (
    <motion.button
      key={label}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease }}
      whileHover={{ scale: selected ? 1 : 1.03 }}
      whileTap={{ scale: selected ? 1 : 0.97 }}
      onClick={() => handleSelect(option?.optionId)}
      disabled={!!selected}
      className="relative flex items-center justify-center overflow-hidden rounded-2xl border py-7 font-display text-2xl font-semibold uppercase tracking-[0.14em] transition-colors duration-300 sm:text-3xl"
      style={{
        borderColor:
          selected === option?.optionId ? cat.color : tone === 'yes' ? `${cat.color}66` : 'rgba(255,255,255,0.12)',
        background:
          selected === option?.optionId
            ? `linear-gradient(135deg, ${cat.color}38, transparent)`
            : tone === 'yes'
              ? `${cat.color}12`
              : 'rgba(255,255,255,0.03)',
        color: selected === option?.optionId ? cat.color : tone === 'yes' ? cat.color : 'rgba(246,247,250,0.72)',
        boxShadow: selected === option?.optionId ? `0 0 28px ${cat.color}44` : 'none',
      }}
    >
      {selected === option?.optionId && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute right-5 text-xl"
          style={{ color: cat.color }}
        >
          ✓
        </motion.span>
      )}
      {label}
    </motion.button>
  );

  return (
    <div className="flex min-h-screen flex-col px-6 py-7 sm:px-10">
      <header className="flex items-center justify-between">
        <BrandLockup markHeight={40} showTagline={false} showBilingual={false} />
        <div className="flex items-center gap-2">
          {brand.steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <span
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i < index ? 'w-8' : i === index ? 'w-10' : 'w-6'
                }`}
                style={{
                  background:
                    i < index ? s.color : i === index ? s.color : 'rgba(255,255,255,0.12)',
                  opacity: i > index ? 0.35 : 1,
                  boxShadow: i <= index ? `0 0 12px ${s.color}66` : 'none',
                }}
              />
              {i < total - 1 && <span className="h-px w-2 bg-white/10" />}
            </div>
          ))}
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center py-10">
        <div className="flex w-full max-w-2xl flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={question.questionId}
              initial={{ opacity: 0, y: 34, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.99 }}
              transition={{ duration: 0.6, ease }}
              className="flex w-full flex-col items-center"
            >
              <div className="mb-10">
                <Timer secondsLeft={secondsLeft} total={question.timeoutSeconds} color={cat.color} />
              </div>

              <h1 className="font-display max-w-2xl text-balance text-center text-3xl font-semibold leading-snug text-mist sm:text-[2.6rem] sm:leading-tight">
                {question.text}
              </h1>

              <div className="mt-12 grid w-full max-w-lg grid-cols-2 gap-4">
                {answerButton('YES', yesOption, 'yes', 0.15)}
                {answerButton('NO', noOption, 'no', 0.25)}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
