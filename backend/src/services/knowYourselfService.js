import KnowYourselfQuestion from '../models/KnowYourselfQuestion.js';
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

export async function startKYSession() {
  const activeQuestions = await KnowYourselfQuestion.find({ active: true }).lean();
  if (activeQuestions.length < 20) {
    throw Object.assign(
      new Error(`Need at least 20 active Know Yourself questions (found ${activeQuestions.length})`),
      { status: 400 }
    );
  }
  const selected = shuffle(activeQuestions).slice(0, 20);
  const snapshot = selected.map((q) => ({
    questionId: q._id,
    text: q.text,
    options: q.options
      .filter((o) => o.active)
      .map((o) => ({
        optionId: o._id,
        text: o.text,
        score: o.score,
      })),
  }));
  const sessionId = generateSessionId();
  const session = await KnowYourselfSession.create({
    sessionId,
    status: 'in_progress',
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
    session.result = { score: totalScore, maxScore, band, message };
    session.status = 'completed';
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
    result: session.result,
    answers: session.answers.map((a) => ({
      questionIndex: a.questionIndex,
      questionText: a.questionText,
      optionText: a.optionText,
      score: a.score,
    })),
  };
}
