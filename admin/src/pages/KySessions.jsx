import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client.js';

const STATUS = ['all', 'in_progress', 'completed', 'abandoned'];

const DOMAIN_LABELS = {
  manufacturing: 'Manufacturing & Industrial Operations',
  retail_ecommerce: 'Retail & E-Commerce',
  professional_services: 'Professional Services & Consulting',
  healthcare_wellness: 'Healthcare & Wellness Operations',
  supply_chain_logistics: 'Supply Chain, Logistics & Distribution',
  technology_saas: 'Technology & SaaS / Digital Products',
  financial_services: 'Financial Services & FinTech',
  real_estate_construction: 'Real Estate, Construction & Infrastructure',
  hospitality_food_beverage: 'Hospitality, Food & Beverage (F&B)',
  franchise_multi_unit: 'Franchise & Multi-Unit Chains',
};

const fmtDate = (d) => (d ? new Date(d).toLocaleString() : '—');

export default function KySessions() {
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [err, setErr] = useState(null);

  const load = useCallback(async () => {
    try {
      setSessions(await api.kySessions(filter === 'all' ? undefined : filter));
    } catch (e) {
      setErr(e.message);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-mist">Know Yourself Submissions</h1>
      <p className="mt-1 text-sm text-mist-muted">
        Domain assignment sessions — email, phone, domain, status, score, consent and timestamps.
      </p>

      <div className="mt-4 flex gap-2">
        {STATUS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-xs capitalize transition-colors ${
              filter === s
                ? 'bg-brand-accent text-ink-950 font-semibold'
                : 'border border-white/10 text-mist-muted hover:text-mist'
            }`}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {err && <p className="mt-3 text-sm text-[#f87171]">{err}</p>}

      <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-white/[0.03] text-xs uppercase tracking-[0.12em] text-mist-muted">
            <tr>
              <th className="px-4 py-3">Session</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Domain</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Contact Requested</th>
              <th className="px-4 py-3">Started At</th>
              <th className="px-4 py-3">Completed At</th>
              <th className="px-4 py-3">Contact Submitted At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sessions.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-6 text-center text-mist-muted">
                  No submissions.
                </td>
              </tr>
            )}
            {sessions.map((s) => (
              <tr key={s._id} className="hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-mono text-xs text-brand-accent">{s.sessionId}</td>
                <td className="px-4 py-3 text-mist">{s.email || '—'}</td>
                <td className="px-4 py-3 text-mist">{s.phone || '—'}</td>
                <td className="px-4 py-3 text-mist">{DOMAIN_LABELS[s.domain] || s.domain || '—'}</td>
                <td className="px-4 py-3">
                  <span
                    className={`badge capitalize ${
                      s.status === 'completed'
                        ? 'bg-[#4ade80]/15 text-[#4ade80]'
                        : s.status === 'in_progress'
                          ? 'bg-[#facc15]/15 text-[#facc15]'
                          : 'bg-white/10 text-mist-muted'
                    }`}
                  >
                    {s.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 text-mist">
                  {s.result ? `${s.result.score}/${s.result.maxScore}` : '—'}
                </td>
                <td className="px-4 py-3">
                  {s.contactConsent ? (
                    <span className="badge bg-[#4ade80]/15 text-[#4ade80] font-semibold">YES</span>
                  ) : (
                    <span className="badge bg-white/10 text-mist-muted">No</span>
                  )}
                </td>
                <td className="px-4 py-3 text-mist-muted">{fmtDate(s.startedAt)}</td>
                <td className="px-4 py-3 text-mist-muted">{fmtDate(s.completedAt)}</td>
                <td className="px-4 py-3 text-mist-muted">{fmtDate(s.contactSubmittedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
