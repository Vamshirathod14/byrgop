import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client.js';
import StageSelect from '../components/StageSelect.jsx';
import { StageChip, StageDot, stageColour } from '../components/StageChip.jsx';

const empty = {
  text: '',
  category: '',
  weight: 10,
  stageKey: '',
  active: true,
  options: [{ text: '', score: 1, stageKey: '', active: true }],
};

function QuestionForm({ initial, categories, stages, onCancel, onSaved }) {
  const [form, setForm] = useState(() =>
    initial
      ? { ...initial, category: initial.category?._id || initial.category }
      : {
          ...empty,
          category: categories[0]?._id || '',
        }
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const setOption = (i, patch) =>
    set({
      options: form.options.map((o, idx) => (idx === i ? { ...o, ...patch } : o)),
    });

  const addOption = () => set({ options: [...form.options, { text: '', score: 1, stageKey: '', active: true }] });
  const removeOption = (i) =>
    set({ options: form.options.filter((_, idx) => idx !== i) });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      const payload = {
        ...form,
        stageKey: form.stageKey || null,
        options: form.options.map((o) => ({
          ...(o._id ? { _id: o._id } : {}),
          text: o.text,
          score: Number(o.score),
          stageKey: o.stageKey || null,
          active: o.active,
        })),
        weight: Number(form.weight),
      };
      if (initial?._id) await api.updateQuestion(`/admin/questions/${initial._id}`, payload);
      else await api.createQuestion('/admin/questions', payload);
      onSaved();
    } catch (err) {
      setErr(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-4">
      <div>
        <label className="mb-1 block text-xs uppercase tracking-[0.15em] text-mist-muted">
          Question text
        </label>
        <textarea
          className="input"
          rows={2}
          value={form.text}
          onChange={(e) => set({ text: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-[0.15em] text-mist-muted">
            Category
          </label>
          <select
            className="input"
            value={form.category}
            onChange={(e) => set({ category: e.target.value })}
            required
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-[0.15em] text-mist-muted">
            Weight
          </label>
          <input
            type="number"
            min="1"
            className="input"
            value={form.weight}
            onChange={(e) => set({ weight: e.target.value })}
            required
          />
        </div>
        <div>
          <StageSelect
            label="BYRGOP Stage"
            value={form.stageKey}
            stages={stages}
            onChange={(v) => set({ stageKey: v })}
          />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs uppercase tracking-[0.15em] text-mist-muted">
            Answer options &amp; scores
          </label>
          <button type="button" onClick={addOption} className="text-xs text-brand-accent hover:underline">
            + Add option
          </button>
        </div>
        <div className="space-y-3">
          {form.options.map((o, i) => {
            const oStage = stages.find((s) => s.key === o.stageKey);
            const oCol = oStage ? stageColour(oStage.color) : null;
            const optLabel = o.text.trim() || `Option ${i + 1}`;
            return (
              <div
                key={i}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-3 transition-colors focus-within:border-brand-accent/40"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    className="input min-w-40 flex-1"
                    placeholder="Option text (e.g. Yes / No)"
                    value={o.text}
                    onChange={(e) => setOption(i, { text: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    className="input w-20"
                    placeholder="Score"
                    value={o.score}
                    onChange={(e) => setOption(i, { score: e.target.value })}
                    required
                  />
                  <label className="flex items-center gap-1 text-xs text-mist-muted">
                    <input
                      type="checkbox"
                      checked={o.active}
                      onChange={(e) => setOption(i, { active: e.target.checked })}
                    />
                    active
                  </label>
                  <button
                    type="button"
                    onClick={() => removeOption(i)}
                    className="text-xs text-[#f87171] hover:underline"
                  >
                    remove
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap items-end gap-2">
                  <div className="min-w-56 flex-1">
                    <StageSelect
                      label="Stage when this is chosen"
                      value={o.stageKey}
                      stages={stages}
                      onChange={(v) => setOption(i, { stageKey: v })}
                    />
                  </div>
                  <div className="pb-2 text-right text-[10px] uppercase tracking-[0.12em] text-mist-muted/60">
                    {optLabel}
                    {oStage && oCol && (
                      <span className="mt-0.5 flex items-center justify-end gap-1.5 font-semibold" style={{ color: oStage.color }}>
                        <StageDot color={oStage.color} size={8} />
                        {oStage.name} · {oCol.name}
                      </span>
                    )}
                    {oStage && !oCol && (
                      <span className="mt-0.5 flex items-center justify-end gap-1.5 font-semibold" style={{ color: oStage.color }}>
                        <StageDot color={oStage.color} size={8} />
                        {oStage.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-mist">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => set({ active: e.target.checked })}
        />
        Active (available in assessment)
      </label>

      {err && <p className="text-sm text-[#f87171]">{err}</p>}

      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? 'Saving…' : initial ? 'Save changes' : 'Create question'}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stages, setStages] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [err, setErr] = useState(null);

  const load = useCallback(async () => {
    try {
      const [qs, cats, sts] = await Promise.all([api.questions(), api.categories(), api.stages()]);
      setQuestions(qs);
      setCategories(cats);
      setStages(sts);
    } catch (e) {
      setErr(e.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (q) => {
    if (!window.confirm(`Delete question "${q.text.slice(0, 60)}…"?`)) return;
    try {
      await api.deleteQuestion(`/admin/questions/${q._id}`);
      await load();
    } catch (e) {
      setErr(e.message);
    }
  };

  const catName = (id) => categories.find((c) => c._id === id)?.name || '—';
  const stageOf = (key) => stages.find((s) => s.key === key);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-mist">Questions</h1>
          <p className="mt-1 text-sm text-mist-muted">
            Question bank, weights, BYRGOP stages and scoring options. Managed by BYRGOP.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreate((v) => !v)}>
          {showCreate ? 'Close' : '+ New question'}
        </button>
      </div>

      {err && <p className="mt-3 text-sm text-[#f87171]">{err}</p>}

      {showCreate && (
        <div className="mt-5">
          <QuestionForm
            categories={categories}
            stages={stages}
            onCancel={() => setShowCreate(false)}
            onSaved={async () => {
              setShowCreate(false);
              await load();
            }}
          />
        </div>
      )}

      <div className="mt-6 space-y-3">
        {questions.length === 0 && <p className="text-mist-muted">No questions yet.</p>}
        {questions.map((q) => (
          <div key={q._id} className="card">
            {editing?._id === q._id ? (
              <QuestionForm
                initial={q}
                categories={categories}
                stages={stages}
                onCancel={() => setEditing(null)}
                onSaved={async () => {
                  setEditing(null);
                  await load();
                }}
              />
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="badge"
                      style={{
                        background: `${q.category?.color || '#888'}22`,
                        color: q.category?.color || '#aaa',
                      }}
                    >
                      {catName(q.category?._id)}
                    </span>
                    <span className="badge bg-white/10 text-mist">weight {q.weight}</span>
                    {q.stageKey && stageOf(q.stageKey) && (
                      <StageChip stage={stageOf(q.stageKey)} />
                    )}
                    <span className="badge bg-white/10 text-mist">
                      {q.options.filter((o) => o.active).length} active options
                    </span>
                    <span
                      className={`badge ${
                        q.active ? 'bg-[#4ade80]/15 text-[#4ade80]' : 'bg-[#f87171]/15 text-[#f87171]'
                      }`}
                    >
                      {q.active ? 'active' : 'inactive'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-mist">{q.text}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {q.options.map((o) => (
                      <span
                        key={o._id}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] ${
                          o.active ? 'border-white/15 text-mist-muted' : 'border-white/5 text-mist-muted/40'
                        }`}
                      >
                        <span className="font-medium">{o.text}</span>
                        <span className="opacity-60">· {o.score}</span>
                        {o.stageKey && stageOf(o.stageKey) && (
                          <StageChip stage={stageOf(o.stageKey)} showColour={false} className="border-transparent bg-transparent px-1" />
                        )}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button className="btn-ghost px-3 py-1.5 text-xs" onClick={() => setEditing(q)}>
                    Edit
                  </button>
                  <button className="btn-danger" onClick={() => remove(q)}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
