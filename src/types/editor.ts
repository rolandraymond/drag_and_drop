export type ElementType = 'text' | 'question' | 'imageQuestion' | 'input';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
}
export interface ImageQuestionElement extends BaseElement {
  type: 'imageQuestion';
  image: string;
  question: string;
  answer: string;
}

export interface TextElement extends BaseElement {
  type: 'text';
  value: string;
}

export interface QuestionElement extends BaseElement {
  type: 'question';
  question: string;
  answer: string;
}

export interface PageMeta {
  title: string;
  createdAt: string;
  updatedAt: string;
}
export interface PageSchema {
  id: string;
  elements: EditorElement[];
  updatedAt: string;
}

export type EditorPage = {
  id: string;
  name?: string;

  categoryId: string | null;
  categoryName?: string | null;

  subcategoryId: string | null;
  subcategoryName?: string | null;

  description?: string;
  author?: string;

  elements: EditorElement[];
};

export interface InputElement extends BaseElement {
  type: 'input';
  label?: string;
  placeholder?: string;
}

export type EditorElement = TextElement | QuestionElement | ImageQuestionElement | InputElement;
