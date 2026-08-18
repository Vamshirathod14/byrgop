import { useState } from 'react';
import { motion } from 'framer-motion';
import PrimaryButton from '../components/PrimaryButton.jsx';
import { brand } from '../theme/brand.js';

const ease = [0.22, 1, 0.36, 1];
const six = brand.mark;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function DomainSelectionScreen({ domains, onBegin }) {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [email, setEmail] = useState('');
  const [err, setErr] = useState(null);

  const canStart = selectedDomain && EMAIL_RE.test(email.trim());

  const handleStart = () => {
    if (!canStart) return;
    setErr(null);
    onBegin({ domain: selectedDomain, email: email.trim().toLowerCase() });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0a0a0f] to-[#14141e]">
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

      {/* Background glow */}
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
              color: six,
              transition: { duration: 6, repeat: Infinity, ease: 'linear', delay: 1 },
            }}
          >
            बिरगाप
          </motion.span>
        </motion.span>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 py-32">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="mb-12 max-w-2xl text-center"
        >
          <span className="mb-4 block text-[11px] uppercase tracking-[0.3em] text-white/40">
            Business Assessment
          </span>
          <h1 className="font-display text-3xl font-semibold text-white sm:text-5xl">
            Select Your Business <span className="italic" style={{ color: brand.accent }}>Domain</span>
          </h1>
          <p className="mt-4 text-base text-white/50 sm:text-lg">
            Choose the area that best represents your business.
          </p>
        </motion.section>

        {/* Domain Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease }}
          className="grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {domains.map((d, i) => (
            <motion.button
              key={d.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.05, duration: 0.5, ease }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedDomain(d.key)}
              className={`relative rounded-xl border py-4 px-5 text-left transition-all duration-300 ${
                selectedDomain === d.key
                  ? 'border-white/25 bg-white/[0.06]'
                  : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{
                    background: six[i % 6],
                    boxShadow: selectedDomain === d.key ? `0 0 12px ${six[i % 6]}50` : 'none',
                  }}
                />
                <span className={`text-sm font-medium ${selectedDomain === d.key ? 'text-white' : 'text-white/70'}`}>
                  {d.label}
                </span>
              </div>
              {selectedDomain === d.key && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full"
                  style={{ background: brand.accent }}
                >
                  <span className="text-[10px] font-bold text-[#0a0e16]">✓</span>
                </motion.div>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="my-10 h-px w-16 bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* Email */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease }}
          className="w-full max-w-md text-center"
        >
          <span className="mb-4 block text-[11px] uppercase tracking-[0.3em] text-white/40">
            Your Email
          </span>
          <input
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/[0.12] bg-white/[0.04] px-5 py-3.5 text-center text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-white/25"
          />
        </motion.section>

        {/* Error */}
        {err && (
          <p className="mt-4 text-sm text-red-400">{err}</p>
        )}

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease }}
          className="mt-10"
        >
          <PrimaryButton
            onClick={handleStart}
            disabled={!canStart}
            className="min-w-[14rem]"
          >
            Start Test
          </PrimaryButton>
          {!canStart && (
            <p className="mt-3 text-xs text-white/35">
              Select a domain and enter a valid email to begin.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
