import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { useEditorStore } from '../hooks/useEditorStore';
import type { EditorElement } from '../types/editor';
import PreviewSidebar from './PreviewSidebar';

/* ================= helpers ================= */

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function isCorrect(user: string, answer: string) {
  return normalize(user) === normalize(answer);
}

function getQuestions(elements: EditorElement[]) {
  return elements.filter(
    (el) => el.type === 'question' || el.type === 'imageQuestion'
  );
}

/* ================= component ================= */

export default function QuizRuntime() {
  const navigate = useNavigate();

  /* ✅ Zustand selector (stable – no infinite loop) */
  const pages = useEditorStore((s) => s.pages);

  const [pageIndex, setPageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  /* ================= guards ================= */

  if (!pages.length) {
    return <div className="p-10 text-center">No pages to preview</div>;
  }

  const currentPage = pages[pageIndex];
  const questions = getQuestions(currentPage.elements);

  /* ================= progress ================= */

  const answeredCorrect = questions.filter((q, i) => {
    const key = `${currentPage.id}-${i}`;
    return submitted[key] && isCorrect(answers[key], q.answer);
  }).length;

  const progress =
    questions.length === 0
      ? 0
      : Math.round((answeredCorrect / questions.length) * 100);

  const canGoNext = answeredCorrect === questions.length;

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ===== SIDEBAR ===== */}
      <PreviewSidebar
        pages={pages}
        activePageId={currentPage.id}
        onSelectPage={() => {
          toast.info('Finish current page first');
        }}
      />

      {/* ===== MAIN ===== */}
      <div className="flex-1">

        {/* ===== HEADER ===== */}
        <div className="sticky top-0 bg-white border-b p-4 relative">

          {/* progress bar */}
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-200">
            <div
              className="h-full bg-black transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center">

            <button
              onClick={() => navigate('/editor')}
              className="text-sm px-3 py-1 border rounded"
            >
              ← Back to Editor
            </button>

            <div className="text-center">
              <div className="font-bold">{currentPage.name}</div>
              <div className="text-xs text-gray-500">
                {answeredCorrect} / {questions.length} correct
              </div>
            </div>

            <div className="text-sm font-medium">
              {progress}%
            </div>
          </div>
        </div>

        {/* ===== CONTENT ===== */}
        <div className="max-w-xl mx-auto p-6 space-y-6">

          {currentPage.elements.map((el, index) => {
            if (el.type === 'text') {
              return (
                <p key={el.id} className="text-gray-700">
                  {el.value}
                </p>
              );
            }

            if (el.type === 'question' || el.type === 'imageQuestion') {
              const key = `${currentPage.id}-${index}`;
              const userAnswer = answers[key] ?? '';
              const isDone = submitted[key];
              const correct = isDone && isCorrect(userAnswer, el.answer);

              return (
                <div
                  key={el.id}
                  className={`border rounded p-4 space-y-2
                    ${
                      !isDone
                        ? ''
                        : correct
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                    }`}
                >
                  {el.type === 'imageQuestion' && el.image && (
                    <img
                      src={el.image}
                      alt=""
                      className="rounded border"
                    />
                  )}

                  <div className="font-medium">
                    {el.question}
                  </div>

                  <input
                    value={userAnswer}
                    readOnly={isDone}
                    onChange={(e) =>
                      setAnswers((p) => ({
                        ...p,
                        [key]: e.target.value,
                      }))
                    }
                    className="w-full border px-3 py-2"
                  />

                  {!isDone && (
                    <button
                      onClick={() => {
                        if (!userAnswer.trim()) {
                          toast.error('Answer required');
                          return;
                        }

                        setSubmitted((p) => ({
                          ...p,
                          [key]: true,
                        }));

                        if (isCorrect(userAnswer, el.answer)) {
                          toast.success('Correct');
                        } else {
                          toast.error('Wrong answer');
                        }
                      }}
                      className="bg-black text-white px-4 py-1"
                    >
                      Submit
                    </button>
                  )}

                  {isDone && !correct && (
                    <div className="text-sm text-red-700">
                      Correct answer: {el.answer}
                    </div>
                  )}
                </div>
              );
            }

            return null;
          })}

          {/* ===== PAGE NAV ===== */}
          <div className="flex justify-between pt-4">

            <button
              disabled={pageIndex === 0}
              onClick={() => setPageIndex((i) => i - 1)}
              className="disabled:opacity-50"
            >
              ← Prev Page
            </button>

            <button
              disabled={!canGoNext}
              onClick={() => setPageIndex((i) => i + 1)}
              className="disabled:opacity-50"
            >
              Next Page →
            </button>
          </div>

          {!canGoNext && (
            <div className="text-center text-sm text-red-600">
              Fix the highlighted answers first
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
