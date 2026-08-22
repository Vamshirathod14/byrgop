import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/client.js';
import { brand } from '../theme/brand.js';

const ease = [0.22, 1, 0.36, 1];

// Card accents drawn from the official six-colour mark.
const CARD_ACCENTS = [brand.mark[0], brand.mark[3], brand.mark[5]];

export default function BusinessTypeScreen({ onSelect }) {
  const [businessTypes, setBusinessTypes] = useState(null);
  const [selected, setSelected] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .kyMeta()
      .then((meta) => {
        if (cancelled) return;
        setBusinessTypes(meta.businessTypes || []);
      })
      .catch((e) => {
        if (cancelled) return;
        setErr(e.message);
        // Fallback keeps the flow usable if /meta is unavailable.
        setBusinessTypes([
          { key: 'service', label: 'Service Based' },
          { key: 'product', label: 'Product Based' },
          { key: 'ngo', label: 'NGO / Non-Profit' },
        ]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0a0a0f] to-[#14141e]">
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${brand.palette.blue[500]}, ${brand.palette.yellow[500]}, ${brand.palette.purple[500]}, transparent)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.4 }}
      />

      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      {/* Logo - Top Left */}
      <motion.div
        className="absolute top-6 left-6 z-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        <img src="/logo.jpg" alt="Business Profit Architects" className="h-12 w-auto object-contain drop-shadow-lg" />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center px-6 py-28 sm:py-32">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="mb-12 max-w-2xl text-center"
        >
          <span className="mb-4 block text-[11px] uppercase tracking-[0.3em] text-white/40">
            Business Assessment · Step 1 of 2
          </span>
          <h1 className="font-display text-3xl font-semibold text-white sm:text-5xl">
            Select Your <span className="italic" style={{ color: brand.accent }}>Business Type</span>
          </h1>
          <p className="mt-4 text-base text-white/50 sm:text-lg">
            Choose the option that best describes how your organisation operates.
          </p>
        </motion.section>

        {!businessTypes && !err && (
          <div
            className="h-8 w-8 animate-spin rounded-full border-2"
            style={{ borderColor: 'rgba(255,255,255,0.12)', borderTopColor: brand.accent }}
          />
        )}

        {err && (
          <p className="text-sm text-red-400">Could not load configuration — using defaults.</p>
        )}

        <div className="grid w-full max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
          {(businessTypes || []).map((bt, i) => {
            const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];
            const isSel = selected?.key === bt.key;
            return (
              <motion.button
                key={bt.key}
                type="button"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.12, duration: 0.6, ease }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(bt)}
                onDoubleClick={() => selected && onSelect(selected.key, selected.label)}
                className={`group relative overflow-hidden rounded-2xl border p-7 text-left transition-all duration-300 ${
                  isSel ? 'bg-white/[0.07]' : 'border-white/[0.12] bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.05]'
                }`}
                style={isSel ? { borderColor: accent, boxShadow: `0 0 32px ${accent}33` } : undefined}
              >
                <div
                  className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold"
                  style={{ background: `${accent}1f`, color: accent }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">{bt.label}</h2>
                {bt.description && (
                  <p className="mt-2 text-sm leading-relaxed text-white/45">{bt.description}</p>
                )}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                  style={{ background: accent, transform: isSel ? 'scaleX(1)' : undefined }}
                />
                {isSel && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute right-5 top-5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                    style={{ background: `${accent}26`, color: accent }}
                  >
                    ✓
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8, ease }}
          className="mt-12 flex flex-col items-center gap-3"
        >
          <button
            type="button"
            disabled={!selected}
            onClick={() => selected && onSelect(selected.key, selected.label)}
            className={`rounded-full px-10 py-3.5 font-display text-base font-semibold tracking-wide transition-all duration-300 ${
              selected ? 'text-black' : 'cursor-not-allowed bg-white/[0.06] text-white/30'
            }`}
            style={selected ? { background: brand.accent, boxShadow: `0 8px 32px ${brand.accent}44` } : undefined}
          >
            Continue →
          </button>
          {!selected && businessTypes && (
            <p className="text-xs text-white/35">Select a business type to continue.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
