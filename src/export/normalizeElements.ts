import type { EditorElement } from '../types/editor';
import type { NormalizedElements } from '../types/normalized';

export function normalizeElements(elements: EditorElement[]): NormalizedElements {
  const order: string[] = [];
  const map: Record<string, EditorElement> = {};

  for (const el of elements) {
    order.push(el.id);
    map[el.id] = el;
  }

  return { order, map };
}
