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
export interface InputElement extends BaseElement {
  type: 'input';
  label?: string;
  placeholder?: string;
}
export type EditorElement = TextElement | QuestionElement | ImageQuestionElement | InputElement;
