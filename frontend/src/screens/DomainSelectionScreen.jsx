import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PrimaryButton from '../components/PrimaryButton.jsx';
import api from '../api/client.js';
import { brand } from '../theme/brand.js';

const ease = [0.22, 1, 0.36, 1];
const six = brand.mark;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STATUS = { loading: 'loading', ready: 'ready', empty: 'empty', error: 'error'};

export default function DomainSelectionScreen({ onBegin, onBack, businessType }) {
  const [status, setStatus] = useState(STATUS.loading);
  const [domains, setDomains] = useState([]);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [err, setErr] = useState(null);
  const dropdownRef = useRef(null);

  const loadDomains = async () => {
    setStatus(STATUS.loading);
    setErr(null);
    try {
      // Server filters by the selected business type (DB relationship).
      const data = await api.domains(businessType?.key);
      if (!Array.isArray(data) || data.length === 0) {
        setStatus(STATUS.empty);
        return;
      }
      setDomains(data);
      setStatus(STATUS.ready);
    } catch (e) {
      setErr(e.message);
      setStatus(STATUS.error);
    }
  };

  useEffect(() => {
    loadDomains();
    // Reload when the business type changes.
  }, [businessType?.key]);

  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const emailValid = EMAIL_RE.test(email.trim());
  const canStart = status === STATUS.ready && selected && emailValid;

  const handleStart = () => {
    if (!canStart) return;
    setErr(null);
    onBegin({ domain: selected.slug, email: email.trim().toLowerCase() });
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
            animate={{ color: six, transition: { duration: 6, repeat: Infinity, ease: 'linear' } }}
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
            Business Assessment · Step 2 of 2
          </span>
          <h1 className="font-display text-3xl font-semibold text-white sm:text-5xl">
            Select Your Business <span className="italic" style={{ color: brand.accent }}>Domain</span>
          </h1>
          {businessType?.label && (
            <button
              type="button"
              onClick={onBack}
              title="Change business type"
              className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium text-white/60 transition-colors hover:border-white/30 hover:text-white"
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: brand.mark[0] }} />
              {businessType.label}
              <span className="text-white/35">· change</span>
            </button>
          )}
          <p className="mt-4 text-base text-white/50 sm:text-lg">
            Choose the area that best represents your business.
          </p>
        </motion.section>

        {/* Domain selector */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease }}
          className="w-full max-w-md"
        >
          <span className="mb-3 block text-center text-[11px] uppercase tracking-[0.3em] text-white/40">
            Select your business domain
          </span>

          {status === STATUS.loading && (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-8">
              <div
                className="h-8 w-8 animate-spin rounded-full border-2"
                style={{ borderColor: 'rgba(255,255,255,0.12)', borderTopColor: brand.accent }}
              />
              <p className="text-sm text-white/45">Loading domains…</p>
            </div>
          )}

          {status === STATUS.empty && (
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-8 text-center">
              <p className="text-sm text-white/60">
                No domains are available for {businessType?.label || 'this business type'} yet.
                Please go back and choose another business type.
              </p>
            </div>
          )}

          {status === STATUS.error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/[0.05] px-5 py-8 text-center">
              <p className="text-sm text-red-400">Could not load domains.</p>
              <button
                onClick={loadDomains}
                className="mt-4 rounded-full border border-white/15 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/30"
              >
                Retry
              </button>
            </div>
          )}

          {status === STATUS.ready && (
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl border px-5 py-4 text-left text-sm transition-all duration-300 ${
                  open
                    ? 'border-white/30 bg-white/[0.06]'
                    : 'border-white/[0.12] bg-white/[0.04] hover:border-white/[0.2]'
                }`}
                aria-haspopup="listbox"
                aria-expanded={open}
              >
                <span className={`truncate ${selected ? 'text-white' : 'text-white/35'}`}>
                  {selected ? selected.name : 'Choose a domain…'}
                </span>
                <motion.span
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="ml-2 text-white/40"
                >
                  ▾
                </motion.span>
              </button>

              <AnimatePresence>
                {open && (
                  <motion.ul
                    role="listbox"
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.2, ease }}
                    className="absolute inset-x-0 top-full z-20 mt-2 max-h-72 overflow-y-auto rounded-xl border border-white/[0.12] bg-[#14141e]/95 p-1.5 shadow-2xl backdrop-blur-xl"
                  >
                    {domains.map((d, i) => (
                      <li key={`${d.slug}-${d.id || i}`}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelected(d);
                            setOpen(false);
                          }}
                          className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition-colors ${
                            selected?.slug === d.slug
                              ? 'bg-white/[0.08] text-white'
                              : 'text-white/70 hover:bg-white/[0.05] hover:text-white'
                          }`}
                        >
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ background: six[i % 6] }}
                          />
                          <span className="flex-1 truncate">{d.name}</span>
                          {selected?.slug === d.slug && (
                            <span className="text-[10px] font-bold" style={{ color: brand.accent }}>
                              ✓
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.section>

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
        <AnimatePresence>
          {err && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 text-sm text-red-400"
            >
              {err}
            </motion.p>
          )}
        </AnimatePresence>

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
              {status === STATUS.ready
                ? 'Select a domain and enter a valid email to begin.'
                : 'Domains are loading — don’t go anywhere.'}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}