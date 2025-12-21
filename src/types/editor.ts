export type ElementType = 'text' | 'imageQuestion' | 'question';

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

export type EditorElement = TextElement | ImageQuestionElement | QuestionElement;

export interface PageSchema {
  id: string;
  elements: EditorElement[];
  updatedAt: string;
}
