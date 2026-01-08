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


export interface Category {
  _id: string;
  name: string;
}

export interface Subcategory {
  _id: string;
  name: string;
  category_id: string;
}