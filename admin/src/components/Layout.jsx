const TABS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'questions', label: 'Questions' },
  { key: 'categories', label: 'Categories' },
  { key: 'stages', label: 'Stages' },
  { key: 'results', label: 'Results' },
  { key: 'sessions', label: 'Sessions' },
];

export default function Layout({ active, onNavigate, children }) {
  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 flex w-56 flex-col border-r border-white/10 bg-ink-850 px-4 py-6">
        <div className="mb-8 px-2">
          <img
            src="/byrgop-logo.png"
            alt="BYRGOP"
            style={{ height: 30 }}
            className="w-auto object-contain select-none"
          />
          <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-mist-muted">
            Admin Console
          </p>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => onNavigate(t.key)}
              className={`rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                active === t.key
                  ? 'bg-brand-accent/15 font-semibold text-brand-accent'
                  : 'text-mist-muted hover:bg-white/5 hover:text-mist'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <p className="px-3 text-[10px] text-mist-muted/50">Phase 1 · Assessment</p>
      </aside>
      <main className="ml-56 flex-1 px-8 py-8">{children}</main>
    </div>
  );
}
