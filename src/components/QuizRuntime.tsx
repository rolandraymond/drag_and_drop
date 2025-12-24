import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useEditorStore } from '../hooks/useEditorStore';
import type { EditorElement } from '../types/editor';

const STORAGE_KEY = 'quiz-runtime-state';

/* ================= helpers ================= */

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function partialMatchScore(user: string, model: string) {
  const u = normalize(user).split(' ').filter(Boolean);
  const m = normalize(model).split(' ').filter(Boolean);
  if (!u.length || !m.length) return 0;
  const matched = u.filter((w) => m.includes(w)).length;
  return matched / m.length;
}

function getQuestion(elements: EditorElement[]) {
  return elements.find((el) => el.type === 'question' || el.type === 'imageQuestion') ?? null;
}

function getInput(elements: EditorElement[]) {
  return elements.find((el) => el.type === 'input') ?? null;
}

function isImageQuestion(el: EditorElement | null): el is EditorElement & { image: string } {
  return Boolean(el && el.type === 'imageQuestion');
}

/* ================= component ================= */

export default function QuizRuntime() {
  const pages = useEditorStore((s) => s.pages);

  const [pageIndex, setPageIndex] = useState(0);
  const [mode, setMode] = useState<'quiz' | 'results' | 'review'>('quiz');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  /* ===== restore ===== */
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const saved = JSON.parse(raw);
      setAnswers(saved.answers ?? {});
      setSubmitted(saved.submitted ?? {});
      setPageIndex(saved.pageIndex ?? 0);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  /* ===== persist ===== */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, submitted, pageIndex }));
  }, [answers, submitted, pageIndex]);

  if (!pages.length) {
    return <div className='p-10 text-center'>No quiz pages</div>;
  }

  const currentPage = pages[pageIndex];
  const pageId = currentPage.id;

  const question = getQuestion(currentPage.elements ?? []);
  const input = getInput(currentPage.elements ?? []);

  const userAnswer = answers[pageId] ?? '';
  const isSubmitted = submitted[pageId] ?? false;
  const isLast = pageIndex === pages.length - 1;

  const pageLabel = currentPage.name?.trim() ? currentPage.name : `Page ${pageIndex + 1}`;

  /* ===== score ===== */
  const score = useMemo(() => {
    return pages.reduce((sum, p) => {
      if (!submitted[p.id]) return sum;
      const q = getQuestion(p.elements ?? []);
      if (!q?.answer) return sum;
      return sum + partialMatchScore(answers[p.id] ?? '', q.answer) * 5;
    }, 0);
  }, [answers, submitted, pages]);

  /* ===== actions ===== */

  const submit = () => {
    if (!question) return;
    if (!userAnswer.trim()) {
      toast.error('Type an answer first');
      return;
    }

    setSubmitted((p) => ({ ...p, [pageId]: true }));

    const match = partialMatchScore(userAnswer, question.answer ?? '');
    if (match === 1) toast.success('Correct ✅');
    else if (match > 0) toast.info('Partially correct');
    else toast.error('Wrong ❌');
  };

  const next = () => {
    if (isLast) setMode('results');
    else setPageIndex((i) => i + 1);
  };

  const prev = () => setPageIndex((i) => Math.max(0, i - 1));

  /* ================= RESULTS ================= */

  if (mode === 'results') {
    return (
      <div className='p-10 max-w-md mx-auto space-y-4'>
        <h2 className='text-xl font-bold'>Results</h2>
        <div>Score: {score.toFixed(1)}</div>

        <button
          onClick={() => {
            setAnswers({});
            setSubmitted({});
            setPageIndex(0);
            setMode('quiz');
            localStorage.removeItem(STORAGE_KEY);
          }}
          className='border px-4 py-2'
        >
          Restart
        </button>
      </div>
    );
  }

  /* ================= QUIZ ================= */

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* header */}
      <div className='sticky top-0 bg-white border-b p-4 flex justify-between'>
        <div className='font-bold'>{pageLabel}</div>
        <div>Score: {score.toFixed(1)}</div>
      </div>

      {/* pages nav */}
      <div className='flex justify-center gap-2 py-4 sticky top-[64px] bg-gray-50 z-10'>
        {pages.map((p, index) => {
          const canNavigate = index === pageIndex || submitted[p.id] || index < pageIndex;

          return (
            <button
              key={p.id}
              disabled={!canNavigate}
              onClick={() => canNavigate && setPageIndex(index)}
              className={`
                w-9 h-9 rounded-full border text-sm
                ${
                  index === pageIndex
                    ? 'bg-black text-white'
                    : submitted[p.id]
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-400'
                }
              `}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {/* content */}
      <div className='max-w-xl mx-auto p-6 space-y-4'>
        {/* QUESTION */}
        {question && (
          <>
            {isImageQuestion(question) && <img src={question.image} className='rounded border' />}

            <div className='font-semibold'>{question.question}</div>

            <input
              value={userAnswer}
              disabled={isSubmitted}
              onChange={(e) => setAnswers((p) => ({ ...p, [pageId]: e.target.value }))}
              className='w-full border px-3 py-2'
            />

            <button
              onClick={submit}
              disabled={isSubmitted}
              className='bg-black text-white px-4 py-2'
            >
              Submit Answer
            </button>
          </>
        )}

        {/* INPUT PAGE */}
        {input && !question && (
          <div className='bg-white border rounded-xl p-5 space-y-4'>
            <label className='text-sm font-medium text-gray-600'>{input.label ?? 'Input'}</label>

            <input
              value={userAnswer}
              onChange={(e) => setAnswers((p) => ({ ...p, [pageId]: e.target.value }))}
              placeholder={input.placeholder}
              className='w-full border px-3 py-2'
            />

            <p className='text-xs text-gray-400'>This page does not affect your score</p>
          </div>
        )}

        <div className='flex justify-between pt-4'>
          <button onClick={prev} disabled={pageIndex === 0}>
            ← Prev
          </button>
          <button onClick={next} disabled={question ? !isSubmitted : false}>
            {isLast ? 'Finish' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}
