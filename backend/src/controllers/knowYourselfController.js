import KnowYourselfQuestion from '../models/KnowYourselfQuestion.js';

export const listKYQuestions = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.includeInactive !== 'true') filter.active = true;
    const questions = await KnowYourselfQuestion.find(filter).sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) { next(err); }
};

export const getKYQuestion = async (req, res, next) => {
  try {
    const q = await KnowYourselfQuestion.findById(req.params.id);
    if (!q) return res.status(404).json({ error: 'Question not found' });
    res.json(q);
  } catch (err) { next(err); }
};

export const createKYQuestion = async (req, res, next) => {
  try {
    const { text, options, active } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Question text is required' });
    if (!options || options.length !== 4) return res.status(400).json({ error: 'Exactly 4 options are required' });
    for (const o of options) {
      if (!o.text || !o.text.trim()) return res.status(400).json({ error: 'Each option must have text' });
      const s = Number(o.score);
      if (!Number.isInteger(s) || s < 1 || s > 4) return res.status(400).json({ error: 'Each option score must be 1, 2, 3, or 4' });
    }
    const q = await KnowYourselfQuestion.create({ text: text.trim(), options, active: active !== false });
    res.status(201).json(q);
  } catch (err) { next(err); }
};

export const updateKYQuestion = async (req, res, next) => {
  try {
    const q = await KnowYourselfQuestion.findById(req.params.id);
    if (!q) return res.status(404).json({ error: 'Question not found' });
    const { text, options, active } = req.body;
    if (text !== undefined) q.text = text.trim();
    if (active !== undefined) q.active = active;
    if (options !== undefined) {
      if (options.length !== 4) return res.status(400).json({ error: 'Exactly 4 options are required' });
      for (const o of options) {
        if (!o.text || !o.text.trim()) return res.status(400).json({ error: 'Each option must have text' });
        const s = Number(o.score);
        if (!Number.isInteger(s) || s < 1 || s > 4) return res.status(400).json({ error: 'Each option score must be 1, 2, 3, or 4' });
      }
      q.options = options;
    }
    await q.save();
    res.json(q);
  } catch (err) { next(err); }
};

export const deleteKYQuestion = async (req, res, next) => {
  try {
    const q = await KnowYourselfQuestion.findByIdAndDelete(req.params.id);
    if (!q) return res.status(404).json({ error: 'Question not found' });
    res.json({ ok: true });
  } catch (err) { next(err); }
};
