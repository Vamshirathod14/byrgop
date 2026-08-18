import KnowYourselfQuestion, { DOMAIN_KEYS, DOMAIN_LABELS } from '../models/KnowYourselfQuestion.js';
import KnowYourselfSession from '../models/KnowYourselfSession.js';

function generateSessionId() {
  const chars = '0123456789ABCDEF';
  let id = '';
  for (let i = 0; i < 12; i++) id += chars[Math.floor(Math.random() * 16)];
  return id;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function snapshotQuestions(questions, source) {
  return questions.map((q) => ({
    questionId: q._id,
    text: q.text,
    source,
    options: q.options
      .filter((o) => o.active)
      .map((o) => ({
        optionId: o._id,
        text: o.text,
        score: o.score,
      })),
  }));
}

export function getAvailableDomains() {
  return DOMAIN_KEYS.map((key) => ({ key, label: DOMAIN_LABELS[key] }));
}

// ─── Generic session (unchanged) ──────────────────────────

export async function startKYSession() {
  const activeQuestions = await KnowYourselfQuestion.find({ active: true, type: 'generic' }).lean();
  if (activeQuestions.length < 20) {
    throw Object.assign(
      new Error(`Need at least 20 active generic Know Yourself questions (found ${activeQuestions.length})`),
      { status: 400 }
    );
  }
  const selected = shuffle(activeQuestions).slice(0, 20);
  const snapshot = snapshotQuestions(selected, 'generic');
  const sessionId = generateSessionId();
  const session = await KnowYourselfSession.create({
    sessionId,
    status: 'in_progress',
    startedAt: new Date(),
    selectedQuestions: snapshot,
    answers: [],
  });
  return {
    sessionId: session.sessionId,
    totalQuestions: 20,
    questions: snapshot.map((q, i) => ({
      questionIndex: i,
      questionId: q.questionId,
      text: q.text,
      options: q.options.map((o) => ({ optionId: o.optionId, text: o.text })),
    })),
  };
}

// ─── Domain assignment ────────────────────────────────────

export async function startKYAssignment(email, domainKey) {
  if (!email || !email.trim()) {
    throw Object.assign(new Error('Email is required'), { status: 400 });
  }
  const normalizedEmail = email.trim().toLowerCase();
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!EMAIL_RE.test(normalizedEmail)) {
    throw Object.assign(new Error('A valid email address is required'), { status: 400 });
  }
  if (!DOMAIN_KEYS.includes(domainKey)) {
    throw Object.assign(new Error(`Invalid domain: ${domainKey}`), { status: 400 });
  }

  const [genericQuestions, domainQuestions] = await Promise.all([
    KnowYourselfQuestion.find({ active: true, type: 'generic' }).lean(),
    KnowYourselfQuestion.find({ active: true, type: 'domain', domain: domainKey }).lean(),
  ]);

  if (genericQuestions.length < 10) {
    throw Object.assign(
      new Error(`Need at least 10 active generic questions (found ${genericQuestions.length})`),
      { status: 400 }
    );
  }
  if (domainQuestions.length < 10) {
    throw Object.assign(
      new Error(`Need at least 10 active domain questions for "${DOMAIN_LABELS[domainKey]}" (found ${domainQuestions.length})`),
      { status: 400 }
    );
  }

  const selectedGeneric = shuffle(genericQuestions).slice(0, 10);
  const selectedDomain = shuffle(domainQuestions).slice(0, 10);

  const genericSnap = snapshotQuestions(selectedGeneric, 'generic');
  const domainSnap = snapshotQuestions(selectedDomain, 'domain');
  const allSnap = shuffle([...genericSnap, ...domainSnap]);

  const sessionId = generateSessionId();
  const now = new Date();
  const session = await KnowYourselfSession.create({
    sessionId,
    status: 'in_progress',
    email: normalizedEmail,
    domain: domainKey,
    startedAt: now,
    selectedQuestions: allSnap,
    answers: [],
  });

  return {
    sessionId: session.sessionId,
    domain: domainKey,
    domainLabel: DOMAIN_LABELS[domainKey],
    totalQuestions: 20,
    questions: allSnap.map((q, i) => ({
      questionIndex: i,
      questionId: q.questionId,
      text: q.text,
      options: q.options.map((o) => ({ optionId: o.optionId, text: o.text })),
    })),
  };
}

// ─── Shared question/answer/result (unchanged logic) ──────

export async function getKYQuestion(sessionId, questionIndex) {
  const session = await KnowYourselfSession.findOne({ sessionId });
  if (!session) throw Object.assign(new Error('Session not found'), { status: 404 });
  if (session.status !== 'in_progress') throw Object.assign(new Error('Session already completed'), { status: 400 });
  if (questionIndex < 0 || questionIndex >= session.selectedQuestions.length) {
    throw Object.assign(new Error('Invalid question index'), { status: 400 });
  }
  const alreadyAnswered = session.answers.some((a) => a.questionIndex === questionIndex);
  if (alreadyAnswered) throw Object.assign(new Error('Question already answered'), { status: 400 });
  const q = session.selectedQuestions[questionIndex];
  session.lastActiveAt = new Date();
  await session.save();
  return {
    questionIndex,
    questionId: q.questionId,
    text: q.text,
    options: q.options.map((o) => ({ optionId: o.optionId, text: o.text })),
  };
}

export async function submitKYAnswer(sessionId, { questionIndex, optionId }) {
  const session = await KnowYourselfSession.findOne({ sessionId });
  if (!session) throw Object.assign(new Error('Session not found'), { status: 404 });
  if (session.status !== 'in_progress') throw Object.assign(new Error('Session already completed'), { status: 400 });
  if (questionIndex < 0 || questionIndex >= session.selectedQuestions.length) {
    throw Object.assign(new Error('Invalid question index'), { status: 400 });
  }
  const alreadyAnswered = session.answers.some((a) => a.questionIndex === questionIndex);
  if (alreadyAnswered) throw Object.assign(new Error('Question already answered'), { status: 400 });
  if (session.answers.length >= 20) throw Object.assign(new Error('Maximum 20 answers reached'), { status: 400 });

  const q = session.selectedQuestions[questionIndex];
  const option = q.options.find((o) => String(o.optionId) === String(optionId));
  if (!option) throw Object.assign(new Error('Invalid option for this question'), { status: 400 });

  session.answers.push({
    questionIndex,
    questionId: q.questionId,
    questionText: q.text,
    optionId: option.optionId,
    optionText: option.text,
    score: option.score,
    answeredAt: new Date(),
  });
  session.lastActiveAt = new Date();

  if (session.answers.length >= 20) {
    const totalScore = session.answers.reduce((sum, a) => sum + a.score, 0);
    const maxScore = 80;
    let band, message;
    if (totalScore >= 65) { band = 'STRONG FOUNDATION'; message = 'Ready for Accelerated Growth'; }
    else if (totalScore >= 50) { band = 'MODERATE PERFORMANCE'; message = 'Targeted Improvements Needed'; }
    else if (totalScore >= 35) { band = 'SIGNIFICANT GAPS'; message = 'Strategic Overhaul Recommended'; }
    else { band = 'CRITICAL WEAKNESSES'; message = 'Immediate Action Required'; }
    session.result = {
      score: totalScore,
      maxScore,
      band,
      message,
      domain: session.domain || null,
      domainLabel: session.domain ? DOMAIN_LABELS[session.domain] : null,
    };
    session.status = 'completed';
    session.completedAt = new Date();
  }

  await session.save();
  return { accepted: true, answered: session.answers.length, complete: session.status === 'completed' };
}

export async function getKYResult(sessionId) {
  const session = await KnowYourselfSession.findOne({ sessionId });
  if (!session) throw Object.assign(new Error('Session not found'), { status: 404 });
  if (session.status !== 'completed') throw Object.assign(new Error('Session not completed'), { status: 400 });
  return {
    sessionId: session.sessionId,
    status: session.status,
    email: session.email,
    domain: session.domain,
    domainLabel: session.domain ? DOMAIN_LABELS[session.domain] : null,
    result: session.result,
    answers: session.answers.map((a) => ({
      questionIndex: a.questionIndex,
      questionText: a.questionText,
      optionText: a.optionText,
      score: a.score,
    })),
  };
}

function normalizePhone(input) {
  if (typeof input !== 'string') return null;
  const digits = input.replace(/[^\d]/g, '');
  if (digits.length < 7 || digits.length > 15) return null;
  const plus = /^\+/.test(input.trim()) ? '+' : '';
  return `${plus}${digits}`;
}

export async function submitKYContact(sessionId, { phone, contactConsent }) {
  const session = await KnowYourselfSession.findOne({ sessionId });
  if (!session) throw Object.assign(new Error('Session not found'), { status: 404 });
  if (session.status !== 'completed') {
    throw Object.assign(new Error('Contact can only be submitted after the assessment is completed'), { status: 400 });
  }
  if (contactConsent !== true) {
    throw Object.assign(new Error('Contact consent is required'), { status: 400 });
  }
  const normalized = normalizePhone(phone);
  if (!normalized) {
    throw Object.assign(new Error('A valid phone number is required'), { status: 400 });
  }
  if (session.contactSubmittedAt) {
    throw Object.assign(new Error('Contact request already submitted'), { status: 409 });
  }
  session.phone = normalized;
  session.contactConsent = true;
  session.contactSubmittedAt = new Date();
  await session.save();
  return {
    sessionId: session.sessionId,
    submitted: true,
    contactSubmittedAt: session.contactSubmittedAt,
  };
}

