import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Timer from '../components/Timer.jsx';
import PrimaryButton from '../components/PrimaryButton.jsx';
import { brand } from '../theme/brand.js';

const ease = [0.22, 1, 0.36, 1];
const six = brand.mark;

// Premium White Shades (same as IntroScreen)
const premiumWhite = {
  bright: '#FFFFFF',
  soft: '#F8F6F0',
  warm: '#F5F0E8',
};

function matchOption(question, prefix) {
  return (question.options || []).find((o) =>
    String(o.text).trim().toLowerCase().startsWith(prefix)
  );
}

export default function QuestionScreen({ question, index, total, onAnswer, onTimeout, onRestart }) {
  const [secondsLeft, setSecondsLeft] = useState(question.timeoutSeconds);
  const [selected, setSelected] = useState(null);
  const [tick, setTick] = useState(0);

  // Premium Gold Color - #c68505
  const goldColor = '#c68505';

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
      // Go back to intro page when timer hits zero
      if (onRestart) {
        onRestart();
      }
    }
  }, [secondsLeft, tick, selected, onRestart]);

  const handleSelect = (optionId) => {
    if (selected || optionId == null) return;
    setSelected(optionId);
    setTimeout(() => onAnswer(optionId), 380);
  };

  return (
    <div className="flex min-h-screen flex-col px-6 py-7 sm:px-10 bg-gradient-to-b from-[#0a0a0f] to-[#14141e]">
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

      {/* Telugu & Hindi - Top Right - Premium White - No Color Cycling */}
      <motion.div
        className="absolute top-6 right-6 z-10 flex flex-col items-end gap-0.5"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        <motion.span
          className="font-display text-lg font-semibold tracking-wider leading-none"
          style={{ color: premiumWhite.bright }}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          బిర్ గాప్
        </motion.span>
        <motion.span
          className="font-display text-lg font-semibold tracking-wider leading-none"
          style={{ color: premiumWhite.bright }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          बिरगाप
        </motion.span>
      </motion.div>

      {/* Progress Bar - Top Center */}
      <header className="flex items-center justify-center pt-2">
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
                <Timer 
                  secondsLeft={secondsLeft} 
                  total={question.timeoutSeconds} 
                  color={goldColor}
                />
              </div>

              {/* Question Text */}
              <h1 
                className="font-display max-w-2xl text-balance text-center text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-5xl tracking-[-0.02em]"
                style={{ color: premiumWhite.bright }}
              >
                {question.text}
              </h1>

              {/* YES/NO Buttons - Smaller size, larger text */}
              <div className="mt-12 flex w-full max-w-md flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5, ease }}
                  className="w-full sm:w-auto"
                >
                  <PrimaryButton
                    onClick={() => handleSelect(yesOption?.optionId)}
                    disabled={!!selected}
                    className={`font-display w-full sm:min-w-[8rem] px-6 py-2.5 text-xl font-bold tracking-[0.05em] ${
                      selected === yesOption?.optionId ? 'ring-2 ring-white/50' : ''
                    }`}
                  >
                    {selected === yesOption?.optionId ? '✓' : ''} YES
                  </PrimaryButton>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5, ease }}
                  className="w-full sm:w-auto"
                >
                  <PrimaryButton
                    onClick={() => handleSelect(noOption?.optionId)}
                    disabled={!!selected}
                    className={`font-display w-full sm:min-w-[8rem] px-6 py-2.5 text-xl font-bold tracking-[0.05em] ${
                      selected === noOption?.optionId ? 'ring-2 ring-white/50' : ''
                    }`}
                  >
                    {selected === noOption?.optionId ? '✓' : ''} NO
                  </PrimaryButton>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}