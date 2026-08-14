import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import api from './api/client.js';
import AnimatedBackground from './components/AnimatedBackground.jsx';
import IntroScreen from './screens/IntroScreen.jsx';
import QuestionScreen from './screens/QuestionScreen.jsx';
import ResultScreen from './screens/ResultScreen.jsx';
import KnowYourselfScreen from './screens/KnowYourselfScreen.jsx';
import KnowYourselfResult from './screens/KnowYourselfResult.jsx';
import { brand } from './theme/brand.js';

const ease = [0.22, 1, 0.36, 1];

export default function App() {
  const [screen, setScreen] = useState('intro');
  const [sessionId, setSessionId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [finalizeError, setFinalizeError] = useState(false);
  const fetchingRef = useRef(false);

  // Know Yourself state
  const [kySessionId, setKySessionId] = useState(null);
  const [kyQuestions, setKyQuestions] = useState([]);
  const [kyIndex, setKyIndex] = useState(0);
  const [kyQuestion, setKyQuestion] = useState(null);
  const [kyResult, setKyResult] = useState(null);
  const kyFetchingRef = useRef(false);

  // ─── Onboarding ──────────────────────────────────────────

  const fetchQuestion = useCallback(
    async (sid, categoryKey) => {
      if (!sid || fetchingRef.current) return;
      fetchingRef.current = true;
      setError(null);
      try {
        const data = await api.nextQuestion(sid, categoryKey);
        setQuestion(data.question);
      } catch (e) {
        setError(e.message);
      } finally {
        fetchingRef.current = false;
      }
    },
    []
  );

  const handleBegin = useCallback(async () => {
    setError(null);
    try {
      const session = await api.startAssessment();
      setSessionId(session.sessionId);
      setCategories(session.categories);
      setIndex(0);
      await fetchQuestion(session.sessionId, session.categories[0]);
      setScreen('question');
    } catch (e) {
      setError(e.message);
    }
  }, [fetchQuestion]);

  const rerollSameCategory = useCallback(
    async (categoryKey) => {
      if (!question) return;
      try {
        await api.reportTimeout(sessionId, {
          questionId: question.questionId,
          categoryKey,
        });
      } catch (_) {}
      await fetchQuestion(sessionId, categoryKey);
    },
    [sessionId, question, fetchQuestion]
  );

  const handleTimeout = useCallback(() => {
    if (!question) return;
    rerollSameCategory(question.category);
  }, [question, rerollSameCategory]);

  const finalize = useCallback(async () => {
    if (!sessionId) return;
    setFinalizeError(false);
    setError(null);
    try {
      const r = await api.getResult(sessionId);
      setResult(r);
      setScreen('result');
    } catch (e) {
      setFinalizeError(true);
      setError(e.message);
    }
  }, [sessionId]);

  const handleAnswer = useCallback(
    async (optionId) => {
      if (!question || !sessionId) return;
      try {
        const res = await api.submitAnswer(sessionId, {
          questionId: question.questionId,
          optionId,
          categoryKey: question.category,
        });

        if (!res.accepted && res.timedOut) {
          await rerollSameCategory(question.category);
          return;
        }

        const next = index + 1;
        if (next >= categories.length) {
          setScreen('calculating');
          await finalize();
        } else {
          setIndex(next);
          await fetchQuestion(sessionId, categories[next]);
        }
      } catch (e) {
        setError(e.message);
      }
    },
    [question, sessionId, index, categories, fetchQuestion, rerollSameCategory, finalize]
  );

  // ─── Know Yourself ───────────────────────────────────────

  const fetchKYQuestion = useCallback(
    async (sid, qIndex) => {
      if (kyFetchingRef.current) return;
      kyFetchingRef.current = true;
      setError(null);
      try {
        const data = await api.kyQuestion(sid, qIndex);
        setKyQuestion(data.question);
      } catch (e) {
        setError(e.message);
      } finally {
        kyFetchingRef.current = false;
      }
    },
    []
  );

  const handleBeginKY = useCallback(async () => {
    setError(null);
    try {
      const session = await api.startKY();
      setKySessionId(session.sessionId);
      setKyQuestions(session.questions);
      setKyIndex(0);
      setKyQuestion(session.questions[0]);
      setScreen('kyQuestion');
    } catch (e) {
      setError(e.message);
    }
  }, []);

  const handleKYAnswer = useCallback(
    async (optionId) => {
      if (!kyQuestion || !kySessionId) return;
      try {
        const res = await api.submitKYAnswer(kySessionId, {
          questionIndex: kyIndex,
          optionId,
        });

        if (res.complete) {
          setScreen('kyCalculating');
          try {
            const r = await api.kyResult(kySessionId);
            setKyResult(r);
            setScreen('kyResult');
          } catch (e) {
            setError(e.message);
          }
        } else {
          const next = kyIndex + 1;
          setKyIndex(next);
          setKyQuestion(kyQuestions[next]);
        }
      } catch (e) {
        setError(e.message);
      }
    },
    [kyQuestion, kySessionId, kyIndex, kyQuestions]
  );

  const handleKYExplore = useCallback(() => {
    setScreen('intro');
    setKySessionId(null);
    setKyQuestions([]);
    setKyIndex(0);
    setKyQuestion(null);
    setKyResult(null);
  }, []);

  // ─── Error auto-clear ────────────────────────────────────

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(null), 4000);
      return () => clearTimeout(t);
    }
  }, [error]);

  // ─── Render ──────────────────────────────────────────────

  return (
    <div className="min-h-screen text-mist">
      <AnimatedBackground />
      <AnimatePresence mode="wait">
        {/* ── Onboarding ── */}
        {screen === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.5 }}
          >
            <IntroScreen onBegin={handleBegin} />
          </motion.div>
        )}

        {screen === 'question' && question && (
          <motion.div
            key={`q-${question.questionId}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.45 }}
          >
            <QuestionScreen
              question={question}
              index={index}
              total={categories.length}
              onAnswer={handleAnswer}
              onTimeout={handleTimeout}
            />
          </motion.div>
        )}

        {screen === 'calculating' && (
          <motion.div
            key="calculating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.45 }}
            className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease }}
              className="relative flex h-20 w-20 items-center justify-center"
            >
              <div
                className="absolute inset-0 rounded-full blur-xl"
                style={{ background: `${brand.accent}22` }}
              />
              <div
                className="h-14 w-14 animate-spin rounded-full border-2"
                style={{ borderColor: 'rgba(255,255,255,0.12)', borderTopColor: brand.accent }}
              />
            </motion.div>
            <h1 className="font-display mt-8 text-3xl font-semibold text-mist sm:text-4xl">
              Preparing your Business Snapshot
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-mist-muted">
              Scoring your three dimensions with BYRGOP&rsquo;s weighted methodology.
            </p>
            {finalizeError && (
              <button
                onClick={finalize}
                className="mt-6 rounded-full border border-white/15 px-6 py-2.5 text-sm font-semibold text-mist transition-colors hover:border-white/30"
              >
                Retry
              </button>
            )}
          </motion.div>
        )}

        {screen === 'result' && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ResultScreen result={result} onKY={handleBeginKY} />
          </motion.div>
        )}

        {/* ── Know Yourself ── */}
        {screen === 'kyQuestion' && kyQuestion && (
          <motion.div
            key={`ky-q-${kyIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.45 }}
          >
            <KnowYourselfScreen
              question={kyQuestion}
              index={kyIndex}
              total={20}
              onAnswer={handleKYAnswer}
            />
          </motion.div>
        )}

        {screen === 'kyCalculating' && (
          <motion.div
            key="ky-calculating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.45 }}
            className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease }}
              className="relative flex h-20 w-20 items-center justify-center"
            >
              <div
                className="absolute inset-0 rounded-full blur-xl"
                style={{ background: `${brand.accent}22` }}
              />
              <div
                className="h-14 w-14 animate-spin rounded-full border-2"
                style={{ borderColor: 'rgba(255,255,255,0.12)', borderTopColor: brand.accent }}
              />
            </motion.div>
            <h1 className="font-display mt-8 text-3xl font-semibold text-mist sm:text-4xl">
              Calculating your Know Yourself result
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-mist-muted">
              Scoring your 20 responses.
            </p>
          </motion.div>
        )}

        {screen === 'kyResult' && kyResult && (
          <motion.div
            key="ky-result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <KnowYourselfResult result={kyResult} onExplore={handleKYExplore} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-red-500/30 bg-[#1a0f14] px-5 py-2.5 text-sm text-red-400 shadow-card"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
