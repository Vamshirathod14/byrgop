import { useState } from 'react';
import { motion } from 'framer-motion';
import PrimaryButton from '../components/PrimaryButton.jsx';
import api from '../api/client.js';
import { brand } from '../theme/brand.js';

const ease = [0.22, 1, 0.36, 1];

const normalizePhone = (value) => {
  const digits = (value || '').replace(/[^\d]/g, '');
  return digits.length >= 7 && digits.length <= 15;
};

export default function KnowYourselfResult({ result, sessionId, onExplore }) {
  const { result: data } = result;
  const score = data?.score ?? 0;
  const maxScore = data?.maxScore ?? 80;
  const band = data?.band ?? '';
  const message = data?.message ?? '';

  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState(null);

  const canSubmit = normalizePhone(phone) && consent;

  const getBandColor = (b) => {
    if (b === 'STRONG FOUNDATION') return '#4ade80';
    if (b === 'MODERATE PERFORMANCE') return '#facc15';
    if (b === 'SIGNIFICANT GAPS') return '#fb923c';
    return '#f87171';
  };
  const bandColor = getBandColor(band);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setErr(null);
    try {
      await api.submitKYContact(sessionId, { phone, contactConsent: true });
      setSubmitted(true);
    } catch (e) {
      setErr(e.message);
      setSubmitted(false);
    } finally {
      setSubmitting(false);
    }
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

      {/* Header */}
      <header className="flex items-center justify-center">
        <span className="text-[10px] uppercase tracking-[0.28em] text-mist-muted">
          Assessment complete
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
            Know <span className="italic" style={{ color: brand.accent }}>Yourself</span>
          </h1>
        </motion.div>

        {/* Score Circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease }}
          className="relative mt-10 flex flex-col items-center"
        >
          <div className="relative h-52 w-52 sm:h-60 sm:w-60">
            <svg viewBox="0 0 200 200" className="h-full w-full">
              {/* Background circle */}
              <circle
                cx={100}
                cy={100}
                r={85}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={12}
              />
              {/* Score arc */}
              <motion.circle
                cx={100}
                cy={100}
                r={85}
                fill="none"
                stroke={bandColor}
                strokeWidth={12}
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 85}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 85 }}
                animate={{
                  strokeDashoffset: 2 * Math.PI * 85 * (1 - pct / 100),
                }}
                transition={{ duration: 1.5, delay: 0.5, ease }}
                transform="rotate(-90 100 100)"
                style={{ filter: `drop-shadow(0 0 12px ${bandColor}66)` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase tracking-[0.25em] text-mist-muted">Score</span>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6, ease }}
                className="font-display text-4xl font-bold text-mist sm:text-5xl"
              >
                {score} / {maxScore}
              </motion.span>
            </div>
          </div>

          {/* Band */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6, ease }}
            className="mt-6 flex flex-col items-center"
          >
            <h2
              className="font-display text-2xl font-bold uppercase tracking-[0.12em] sm:text-3xl"
              style={{ color: bandColor }}
            >
              {band}
            </h2>
            <p className="mt-2 max-w-md text-center text-sm leading-relaxed text-mist-muted">
              {message}
            </p>
          </motion.div>
        </motion.div>

        {/* Action */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.5, ease }}
          className="mt-11 flex flex-col items-center gap-3 sm:flex-row"
        >
          <PrimaryButton onClick={onExplore} className="min-w-[13rem]">
            Explore BYRGOP
          </PrimaryButton>
        </motion.div>

        {/* Contact form / confirmation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.8, ease }}
          className="mt-12 w-full max-w-md"
        >
          {submitted ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-8 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease }}
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: `${brand.palette.green[500]}22` }}
              >
                <span className="text-2xl" style={{ color: brand.palette.green[400] }}>✓</span>
              </motion.div>
              <h3 className="font-display text-xl font-semibold text-mist">
                Thank you. Our team will be in touch with you.
              </h3>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-7">
              <span className="mb-3 block text-[11px] uppercase tracking-[0.3em] text-mist-muted">
                Request a call
              </span>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-mist-muted">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    inputMode="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-white/25"
                  />
                </div>
                <label className="flex items-start gap-3 text-sm leading-relaxed text-mist-muted">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-[#FCA700]"
                  />
                  I would like to be contacted by the BYRGOP team.
                </label>
                {err && <p className="text-xs text-[#f87171]">{err}</p>}
                <PrimaryButton
                  onClick={handleSubmit}
                  disabled={!canSubmit || submitting}
                  className="w-full"
                >
                  {submitting ? 'Submitting…' : 'Request a Call'}
                </PrimaryButton>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
