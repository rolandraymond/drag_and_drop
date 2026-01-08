import type { EditorElement } from '../types/editor';

/* ================= Schema Types ================= */

export type PageSchemaV2 = {
  version: 2;

  title: string;
  description?: string;
  author?: string;

  category?: {
    id: string | null;
    name?: string | null;
  };

  subcategory?: {
    id: string | null;
    name?: string | null;
  };

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

/* ================= Helpers ================= */

function cleanText(value: unknown): string {
  return String(value ?? '').trim();
}

/* ================= Generator ================= */

type SchemaOptions = {
  title?: string;
  description?: string;
  author?: string;

  category?: {
    id: string | null;
    name?: string | null;
  };

  subcategory?: {
    id: string | null;
    name?: string | null;
  };
};

export function generateSchemaJson(
  elements: EditorElement[],
  opts: SchemaOptions = {},
): PageSchemaV2 {
  return {
    version: 2,

    title: cleanText(opts.title) || 'Generated Page',
    description: cleanText(opts.description),
    author: cleanText(opts.author),

    category: opts.category
      ? {
          id: opts.category.id,
          name: cleanText(opts.category.name),
        }
      : undefined,

    subcategory: opts.subcategory
      ? {
          id: opts.subcategory.id,
          name: cleanText(opts.subcategory.name),
        }
      : undefined,

    elements: elements.map((el) => {
      /* ---------- TEXT ---------- */
      if (el.type === 'text') {
        return {
          id: el.id,
          type: 'text',
          value: cleanText(el.value),
        };
      }

      /* ---------- INPUT ---------- */
      if (el.type === 'input') {
        return {
          id: el.id,
          type: 'input',
          label: cleanText(el.label),
          placeholder: cleanText(el.placeholder),
        };
      }

      /* ---------- QUESTION / IMAGE QUESTION ---------- */
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
