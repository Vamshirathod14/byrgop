import { useEffect, useState } from 'react';
import { api } from '../api/client.js';

function Stat({ label, value, sub }) {
  return (
    <div className="card">
      <p className="text-xs uppercase tracking-[0.18em] text-mist-muted">{label}</p>
      <p className="font-display mt-2 text-4xl font-bold text-mist">{value}</p>
      {sub && <p className="mt-1 text-xs text-mist-muted">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    api
      .stats()
      .then(setStats)
      .catch((e) => setErr(e.message));
  }, []);

  if (err) return <div className="text-[#f87171]">Failed to load stats: {err}</div>;
  if (!stats) return <p className="text-mist-muted">Loading…</p>;

  const completionRate =
    stats.totalSessions > 0
      ? Math.round((stats.completed / stats.totalSessions) * 100)
      : 0;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-mist">Dashboard</h1>
      <p className="mt-1 text-sm text-mist-muted">Assessment system overview</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Total Sessions" value={stats.totalSessions} />
        <Stat label="Completed" value={stats.completed} sub={`${completionRate}% completion`} />
        <Stat label="In Progress" value={stats.inProgress} />
        <Stat label="Timed Out Answers" value={stats.totalTimedOutAnswers} />
      </div>

      <div className="mt-6 card">
        <p className="text-xs uppercase tracking-[0.18em] text-mist-muted">Content Bank</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="badge bg-brand-accent/15 text-brand-accent">
            {stats.totalQuestions} active questions
          </span>
          <span className="badge bg-white/10 text-mist">3 categories</span>
          <span className="badge bg-white/10 text-mist">Admin-driven scoring &amp; weights</span>
        </div>
      </div>
    </div>
  );
}
