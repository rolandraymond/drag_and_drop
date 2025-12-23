import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { EditorElement, ElementType } from '../types/editor';
import type { PageMeta } from '../types/schema';
import { uid } from '../utils/uid';

/* ---------- TYPES ---------- */
type Page = {
  id: string;
  name: string;
  elements: EditorElement[];
};

interface EditorStore {
  pages: Page[];
  activePageId: string;
  renamePage: (pageId: string, name: string) => void;
  deletePage: (pageId: string) => void;

  meta: PageMeta;

  addPage: () => void;
  setActivePage: (pageId: string) => void;

  addElement: (type: ElementType) => void;
  reorderElements: (activeId: string, overId: string) => void;
  deleteElement: (id: string) => void;
  clearAll: () => void;

  updateText: (id: string, value: string) => void;
  updateQuestion: (id: string, value: string) => void;
  updateAnswer: (id: string, value: string) => void;
  updateImageQuestionImage: (id: string, image: string) => void;
}

/* ---------- HELPERS ---------- */
function createElement(type: ElementType): EditorElement {
  if (type === 'imageQuestion') {
    return {
      id: uid(),
      type,
      x: 0,
      y: 0,
      image: '',
      question: '',
      answer: '',
    };
  }

  if (type === 'question') {
    return {
      id: uid(),
      type,
      x: 0,
      y: 0,
      question: '',
      answer: '',
    };
  }

  return {
    id: uid(),
    type: 'text',
    x: 0,
    y: 0,
    value: 'New Text',
  };
}

/* ---------- STORE ---------- */
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
      renamePage: (pageId, name) =>
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === pageId ? { ...p, name: name.trim() || p.name } : p,
          ),
        })),
      deletePage: (pageId) =>
        set((state) => {
          if (state.pages.length <= 1) {
            // ممنوع تمسح آخر صفحة
            return state;
          }

          const idx = state.pages.findIndex((p) => p.id === pageId);
          if (idx === -1) return state;

          const nextPages = state.pages.filter((p) => p.id !== pageId);

          // لو الصفحة المحذوفة هي الـ active، اختار صفحة بديلة
          let nextActiveId = state.activePageId;
          if (state.activePageId === pageId) {
            const fallback = nextPages[idx] ?? nextPages[idx - 1] ?? nextPages[0];
            nextActiveId = fallback.id;
          }

          return {
            ...state,
            pages: nextPages,
            activePageId: nextActiveId,
          };
        }),

      addPage: () =>
        set((state) => {
          const id = `page-${state.pages.length + 1}`;
          return {
            pages: [...state.pages, { id, name: `Page ${state.pages.length + 1}`, elements: [] }],
            activePageId: id,
          };
        }),

      setActivePage: (pageId) => set({ activePageId: pageId }),

      addElement: (type) =>
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id !== state.activePageId
              ? p
              : { ...p, elements: [...p.elements, createElement(type)] },
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
            p.id !== state.activePageId
              ? p
              : { ...p, elements: p.elements.filter((e) => e.id !== id) },
          ),
        })),

      clearAll: () =>
        set((state) => ({
          pages: state.pages.map((p) => (p.id !== state.activePageId ? p : { ...p, elements: [] })),
        })),

      updateText: (id, value) =>
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id !== state.activePageId
              ? p
              : {
                  ...p,
                  elements: p.elements.map((el) =>
                    el.id === id && el.type === 'text' ? { ...el, value } : el,
                  ),
                },
          ),
        })),

      updateQuestion: (id, value) =>
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id !== state.activePageId
              ? p
              : {
                  ...p,
                  elements: p.elements.map((el) =>
                    el.id === id && 'question' in el ? { ...el, question: value } : el,
                  ),
                },
          ),
        })),

      updateAnswer: (id, value) =>
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id !== state.activePageId
              ? p
              : {
                  ...p,
                  elements: p.elements.map((el) =>
                    el.id === id && 'answer' in el ? { ...el, answer: value } : el,
                  ),
                },
          ),
        })),

      updateImageQuestionImage: (id, image) =>
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id !== state.activePageId
              ? p
              : {
                  ...p,
                  elements: p.elements.map((el) =>
                    el.id === id && el.type === 'imageQuestion' ? { ...el, image } : el,
                  ),
                },
          ),
        })),
    }),
    {
      name: 'editor-pages-v1',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
