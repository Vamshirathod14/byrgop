import * as kyService from '../services/knowYourselfService.js';

export const startKYSession = async (req, res, next) => {
  try {
    const session = await kyService.startKYSession();
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
