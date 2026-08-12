import Question from '../models/Question.js';
import Category from '../models/Category.js';
import { validateActiveQuestion } from '../models/Question.js';
import { getStageMap } from './stages.js';

export const getTimeoutSeconds = () =>
  Math.max(1, parseInt(process.env.QUESTION_TIMEOUT_SECONDS || '30', 10));

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function isValidQuestion(q) {
  if (!q || !q.active) return false;
  return validateActiveQuestion(q).length === 0;
}

export async function toPublicQuestion(q, startedAt = new Date()) {
  const stageMap = await getStageMap();
  return {
    questionId: q._id,
    text: q.text,
    weight: q.weight,
    category: q.categoryKey,
    startedAt: startedAt.toISOString(),
    timeoutSeconds: getTimeoutSeconds(),
    stage: stageMap[q.stageKey] || null,
    options: q.options
      .filter((o) => o.active)
      .map((o) => ({
        optionId: o._id,
        text: o.text,
        stage: stageMap[o.stageKey] || null,
      })),
  };
}

export async function rollQuestion({ categoryKey, excludeQuestionIds = [] }) {
  const category = await Category.findOne({ key: categoryKey, active: true });
  if (!category) return { error: `Category '${categoryKey}' is not active` };

  const exclude = new Set((excludeQuestionIds || []).map(String));
  const questions = await Question.find({ category: category._id, active: true }).lean();
  const candidates = shuffle(questions)
    .filter((q) => isValidQuestion(q))
    .filter((q) => !exclude.has(String(q._id)));

  if (candidates.length === 0) {
    return { error: 'No active questions available for this category' };
  }

  const q = { ...candidates[0], categoryKey: category.key, categoryName: category.name };
  return { question: q, category };
}

export async function getActiveCategories() {
  return Category.find({ active: true }).sort({ sortOrder: 1 }).lean();
}
