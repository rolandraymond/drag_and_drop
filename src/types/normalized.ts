import type { EditorElement } from './editor';

export interface NormalizedElements {
  order: string[];
  map: Record<string, EditorElement>;
}
