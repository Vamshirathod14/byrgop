import { motion } from 'framer-motion';
import { brand } from '../theme/brand.js';

const ease = [0.22, 1, 0.36, 1];
const six = brand.mark;

// ─── Config (future-proofed) ──────────────────────────────
const VIDEO_SOURCE = null; // Set to a video URL when ready
const founder = {
  name: '',
  title: '',
  bio: '',
  image: null,
};

export default function AboutScreen() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-[#0a0a0f] to-[#14141e]">
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
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-3xl" />
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

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 sm:px-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
          className="text-center"
        >
          <h1 className="font-display max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
            Business Profit Architects
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/55 sm:text-lg">
            Building profitable businesses through strategy, operations, and revenue excellence.
          </p>
        </motion.div>

        {/* Video / Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease }}
          className="mt-12 w-full max-w-2xl"
        >
          {VIDEO_SOURCE ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10">
              <video
                src={VIDEO_SOURCE}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex items-center gap-3">
                  {six.map((c, i) => (
                    <motion.div
                      key={i}
                      className="h-4 w-4 rounded-full"
                      style={{ background: c, boxShadow: `0 2px 12px ${c}50` }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.1, duration: 0.4, type: 'spring' }}
                    />
                  ))}
                </div>
                <p className="text-sm text-white/35">Founder introduction coming soon</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Founder (placeholder) */}
        {founder.name && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease }}
            className="mt-10 flex max-w-lg flex-col items-center text-center"
          >
            {founder.image && (
              <img
                src={founder.image}
                alt={founder.name}
                className="h-20 w-20 rounded-full border-2 border-white/10 object-cover"
              />
            )}
            <h2 className="font-display mt-4 text-xl font-semibold text-white">{founder.name}</h2>
            <p className="text-sm text-white/50">{founder.title}</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/45">{founder.bio}</p>
          </motion.div>
        )}

        {/* Animated Dots */}
        <motion.div
          className="mt-12 flex items-center gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          {six.map((c, i) => (
            <motion.div
              key={i}
              className="relative"
              initial={{ y: -40, opacity: 0, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{
                delay: 1.1 + i * 0.1,
                duration: 0.6,
                type: 'spring',
                stiffness: 200,
                damping: 15,
              }}
            >
              <div
                className="h-4 w-4 rounded-full"
                style={{ background: c, boxShadow: `0 3px 16px ${c}55` }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="mt-8 text-[11px] uppercase tracking-[0.3em] text-white/30"
        >
          {brand.tagline}
        </motion.p>
      </div>
    </div>
  );
}
