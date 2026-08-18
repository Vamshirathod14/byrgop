import * as kyService from '../services/knowYourselfService.js';
import KnowYourselfSession from '../models/KnowYourselfSession.js';
import { asyncHandler } from '../middleware/errors.js';

export const startKYSession = async (req, res, next) => {
  try {
    const session = await kyService.startKYSession();
    res.status(201).json(session);
  } catch (err) { next(err); }
};

export const startKYAssignment = async (req, res, next) => {
  try {
    const { email, domain } = req.body;
    const session = await kyService.startKYAssignment(email, domain);
    res.status(201).json(session);
  } catch (err) { next(err); }
};

export const getKYQuestion = async (req, res, next) => {
  try {
    const { sessionId, index } = req.params;
    const question = await kyService.getKYQuestion(sessionId, parseInt(index, 10));
    res.json({ question });
  } catch (err) { next(err); }
};

export const submitKYAnswer = async (req, res, next) => {
  try {
    const result = await kyService.submitKYAnswer(req.params.sessionId, req.body);
    res.json(result);
  } catch (err) { next(err); }
};

export const getKYResult = async (req, res, next) => {
  try {
    const result = await kyService.getKYResult(req.params.sessionId);
    res.json(result);
  } catch (err) { next(err); }
};

export const submitKYContact = async (req, res, next) => {
  try {
    const result = await kyService.submitKYContact(req.params.sessionId, req.body);
    res.status(201).json(result);
  } catch (err) { next(err); }
};

export const listKYSessions = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
  const filter = {};
  if (req.query.status && req.query.status !== 'all') filter.status = req.query.status;
  if (req.query.domain && req.query.domain !== 'all') filter.domain = req.query.domain;
  const sessions = await KnowYourselfSession.find(filter)
    .sort({ startedAt: -1 })
    .limit(limit)
    .select('sessionId email phone domain status result contactConsent contactSubmittedAt startedAt completedAt');
  res.json(sessions);
});
