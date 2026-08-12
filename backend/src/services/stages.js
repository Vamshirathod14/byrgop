import Stage from '../models/Stage.js';

export async function getStageMap() {
  const stages = await Stage.find({ active: true }).sort({ sortOrder: 1 }).lean();
  const map = {};
  for (const s of stages) map[s.key] = { key: s.key, name: s.name, color: s.color };
  return map;
}

export async function resolveStage(stageKey) {
  if (!stageKey) return null;
  const map = await getStageMap();
  return map[stageKey] || null;
}
