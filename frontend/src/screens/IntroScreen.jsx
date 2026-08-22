import { motion } from 'framer-motion';
import PrimaryButton from '../components/PrimaryButton.jsx';
import { brand } from '../theme/brand.js';

const ease = [0.22, 1, 0.36, 1];
const six = brand.mark;

// Premium White Shades
const premiumWhite = {
  bright: '#FFFFFF',
  soft: '#F8F6F0',
  warm: '#F5F0E8',
};

export default function IntroScreen({ onBegin }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-12 bg-gradient-to-b from-[#0a0a0f] to-[#14141e]">
      {/* Top gradient line */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${brand.palette.blue[500]}, ${brand.palette.yellow[500]}, ${brand.palette.purple[500]}, transparent)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.4 }}
      />

      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-3xl" />
      </div>

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

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* H1 - Hero Title - Premium */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
          className="font-display max-w-4xl text-center text-4xl font-bold leading-tight sm:text-6xl md:text-[4.25rem] -mt-8 tracking-[-0.02em]"
          style={{ color: premiumWhite.bright }}
        >
          Are you a Business Owner
          <span className="block font-display font-semibold" style={{ color: premiumWhite.soft }}>
            / Decision Maker?
          </span>
        </motion.h1>

        {/* Body - Premium */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.38, ease }}
          className="font-display mt-9 max-w-md text-center text-base leading-relaxed sm:text-lg"
          style={{ color: premiumWhite.warm }}
        >
          Let's understand your business in 30 seconds.
        </motion.p>

        {/* Button - Matching YES/NO size */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease }}
          className="mt-10"
        >
          <PrimaryButton 
            onClick={onBegin} 
            className="font-display min-w-[8rem] px-6 py-2.5 text-xl font-bold tracking-[0.05em]"
          >
            Let's Begin
          </PrimaryButton>
        </motion.div>

        {/* Spacer */}
        <div className="h-10" />

        {/* Animated Dots */}
        <motion.div
          className="flex items-center gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {six.map((c, i) => (
            <motion.div
              key={i}
              className="relative"
              initial={{ y: -50, opacity: 0, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{
                delay: 1 + i * 0.1,
                duration: 0.7,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
            >
              <div
                className="h-5 w-5 rounded-full shadow-xl transition-transform duration-300 hover:scale-125 cursor-pointer"
                style={{ 
                  background: c,
                  boxShadow: `0 4px 20px ${c}60`
                }}
              />
              <motion.div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-8 rounded-full bg-black/20 blur-sm"
                initial={{ scaleX: 0.3, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{
                  delay: 1 + i * 0.1,
                  duration: 0.5,
                  ease: "easeOut"
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Text - Premium */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="font-display mt-8 text-[13px] font-medium uppercase tracking-[0.3em]"
          style={{ color: premiumWhite.soft }}
        >
          Three questions · One clear picture
        </motion.p>
      </div>
    </div>
  );
}