import KnowYourselfQuestion from '../models/KnowYourselfQuestion.js';
import Domain from '../models/Domain.js';
import KYCategory from '../models/KYCategory.js';
import { logAudit, auditFrom } from '../services/auditService.js';

const BUSINESS_TYPE_KEYS = ['service', 'product', 'ngo'];

async function resolveCategoryKey(raw) {
  const value = typeof raw === 'string' ? raw.trim() : '';
  if (!value) return null;
  const cat = await KYCategory.findOne({
    $or: [{ key: value.toLowerCase() }, { name: new RegExp(`^${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }],
  });
  return cat ? cat.key : undefined; // undefined = invalid, null = explicitly none
}

export const listKYDomains = async (_req, res, next) => {
  try {
    const domains = await Domain.find({ active: true }).sort({ name: 1 });
    res.json(domains.map((d) => ({ id: d._id, slug: d.slug, name: d.name, active: d.active })));
  } catch (err) { next(err); }
};

async function resolveDomainSlug(raw) {
  const slug = typeof raw === 'string' ? raw.trim().toLowerCase() : '';
  if (!slug) return null;
  const domain = await Domain.findOne({ slug });
  return domain ? domain.slug : null;
}

export const listKYQuestions = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.includeInactive !== 'true') filter.active = true;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.domain) filter.domain = req.query.domain;
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
    const { text, options, active, type, domain, category, businessType } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Question text is required' });
    if (!options || options.length !== 4) return res.status(400).json({ error: 'Exactly 4 options are required' });
    for (const o of options) {
      if (!o.text || !o.text.trim()) return res.status(400).json({ error: 'Each option must have text' });
      const s = Number(o.score);
      if (!Number.isInteger(s) || s < 1 || s > 4) return res.status(400).json({ error: 'Each option score must be 1, 2, 3, or 4' });
    }
    const qType = type === 'domain' ? 'domain' : 'generic';
    const qDomain = qType === 'domain' ? await resolveDomainSlug(domain) : null;
    if (qType === 'domain' && !qDomain) {
      return res.status(400).json({ error: 'Invalid domain. Select a domain from the list.' });
    }
    const categoryKey = await resolveCategoryKey(category);
    if (categoryKey === undefined) {
      return res.status(400).json({ error: 'Invalid category. Select a result category from the list.' });
    }
    let qBusinessType = businessType || null;
    if (qBusinessType && !BUSINESS_TYPE_KEYS.includes(qBusinessType)) {
      return res.status(400).json({ error: 'Invalid business type' });
    }
    const q = await KnowYourselfQuestion.create({
      text: text.trim(),
      options,
      active: active !== false,
      type: qType,
      domain: qDomain,
      category: categoryKey,
      businessType: qBusinessType,
    });
    await logAudit({ ...auditFrom(req), action: 'ky_question.created', entity: 'ky_question', entityId: q._id, metadata: { text: q.text, type: qType, domain: qDomain, category: categoryKey } });
    res.status(201).json(q);
  } catch (err) { next(err); }
};

export const updateKYQuestion = async (req, res, next) => {
  try {
    const q = await KnowYourselfQuestion.findById(req.params.id);
    if (!q) return res.status(404).json({ error: 'Question not found' });
    const { text, options, active, type, domain, category, businessType } = req.body;
    if (text !== undefined) q.text = text.trim();
    if (active !== undefined) q.active = active;
    if (type !== undefined) q.type = type === 'domain' ? 'domain' : 'generic';
    if (q.type === 'domain' && domain !== undefined) {
      const valid = await resolveDomainSlug(domain);
      if (!valid) return res.status(400).json({ error: 'Invalid domain. Select a domain from the list.' });
      q.domain = valid;
    } else if (q.type === 'generic') {
      q.domain = null;
    }
    if (category !== undefined) {
      const categoryKey = await resolveCategoryKey(category);
      if (categoryKey === undefined) {
        return res.status(400).json({ error: 'Invalid category. Select a result category from the list.' });
      }
      q.category = categoryKey;
    }
    if (businessType !== undefined) {
      if (businessType && !BUSINESS_TYPE_KEYS.includes(businessType)) {
        return res.status(400).json({ error: 'Invalid business type' });
      }
      q.businessType = businessType || null;
    }
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
    await logAudit({ ...auditFrom(req), action: 'ky_question.updated', entity: 'ky_question', entityId: q._id, metadata: { text: q.text, type: q.type, domain: q.domain } });
    res.json(q);
  } catch (err) { next(err); }
};

export const deleteKYQuestion = async (req, res, next) => {
  try {
    const q = await KnowYourselfQuestion.findByIdAndDelete(req.params.id);
    if (!q) return res.status(404).json({ error: 'Question not found' });
    await logAudit({ ...auditFrom(req), action: 'ky_question.deleted', entity: 'ky_question', entityId: q._id, metadata: { text: q.text } });
    res.json({ ok: true });
  } catch (err) { next(err); }
};