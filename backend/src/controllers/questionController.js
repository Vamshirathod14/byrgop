import { asyncHandler } from '../middleware/errors.js';
import Question from '../models/Question.js';
import Category from '../models/Category.js';

export const listQuestions = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.includeInactive !== 'true') filter.active = true;
  const questions = await Question.find(filter)
    .populate('category', 'key name color')
    .sort({ createdAt: -1 });
  res.json(questions);
});

export const getQuestion = asyncHandler(async (req, res) => {
  const q = await Question.findById(req.params.id).populate('category', 'key name color');
  if (!q) return res.status(404).json({ error: 'Question not found' });
  res.json(q);
});

export const createQuestion = asyncHandler(async (req, res) => {
  const { category } = req.body;
  const cat = await Category.findById(category);
  if (!cat) return res.status(400).json({ error: 'Invalid category' });
  const q = await Question.create(req.body);
  res.status(201).json(q);
});

export const updateQuestion = asyncHandler(async (req, res) => {
  if (req.body.category) {
    const cat = await Category.findById(req.body.category);
    if (!cat) return res.status(400).json({ error: 'Invalid category' });
  }
  const q = await Question.findById(req.params.id);
  if (!q) return res.status(404).json({ error: 'Question not found' });
  Object.assign(q, req.body);
  await q.save();
  res.json(q);
});

export const deleteQuestion = asyncHandler(async (req, res) => {
  const q = await Question.findByIdAndDelete(req.params.id);
  if (!q) return res.status(404).json({ error: 'Question not found' });
  res.json({ ok: true });
});
