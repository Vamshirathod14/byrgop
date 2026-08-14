import { Router } from 'express';
import { startAssessment, nextQuestion, recordQuestionTimeout, answerQuestion, assessmentResult } from '../controllers/assessmentController.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { listCategories, getCategory, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { listStages, getStage, createStage, updateStage, deleteStage } from '../controllers/stageController.js';
import { listQuestions, getQuestion, createQuestion, updateQuestion, deleteQuestion } from '../controllers/questionController.js';
import { listResults, createResult, updateResult, deleteResult } from '../controllers/resultController.js';
import { listSessions, getSession, sessionStats } from '../controllers/sessionController.js';
import { listKYQuestions, getKYQuestion, createKYQuestion, updateKYQuestion, deleteKYQuestion } from '../controllers/knowYourselfController.js';
import { startKYSession, getKYQuestion as getKYSessionQuestion, submitKYAnswer, getKYResult } from '../controllers/knowYourselfSessionController.js';

const router = Router();

router.get('/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

router.post('/assessments', startAssessment);
router.get('/assessments/:sessionId/next/:category', nextQuestion);
router.post('/assessments/:sessionId/timeout', recordQuestionTimeout);
router.post('/assessments/:sessionId/answer', answerQuestion);
router.get('/assessments/:sessionId/result', assessmentResult);

router.use('/admin', adminAuth);
router.get('/admin/stats', sessionStats);
router.get('/admin/sessions', listSessions);
router.get('/admin/sessions/:id', getSession);

router.get('/admin/categories', listCategories);
router.get('/admin/categories/:id', getCategory);
router.post('/admin/categories', createCategory);
router.put('/admin/categories/:id', updateCategory);
router.delete('/admin/categories/:id', deleteCategory);

router.get('/admin/stages', listStages);
router.get('/admin/stages/:id', getStage);
router.post('/admin/stages', createStage);
router.put('/admin/stages/:id', updateStage);
router.delete('/admin/stages/:id', deleteStage);

router.get('/admin/questions', listQuestions);
router.get('/admin/questions/:id', getQuestion);
router.post('/admin/questions', createQuestion);
router.put('/admin/questions/:id', updateQuestion);
router.delete('/admin/questions/:id', deleteQuestion);

router.get('/admin/results', listResults);
router.post('/admin/results', createResult);
router.put('/admin/results/:id', updateResult);
router.delete('/admin/results/:id', deleteResult);

// Know Yourself – public assessment
router.post('/know-yourself', startKYSession);
router.get('/know-yourself/:sessionId/question/:index', getKYSessionQuestion);
router.post('/know-yourself/:sessionId/answer', submitKYAnswer);
router.get('/know-yourself/:sessionId/result', getKYResult);

// Know Yourself – admin CRUD
router.get('/admin/know-yourself', listKYQuestions);
router.get('/admin/know-yourself/:id', getKYQuestion);
router.post('/admin/know-yourself', createKYQuestion);
router.put('/admin/know-yourself/:id', updateKYQuestion);
router.delete('/admin/know-yourself/:id', deleteKYQuestion);

export default router;
