import crypto from 'crypto';
import AssessmentSession from '../models/AssessmentSession.js';
import Category from '../models/Category.js';
import Question from '../models/Question.js';
import { rollQuestion, toPublicQuestion, getTimeoutSeconds, isValidQuestion } from './questionPool.js';
import { buildResult } from './scoringEngine.js';
import { resolveStage } from './stages.js';

function isExpired(startedAt) {
  const timeoutMs = getTimeoutSeconds() * 1000;
  return Date.now() - new Date(startedAt).getTime() > timeoutMs;
}

export async function createSession() {
  const categories = await Category.find({ active: true }).sort({ sortOrder: 1 }).lean();
  if (categories.length === 0) {
    throw Object.assign(new Error('No active assessment categories configured'), { status: 400 });
  }

  for (const c of categories) {
    const count = await Question.countDocuments({ category: c._id, active: true });
    if (count === 0) {
      throw Object.assign(
        new Error(`Category '${c.key}' has no active questions`),
        { status: 400 }
      );
    }
    const valid = await Question.findOne({ category: c._id, active: true }).lean();
    if (!valid || !isValidQuestion(valid)) {
      throw Object.assign(
        new Error(`Category '${c.key}' has no valid active questions (Yes/No options required)`),
        { status: 400 }
      );
    }
  }

  const sessionId = crypto.randomBytes(6).toString('hex').toUpperCase();
  const session = await AssessmentSession.create({
    sessionId,
    status: 'in_progress',
    answers: [],
  });

  const pending = {};
  for (const c of categories) pending[c.key] = true;

  return { sessionId, categories: categories.map((c) => c.key), pending };
}

export async function getNextQuestion(sessionId, categoryKey) {
  const session = await AssessmentSession.findOne({ sessionId });
  if (!session) throw Object.assign(new Error('Session not found'), { status: 404 });
  if (session.status === 'completed') {
    throw Object.assign(new Error('Session already completed'), { status: 409 });
  }

  const category = await Category.findOne({ key: categoryKey, active: true });
  if (!category) throw Object.assign(new Error('Category not found'), { status: 404 });

  const seen = new Set((session.answers || []).map((a) => String(a.question)));
  const { question } = await rollQuestion({ categoryKey, excludeQuestionIds: [...seen] });
  if (!question) throw Object.assign(new Error('No active questions in this category'), { status: 400 });

  const alreadyIssued = (session.answers || []).some(
    (a) => String(a.question) === String(question._id) && !a.timedOut
  );
  if (!alreadyIssued) {
    session.answers.push({
      category: category._id,
      categoryKey: category.key,
      question: question._id,
      questionText: question.text,
      score: 0,
      weight: question.weight,
      stageKey: question.stageKey || null,
      timedOut: false,
      startedAt: new Date(),
    });
    session.lastActiveAt = new Date();
    await session.save();
  }

  return { question: await toPublicQuestion(question), category: category.key };
}

export async function submitAnswer(sessionId, { questionId, optionId, categoryKey }) {
  const session = await AssessmentSession.findOne({ sessionId });
  if (!session) throw Object.assign(new Error('Session not found'), { status: 404 });
  if (session.status === 'completed') throw Object.assign(new Error('Session already completed'), { status: 409 });

  const category = await Category.findOne({ key: categoryKey });
  if (!category) throw Object.assign(new Error('Category not found'), { status: 404 });

  const question = await Question.findById(questionId);
  if (!question) throw Object.assign(new Error('Question not found'), { status: 404 });

  const option = (question.options || []).find(
    (o) => String(o._id) === String(optionId)
  );
  if (!option) throw Object.assign(new Error('Invalid answer option'), { status: 400 });

  const pendingEntry = (session.answers || []).find(
    (a) => String(a.question) === String(questionId)
  );
  const startedAt = pendingEntry?.startedAt || new Date();
  const timedOut = isExpired(startedAt);

  if (timedOut) {
    return { accepted: false, timedOut: true, reason: 'time_up', timeoutSeconds: getTimeoutSeconds() };
  }

  const stage = await resolveStage(option.stageKey || question.stageKey);

  const now = new Date();
  if (pendingEntry && !pendingEntry.optionId) {
    pendingEntry.optionId = option._id;
    pendingEntry.optionText = option.text;
    pendingEntry.score = option.score;
    pendingEntry.stageKey = option.stageKey || question.stageKey || null;
    pendingEntry.stage = stage;
    pendingEntry.answeredAt = now;
  } else {
    session.answers.push({
      category: category._id,
      categoryKey: category.key,
      question: question._id,
      questionText: question.text,
      optionId: option._id,
      optionText: option.text,
      score: option.score,
      weight: question.weight,
      stageKey: option.stageKey || question.stageKey || null,
      stage,
      timedOut: false,
      startedAt,
      answeredAt: now,
    });
  }
  session.lastActiveAt = new Date();
  await session.save();

  return { accepted: true, timedOut: false };
}

export async function recordTimeout(sessionId, questionId, categoryKey) {
  const session = await AssessmentSession.findOne({ sessionId });
  if (!session) throw Object.assign(new Error('Session not found'), { status: 404 });

  const existing = (session.answers || []).find((a) => String(a.question) === String(questionId));
  if (existing && existing.timedOut) return session;

  const category = await Category.findOne({ key: categoryKey });
  const question = await Question.findById(questionId);

  if (existing) {
    existing.timedOut = true;
  } else if (question && category) {
    session.answers.push({
      category: category._id,
      categoryKey: category.key,
      question: question._id,
      questionText: question.text,
      timedOut: true,
      score: 0,
      weight: question.weight,
      startedAt: new Date(),
      answeredAt: new Date(),
    });
  }
  session.lastActiveAt = new Date();
  await session.save();
  return session;
}

export async function getResult(sessionId) {
  const session = await AssessmentSession.findOne({ sessionId });
  if (!session) throw Object.assign(new Error('Session not found'), { status: 404 });
  const stored = session.result;
  if (
    session.status === 'completed' &&
    stored &&
    typeof stored.overallPct === 'number' &&
    Array.isArray(stored.scores)
  ) {
    return stored;
  }
  return buildResult(session);
}
