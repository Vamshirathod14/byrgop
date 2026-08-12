import { motion } from 'framer-motion';
import BrandLockup from '../components/BrandLockup.jsx';
import PrimaryButton from '../components/PrimaryButton.jsx';
import { brand } from '../theme/brand.js';

const ease = [0.22, 1, 0.36, 1];
const six = brand.mark;

export default function IntroScreen({ onBegin }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16">
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${brand.palette.blue[500]}, ${brand.palette.yellow[500]}, ${brand.palette.purple[500]}, transparent)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.4 }}
      />

      <motion.header
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease }}
        className="mb-12 w-full max-w-4xl"
      >
        <BrandLockup markHeight={56} className="mx-auto" />
      </motion.header>

      <motion.h1
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease }}
        className="font-display max-w-3xl text-center text-4xl font-semibold leading-tight text-mist sm:text-6xl md:text-[4.25rem]"
      >
        Are you a Business Owner
        <span className="block italic text-mist-muted">/ Decision Maker?</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.38, ease }}
        className="mt-6 max-w-md text-center text-base leading-relaxed text-mist-muted sm:text-lg"
      >
        Let&rsquo;s understand your business in 30 seconds.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.55, ease }}
        className="mt-14"
      >
        <PrimaryButton onClick={onBegin} className="min-w-[15rem]">
          Let&rsquo;s Begin
        </PrimaryButton>
      </motion.div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="absolute bottom-10 flex flex-col items-center gap-4"
      >
        <div className="flex items-center gap-2.5">
          {six.map((c, i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: c }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 + i * 0.08, duration: 0.4, ease }}
            />
          ))}
        </div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-mist-muted/70">
          Three questions · One clear picture
        </p>
      </motion.footer>
    </div>
  );
}
