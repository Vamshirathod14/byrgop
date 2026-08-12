import { asyncHandler } from '../middleware/errors.js';
import ResultContent from '../models/ResultContent.js';

export const listResults = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.includeInactive !== 'true') filter.active = true;
  const results = await ResultContent.find(filter)
    .populate('category', 'key name color')
    .sort({ category: 1, minScore: 1 });
  res.json(results);
});

export const createResult = asyncHandler(async (req, res) => {
  const r = await ResultContent.create(req.body);
  res.status(201).json(r);
});

export const updateResult = asyncHandler(async (req, res) => {
  const r = await ResultContent.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!r) return res.status(404).json({ error: 'Result content not found' });
  res.json(r);
});

export const deleteResult = asyncHandler(async (req, res) => {
  const r = await ResultContent.findByIdAndDelete(req.params.id);
  if (!r) return res.status(404).json({ error: 'Result content not found' });
  res.json({ ok: true });
});
