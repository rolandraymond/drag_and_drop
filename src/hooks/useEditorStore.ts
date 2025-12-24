import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { EditorElement, ElementType } from '../types/editor';
import type { PageMeta } from '../types/schema';
import { uid } from '../utils/uid';

type Page = {
  id: string;
  name?: string;
  elements: EditorElement[];
};

interface EditorStore {
  pages: Page[];
  activePageId: string;

  meta: PageMeta;

  setActivePage: (pageId: string) => void;
  addPage: () => void;
  addInputPage: () => void;
  renamePage: (pageId: string, name: string) => void;
  deletePage: (pageId: string) => void;

  addElement: (type: ElementType) => void;

  reorderElements: (activeId: string, overId: string) => void;
  deleteElement: (id: string) => void;
  clearAll: () => void;

  updateText: (id: string, value: string) => void;
  updateQuestion: (id: string, value: string) => void;
  updateAnswer: (id: string, value: string) => void;
  updateImageQuestionImage: (id: string, image: string) => void;

  updateInputLabel: (id: string, value: string) => void;
  updateInputPlaceholder: (id: string, value: string) => void;
}

function createElement(type: ElementType): EditorElement {
  if (type === 'imageQuestion') {
    return { id: uid(), type, x: 0, y: 0, image: '', question: '', answer: '' };
  }

  if (type === 'question') {
    return { id: uid(), type, x: 0, y: 0, question: '', answer: '' };
  }

  if (type === 'input') {
    return { id: uid(), type, x: 0, y: 0, label: 'Input', placeholder: 'Type here...' };
  }

  return { id: uid(), type: 'text', x: 0, y: 0, value: 'New Text' };
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set) => ({
      pages: [{ id: 'page-1', name: 'Page 1', elements: [] }],
      activePageId: 'page-1',

      meta: {
        name: 'Untitled Quiz',
        description: '',
        author: '',
        createdAt: Date.now(),
      },

      setActivePage: (pageId) => set({ activePageId: pageId }),

      addPage: () =>
        set((state) => {
          const id = uid();
          const pageNumber = state.pages.length + 1;

          return {
            pages: [...state.pages, { id, name: `Page ${pageNumber}`, elements: [] }],
            activePageId: id,
          };
        }),

      addInputPage: () =>
        set((state) => {
          const id = uid();
          const pageNumber = state.pages.length + 1;

          const newPage: Page = {
            id,
            name: `Input Page ${pageNumber}`,
            elements: [createElement('input')],
          };

          console.log('addInputPage -> newPage', newPage);

          return {
            pages: [...state.pages, newPage],
            activePageId: id,
          };
        }),

      renamePage: (pageId, name) =>
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === pageId ? { ...p, name: name.trim() || p.name } : p,
          ),
        })),

      deletePage: (pageId) =>
        set((state) => {
          if (state.pages.length <= 1) return state;

          const nextPages = state.pages.filter((p) => p.id !== pageId);
          const nextActive = state.activePageId === pageId ? nextPages[0].id : state.activePageId;

          return { pages: nextPages, activePageId: nextActive };
        }),

      addElement: (type) =>
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === state.activePageId
              ? { ...p, elements: [...p.elements, createElement(type)] }
              : p,
          ),
        })),

      reorderElements: (activeId, overId) =>
        set((state) => ({
          pages: state.pages.map((p) => {
            if (p.id !== state.activePageId) return p;

            const items = [...p.elements];
            const from = items.findIndex((e) => e.id === activeId);
            const to = items.findIndex((e) => e.id === overId);
            if (from === -1 || to === -1) return p;

            const [moved] = items.splice(from, 1);
            items.splice(to, 0, moved);

            return { ...p, elements: items };
          }),
        })),

      deleteElement: (id) =>
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === state.activePageId
              ? { ...p, elements: p.elements.filter((e) => e.id !== id) }
              : p,
          ),
        })),

      clearAll: () =>
        set((state) => ({
          pages: state.pages.map((p) => (p.id === state.activePageId ? { ...p, elements: [] } : p)),
        })),

      updateText: (id, value) =>
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === state.activePageId
              ? {
                  ...p,
                  elements: p.elements.map((el) =>
                    el.id === id && el.type === 'text' ? { ...el, value } : el,
                  ),
                }
              : p,
          ),
        })),

      updateQuestion: (id, value) =>
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === state.activePageId
              ? {
                  ...p,
                  elements: p.elements.map((el) =>
                    el.id === id && 'question' in el ? { ...el, question: value } : el,
                  ),
                }
              : p,
          ),
        })),

      updateAnswer: (id, value) =>
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === state.activePageId
              ? {
                  ...p,
                  elements: p.elements.map((el) =>
                    el.id === id && 'answer' in el ? { ...el, answer: value } : el,
                  ),
                }
              : p,
          ),
        })),

      updateImageQuestionImage: (id, image) =>
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === state.activePageId
              ? {
                  ...p,
                  elements: p.elements.map((el) =>
                    el.id === id && el.type === 'imageQuestion' ? { ...el, image } : el,
                  ),
                }
              : p,
          ),
        })),

      updateInputLabel: (id, value) =>
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === state.activePageId
              ? {
                  ...p,
                  elements: p.elements.map((el) =>
                    el.id === id && el.type === 'input' ? { ...el, label: value } : el,
                  ),
                }
              : p,
          ),
        })),

      updateInputPlaceholder: (id, value) =>
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === state.activePageId
              ? {
                  ...p,
                  elements: p.elements.map((el) =>
                    el.id === id && el.type === 'input' ? { ...el, placeholder: value } : el,
                  ),
                }
              : p,
          ),
        })),
    }),
    {
      name: 'editor-pages-v2',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
