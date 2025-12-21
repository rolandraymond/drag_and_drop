import type { EditorElement } from './editor';

export interface PageSchemaV1 {
  version: '1.0';
  meta: {
    name: string;
    description?: string;
    author?: string;
    createdAt?: number;
  };
  elements: EditorElement[];
}
