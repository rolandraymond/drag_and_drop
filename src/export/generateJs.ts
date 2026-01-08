import type { ExportResult } from './types';

export function generateJs(): { fileName: string } & ExportResult {
  const code = `
document.addEventListener('click', function (e) {
  const btn = e.target;

  if (!(btn instanceof HTMLElement)) return;
  if (!btn.classList.contains('submit')) return;

  const card = btn.closest('.question');
  if (!card) return;

  const input = card.querySelector('input');
  const feedback = card.querySelector('.feedback');

  if (!input || !feedback) return;

  const correct = input.dataset.answer?.trim().toLowerCase();
  const value = input.value.trim().toLowerCase();

  if (!value) {
    feedback.textContent = 'Please enter an answer';
    feedback.className = 'feedback error';
    return;
  }

  if (value === correct) {
    feedback.textContent = 'Correct ✔';
    feedback.className = 'feedback success';
  } else {
    feedback.textContent = 'Incorrect ✖';
    feedback.className = 'feedback error';
  }
});
`.trim();

  return {
    fileName: 'script.js',
    code,
    warnings: [],
  };
}
