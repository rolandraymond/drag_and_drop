import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { EditorElement, ElementType } from '../types/editor';
import type { PageSchemaV1 } from '../types/schema';
import { uid } from '../utils/uid';

interface EditorStore {
  elements: EditorElement[];

  meta: {
    name: string;
    description?: string;
    author?: string;
  };

  updateMetaName: (name: string) => void;
  updateMetaDescription: (description: string) => void;
  updateMetaAuthor: (author: string) => void;

  clearAll: () => void;
  addElement: (type: ElementType) => void;
  buildSchema: () => PageSchemaV1;

  updateText: (id: string, value: string) => void;
  updateQuestion: (id: string, value: string) => void;
  updateAnswer: (id: string, value: string) => void;
  updateImageQuestionImage: (id: string, image: string) => void;

  reorderElements: (activeId: string, overId: string) => void;
  deleteElement: (id: string) => void;
  updatePosition: (id: string, dx: number, dy: number) => void;
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      /* ---------- STATE ---------- */
      elements: [],

      meta: {
        name: 'Untitled Page',
        description: '',
        author: '',
        createdAt: Date.now(),
      },

      /* ---------- META UPDATES ---------- */
      updateMetaName: (name) =>
        set((state) => ({
          meta: { ...state.meta, name },
        })),

      updateMetaDescription: (description) =>
        set((state) => ({
          meta: { ...state.meta, description },
        })),

      updateMetaAuthor: (author) =>
        set((state) => ({
          meta: { ...state.meta, author },
        })),

      /* ---------- ELEMENT CRUD ---------- */
      addElement: (type) =>
        set((state) => ({
          elements: [
            ...state.elements,
            type === 'imageQuestion'
              ? {
                  id: uid(),
                  type: 'imageQuestion',
                  x: 0,
                  y: 0,
                  image: '',
                  question: '',
                  answer: '',
                }
              : type === 'question'
              ? {
                  id: uid(),
                  type: 'question',
                  x: 0,
                  y: 0,
                  question: '',
                  answer: '',
                }
              : {
                  id: uid(),
                  type: 'text',
                  x: 0,
                  y: 0,
                  value: 'New Text',
                },
          ],
        })),

      updateText: (id, value) =>
        set((state) => ({
          elements: state.elements.map((el) =>
            el.id === id && el.type === 'text' ? { ...el, value } : el,
          ),
        })),

      updateQuestion: (id, value) =>
        set((state) => ({
          elements: state.elements.map((el) =>
            el.id === id && (el.type === 'question' || el.type === 'imageQuestion')
              ? { ...el, question: value }
              : el,
          ),
        })),

      updateAnswer: (id, value) =>
        set((state) => ({
          elements: state.elements.map((el) =>
            el.id === id && (el.type === 'question' || el.type === 'imageQuestion')
              ? { ...el, answer: value }
              : el,
          ),
        })),

      updateImageQuestionImage: (id, image) =>
        set((state) => ({
          elements: state.elements.map((el) =>
            el.id === id && el.type === 'imageQuestion' ? { ...el, image } : el,
          ),
        })),

      reorderElements: (activeId, overId) =>
        set((state) => {
          const oldIndex = state.elements.findIndex((e) => e.id === activeId);
          const newIndex = state.elements.findIndex((e) => e.id === overId);
          if (oldIndex === -1 || newIndex === -1) return state;

          const updated = [...state.elements];
          const [moved] = updated.splice(oldIndex, 1);
          updated.splice(newIndex, 0, moved);

          return { elements: updated };
        }),

      deleteElement: (id) =>
        set((state) => ({
          elements: state.elements.filter((el) => el.id !== id),
        })),

      updatePosition: (id, dx, dy) =>
        set((state) => ({
          elements: state.elements.map((el) =>
            el.id === id ? { ...el, x: el.x + dx, y: el.y + dy } : el,
          ),
        })),

      clearAll: () => set({ elements: [] }),

      /* ---------- SCHEMA ---------- */
      buildSchema: (): PageSchemaV1 => {
        const { elements, meta } = get();

        return {
          version: '1.0' as const,
          meta,
          elements: [...elements],
        };
      },
    }),
    {
      name: 'dragdrop-editor-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        elements: state.elements,
        meta: state.meta,
      }),
    },
  ),
);
