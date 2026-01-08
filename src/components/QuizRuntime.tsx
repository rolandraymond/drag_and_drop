import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useEditorStore } from '../hooks/useEditorStore';
import type { EditorElement } from '../types/editor';
import PreviewSidebar from './PreviewSidebar';

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function isCorrect(user: string, answer: string) {
  return normalize(user) === normalize(answer);
}

function getQuestions(elements: EditorElement[]) {
  return elements.filter((el) => el.type === 'question' || el.type === 'imageQuestion');
}

function pageQuestionKey(pageId: string, elementIndex: number) {
  return `${pageId}-${elementIndex}`;
}

export default function QuizRuntime() {
  const navigate = useNavigate();
  const pages = useEditorStore((s) => s.pages);

  const [pageIndex, setPageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submittedPages, setSubmittedPages] = useState<Record<string, boolean>>({});

  const currentPage = pages[pageIndex];
  const currentPageId = currentPage.id;

  const isCurrentPageSubmitted = !!submittedPages[currentPageId];

  const currentQuestions = useMemo(
    () => getQuestions(currentPage.elements),
    [currentPage.elements],
  );
  if (!pages.length || !currentPage) {
    return <div className='p-10 text-center'>No pages to preview</div>;
  }
  const handleSubmitPage = () => {
    const questions = currentQuestions;

    if (questions.length === 0) {
      toast.info('No questions on this page');
      setSubmittedPages((p) => ({ ...p, [currentPageId]: true }));
      return;
    }

    const hasEmpty = questions.some((q) => {
      const idx = currentPage.elements.indexOf(q as any);
      const key = pageQuestionKey(currentPageId, idx);
      return !(answers[key] ?? '').trim();
    });

    if (hasEmpty) {
      toast.error('Answer all questions on this page first');
      return;
    }

    let total = 0;
    let correct = 0;

    currentPage.elements.forEach((el, idx) => {
      if (el.type !== 'question' && el.type !== 'imageQuestion') return;

      total++;
      const key = pageQuestionKey(currentPageId, idx);
      const userAnswer = answers[key] ?? '';

      if (isCorrect(userAnswer, el.answer)) correct++;
    });

    setSubmittedPages((p) => ({ ...p, [currentPageId]: true }));
    toast.success(`Page score: ${correct} / ${total}`);
  };

  const canGoPrev = pageIndex > 0;
  const canGoNext = pageIndex < pages.length - 1;

  return (
    <div className='min-h-screen bg-gray-50 flex'>
      <PreviewSidebar
        pages={pages}
        activePageId={currentPageId}
        onSelectPage={(id) => {
          const index = pages.findIndex((p) => p.id === id);
          if (index === -1) return;
          setPageIndex(index);
        }}
      />

      <div className='flex-1'>
        <div className='sticky top-0 bg-white border-b p-4 flex justify-between items-center'>
          <button onClick={() => navigate('/editor')} className='text-sm px-3 py-1 border rounded'>
            ← Back to Editor
          </button>

          <div className='font-semibold'>{currentPage.name}</div>

          <div className='text-sm text-gray-500'>
            Page {pageIndex + 1} / {pages.length}
          </div>
        </div>

        <div className='max-w-xl mx-auto p-6 space-y-6'>
          {currentPage.elements.map((el, index) => {
            if (el.type === 'text') {
              return (
                <p key={el.id} className='text-gray-700'>
                  {el.value}
                </p>
              );
            }

            if (el.type === 'question' || el.type === 'imageQuestion') {
              const key = pageQuestionKey(currentPageId, index);
              const userAnswer = answers[key] ?? '';

              const correct = isCurrentPageSubmitted && isCorrect(userAnswer, el.answer);

              const wrong = isCurrentPageSubmitted && !isCorrect(userAnswer, el.answer);

              return (
                <div
                  key={el.id}
                  className={`border rounded p-4 space-y-2 ${
                    !isCurrentPageSubmitted
                      ? ''
                      : correct
                      ? 'border-green-500 bg-green-50'
                      : wrong
                      ? 'border-red-500 bg-red-50'
                      : ''
                  }`}
                >
                  {el.type === 'imageQuestion' && el.image && (
                    <img src={el.image} alt='' className='rounded border' />
                  )}

                  <div className='font-medium'>{el.question}</div>

                  <input
                    value={userAnswer}
                    disabled={isCurrentPageSubmitted}
                    onChange={(e) =>
                      setAnswers((p) => ({
                        ...p,
                        [key]: e.target.value,
                      }))
                    }
                    className='w-full border px-3 py-2'
                    placeholder='Your answer'
                  />

                  {isCurrentPageSubmitted && !correct && (
                    <div className='text-sm text-red-700'>Correct answer: {el.answer}</div>
                  )}
                </div>
              );
            }

            return null;
          })}

          <div className='flex justify-between pt-4'>
            <button
              disabled={!canGoPrev}
              onClick={() => setPageIndex((i) => i - 1)}
              className='disabled:opacity-50'
            >
              ← Prev Page
            </button>

            <button
              disabled={!canGoNext}
              onClick={() => setPageIndex((i) => i + 1)}
              className='disabled:opacity-50'
            >
              Next Page →
            </button>
          </div>

          {!isCurrentPageSubmitted && (
            <button
              type='button'
              onClick={handleSubmitPage}
              className='w-full bg-black text-white py-3 mt-4'
            >
              Submit Page
            </button>
          )}

          {isCurrentPageSubmitted && (
            <div className='text-center text-sm text-gray-600'>This page is submitted</div>
          )}
        </div>
      </div>
    </div>
  );
}
