import type { EditorElement } from './editor';
export interface PageMeta {
  name?: string;
  description?: string;
  author?: string;
  createdAt?: number;
}
export interface PageSchemaV1 {
  version: '1.0';
  meta: PageMeta;

  elements: EditorElement[];
}
