import type { EditorElement } from '../types/editor';

export type PageSchemaV1 = {
  version: 1;
  title: string;
  elements: Array<
    | { id: string; type: 'text'; value: string }
    | {
        id: string;
        type: 'question' | 'imageQuestion';
        question: string;
        correct_answers: string[];
        points: number;
        image?: string;
      }
    | {
        id: string;
        type: 'input';
        label?: string;
        placeholder?: string;
      }
  >;
};

function cleanText(value: unknown): string {
  return String(value ?? '').trim();
}

export function generateSchemaJson(
  elements: EditorElement[],
  opts?: { title?: string },
): PageSchemaV1 {
  return {
    version: 1,
    title: cleanText(opts?.title) || 'Generated Page',
    elements: elements.map((el) => {
      // TEXT
      if (el.type === 'text') {
        return {
          id: el.id,
          type: 'text',
          value: cleanText(el.value),
        };
      }
      // INPUT
      if (el.type === 'input') {
        return {
          id: el.id,
          type: 'input',
          label: cleanText(el.label),
          placeholder: cleanText(el.placeholder),
        };
      }

      // QUESTION & IMAGE QUESTION
      const correct_answers = el.answer ? [cleanText(el.answer)] : [];

      const base = {
        id: el.id,
        type: el.type,
        question: cleanText(el.question),
        correct_answers,
        points: 5,
      };

      if (el.type === 'imageQuestion') {
        return {
          ...base,
          image: cleanText(el.image),
        };
      }

      return base;
    }),
  };
}
