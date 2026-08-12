import { asyncHandler } from '../middleware/errors.js';
import Stage from '../models/Stage.js';

export const listStages = asyncHandler(async (req, res) => {
  const { includeInactive } = req.query;
  const filter = includeInactive === 'true' ? {} : { active: true };
  const stages = await Stage.find(filter).sort({ sortOrder: 1 });
  res.json(stages);
});

export const getStage = asyncHandler(async (req, res) => {
  const stage = await Stage.findById(req.params.id);
  if (!stage) return res.status(404).json({ error: 'Stage not found' });
  res.json(stage);
});

export const createStage = asyncHandler(async (req, res) => {
  const stage = await Stage.create(req.body);
  res.status(201).json(stage);
});

export const updateStage = asyncHandler(async (req, res) => {
  const stage = await Stage.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!stage) return res.status(404).json({ error: 'Stage not found' });
  res.json(stage);
});

export const deleteStage = asyncHandler(async (req, res) => {
  const stage = await Stage.findByIdAndDelete(req.params.id);
  if (!stage) return res.status(404).json({ error: 'Stage not found' });
  res.json({ ok: true });
});
