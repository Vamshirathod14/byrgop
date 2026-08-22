import { asyncHandler } from '../middleware/errors.js';
import Question from '../models/Question.js';
import Category from '../models/Category.js';
import { logAudit, getClientIp, auditFrom } from '../services/auditService.js';

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
  await logAudit({ ...auditFrom(req), action: 'question.created', entity: 'question', entityId: q._id, metadata: { text: q.text, category: cat.key } });
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
  await logAudit({ ...auditFrom(req), action: 'question.updated', entity: 'question', entityId: q._id, metadata: { text: q.text } });
  res.json(q);
});

export const deleteQuestion = asyncHandler(async (req, res) => {
  const q = await Question.findByIdAndDelete(req.params.id);
  if (!q) return res.status(404).json({ error: 'Question not found' });
  await logAudit({ ...auditFrom(req), action: 'question.deleted', entity: 'question', entityId: q._id, metadata: { text: q.text } });
  res.json({ ok: true });
});
