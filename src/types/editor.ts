export type ElementType = "text" | "image";

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
}

export interface TextElement extends BaseElement {
  type: "text";
  value: string;
}

export interface ImageElement extends BaseElement {
  type: "image";
  src: string;
}

export type EditorElement = TextElement | ImageElement;
