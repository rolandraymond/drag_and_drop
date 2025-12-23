import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useEditorStore } from '../hooks/useEditorStore';
import type { EditorElement } from '../types/editor';

/* ================= helpers ================= */
function partialMatchScore(user: string, model: string) {
  const u = normalizeAnswer(user).split(' ').filter(Boolean);
  const m = normalizeAnswer(model).split(' ').filter(Boolean);

  if (u.length === 0 || m.length === 0) return 0;

  const matched = u.filter((word) => m.includes(word)).length;
  return matched / m.length;
}

function normalizeAnswer(value: string) {
  return value.trim().toLowerCase();
}

function getFirstQuestion(elements: EditorElement[]) {
  return elements.find((el) => el.type === 'question' || el.type === 'imageQuestion') ?? null;
}

function isImageQuestion(q: EditorElement | null): q is EditorElement & { image: string } {
  return Boolean(q && q.type === 'imageQuestion' && 'image' in q);
}
const QUIZ_STORAGE_KEY = 'quiz-runtime-state';

/* ================= component ================= */

export default function QuizRuntime() {
  const pages = useEditorStore((s) => s.pages);

  const [mode, setMode] = useState<'quiz' | 'results' | 'review'>('quiz');
  const [pageIndex, setPageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
useEffect(() => {
  const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
  if (!raw) return;

  try {
    const saved = JSON.parse(raw);
    setAnswers(saved.answers ?? {});
    setSubmitted(saved.submitted ?? {});
    setPageIndex(saved.pageIndex ?? 0);
  } catch {
    localStorage.removeItem(QUIZ_STORAGE_KEY);
  }
}, []);

useEffect(() => {
  const payload = {
    answers,
    submitted,
    pageIndex,
  };

  localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(payload));
}, [answers, submitted, pageIndex]);


  /* ================= derived data (ALL HOOKS FIRST) ================= */

  const POINTS_PER_QUESTION = 5;

  const pagesWithQuestions = useMemo(
    () => pages.filter((p) => getFirstQuestion(p.elements)),
    [pages],
  );

  const totalQuestions = pagesWithQuestions.length;


const reviewItems = useMemo(() => {
  return pagesWithQuestions.map((page) => {
    const q = getFirstQuestion(page.elements);
    const userRaw = answers[page.id] ?? '';
    const modelRaw = q?.answer ?? '';

    const matchScore = partialMatchScore(userRaw, modelRaw);

    return {
      id: page.id,
      name: page.name,
      question: q?.question ?? '',
      image: q?.type === 'imageQuestion' ? q.image ?? '' : '',
      userRaw,
      modelRaw,
      score: matchScore * POINTS_PER_QUESTION,
      isCorrect: matchScore === 1,
      matchScore,
    };
  });
}, [pagesWithQuestions, answers]);
const correctAnswersCount = useMemo(() => {
  return reviewItems.filter((item) => item.matchScore === 1).length;
}, [reviewItems]);

const partialAnswersCount = useMemo(() => {
  return reviewItems.filter((item) => item.matchScore > 0 && item.matchScore < 1).length;
}, [reviewItems]);

const wrongAnswersCount = useMemo(() => {
  return reviewItems.filter((item) => item.matchScore === 0).length;
}, [reviewItems]);

const liveScore = useMemo(() => {
  return reviewItems
    .filter((item) => submitted[item.id])
    .reduce((sum, item) => sum + item.score, 0);
}, [reviewItems, submitted]);


const score = useMemo(() => {
  return reviewItems.reduce((sum, item) => sum + item.score, 0);
}, [reviewItems]);



  /* ================= guards ================= */

  if (!pages || pages.length === 0) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='bg-white border rounded-xl p-6'>No quiz pages</div>
      </div>
    );
  }

  /* ================= current page ================= */

  const currentPage = pages[pageIndex];
  const elements = currentPage.elements ?? [];


  const pageId = currentPage.id;
  const userAnswer = answers[pageId] ?? '';
  const isSubmitted = submitted[pageId] ?? false;
  const question = useMemo(() => getFirstQuestion(elements), [elements]);

  const canGoPrev = pageIndex > 0;
  const isLastPage = pageIndex === pages.length - 1;

  /* ================= actions ================= */

const handleSubmit = () => {
  if (!question) return toast.info('No question on this page.');
  if (!userAnswer.trim()) return toast.error('Please type an answer first.');
  if (!question.answer?.trim()) return toast.warning('No model answer.');

  if (isSubmitted) return;

  setSubmitted((p) => ({ ...p, [pageId]: true }));

  const matchScore = partialMatchScore(userAnswer, question.answer);

  if (matchScore === 1) {
    toast.success('Perfect answer ✅');
  } else if (matchScore > 0) {
    toast.info(`Partially correct (${(matchScore * 100).toFixed(0)}%)`);
  } else {
    toast.error('Incorrect ❌');
  }
};

  const handleNext = () => {
    if (isLastPage) {
      setMode('results');
    } else {
      setPageIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (canGoPrev) setPageIndex((i) => i - 1);
  };


const resetQuiz = () => {
  setPageIndex(0);
  setAnswers({});
  setSubmitted({});
  setMode('quiz');
  localStorage.removeItem(QUIZ_STORAGE_KEY);
};


  /* ================= RESULTS ================= */

  if (mode === 'results') {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='bg-white border rounded-xl p-8 w-full max-w-md space-y-4'>
          <div className='text-center'>
            <div className='text-2xl font-semibold'>Quiz Results</div>
            <div className='text-sm text-gray-500'>Completed</div>
          </div>
          <div className='text-sm space-y-1'>
            <div className='flex justify-between'>
              <span>Total</span>
              <span>{totalQuestions}</span>
            </div>

            <div className='flex justify-between text-green-700'>
              <span>Correct</span>
              <span>{correctAnswersCount}</span>
            </div>

            <div className='flex justify-between text-yellow-600'>
              <span>Partial</span>
              <span>{partialAnswersCount}</span>
            </div>

            <div className='flex justify-between text-red-600'>
              <span>Wrong</span>
              <span>{wrongAnswersCount}</span>
            </div>

            <hr />

            <div className='flex justify-between font-semibold'>
              <span>Score</span>
              <span>{score.toFixed(1)}</span>
            </div>
          </div>

          <button onClick={resetQuiz} className='border rounded-lg px-4 py-2 w-full'>
            Restart Quiz
          </button>

          <button onClick={() => setMode('review')} className='border rounded-lg px-4 py-2 w-full'>
            Review Answers
          </button>

          <a href='/' className='block bg-black text-white text-center rounded-lg px-4 py-2'>
            Exit
          </a>
        </div>
      </div>
    );
  }

  /* ================= REVIEW ================= */

  if (mode === 'review') {
    return (
      <div className='min-h-screen bg-gray-50 p-6'>
        <div className='max-w-3xl mx-auto space-y-4'>
          {reviewItems.map((item, i) => (
            <div key={item.id} className='bg-white border rounded-xl p-5'>
              <div className='flex justify-between mb-2'>
                <div>
                  <div className='text-sm text-gray-500'>Question {i + 1}</div>
                  <div className='font-semibold'>{item.question}</div>
                  <div className='text-sm text-gray-500'>
                    Score: {item.score.toFixed(1)} / {POINTS_PER_QUESTION}
                  </div>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded ${
                    item.matchScore === 1
                      ? 'bg-green-100 text-green-700'
                      : item.matchScore > 0
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {item.matchScore === 1 ? 'Correct' : item.matchScore > 0 ? 'Partial' : 'Wrong'}
                </span>
              </div>

              {item.image && <img src={item.image} className='rounded border mb-3' />}

              <div className='text-sm space-y-1'>
                <div>
                  <b>Your answer:</b> {item.userRaw || '—'}
                </div>
                <div>
                  <b>Model answer:</b> {item.modelRaw || '—'}
                </div>
              </div>
            </div>
          ))}

          <div className='flex gap-2 pt-4'>
            <button onClick={resetQuiz} className='border rounded-lg px-4 py-2'>
              Restart Quiz
            </button>
            <a href='/' className='bg-black text-white rounded-lg px-4 py-2'>
              Exit
            </a>
          </div>
        </div>
      </div>
    );
  }

  /* ================= QUIZ ================= */

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='sticky top-0 bg-white border-b px-6 py-4 flex justify-between'>
        <div>
          <div className='text-sm text-gray-500'>
            Page {pageIndex + 1} of {pages.length}
          </div>
          <div className='font-semibold'>{currentPage.name}</div>
        </div>

        <div className='font-medium'>
          Score: {mode === 'quiz' ? liveScore.toFixed(1) : score.toFixed(1)}
        </div>
      </div>

      <div className='max-w-3xl mx-auto p-6 space-y-6'>
        {question ? (
          <div className='bg-white border rounded-xl p-5 space-y-4'>
            {isImageQuestion(question) && (
              <img src={question.image} alt='Question' className='rounded border' />
            )}

            <div className='font-semibold'>{question.question}</div>

            <input
              value={userAnswer}
              onChange={(e) => setAnswers((p) => ({ ...p, [pageId]: e.target.value }))}
              disabled={isSubmitted}
              className='w-full border rounded-lg px-3 py-2'
            />

            <button
              onClick={handleSubmit}
              disabled={isSubmitted}
              className='bg-black text-white px-4 py-2 rounded-lg'
            >
              Submit Answer
            </button>
          </div>
        ) : (
          <div className='bg-white border rounded-xl p-5'>No question on this page</div>
        )}

        <div className='flex justify-between'>
          <button
            onClick={handlePrev}
            disabled={!canGoPrev}
            className='border rounded-lg px-4 py-2'
          >
            ← Prev
          </button>

          <button
            onClick={handleNext}
            disabled={!question || !isSubmitted}
            className='border rounded-lg px-4 py-2'
          >
            {isLastPage ? 'Finish Quiz' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}
