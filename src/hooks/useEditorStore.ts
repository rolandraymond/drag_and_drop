import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { EditorElement, ElementType } from '../types/editor';
import type { PageMeta } from '../types/schema';
import { uid } from '../utils/uid';

/* ================= types ================= */

type Page = {
  id: string;

  name?: string;
  description?: string;
  author?: string;

  categoryId: string | null;
  categoryName?: string | null;

  subcategoryId: string | null;
  subcategoryName?: string | null;

  elements: EditorElement[];
};

interface EditorStore {
  pages: Page[];
  activePageId: string;

  meta: PageMeta;
  setMeta: (meta: Partial<PageMeta>) => void;

  setActivePage: (pageId: string) => void;
  addPage: () => void;
  renamePage: (pageId: string, name: string) => void;
  deletePage: (pageId: string) => void;

  setPageCategory: (pageId: string, payload: { id: string | null; name?: string | null }) => void;

  setPageSubcategory: (
    pageId: string,
    payload: { id: string | null; name?: string | null },
  ) => void;

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

/* ================= store ================= */

export const useEditorStore = create<EditorStore>()(
  persist(
    (set) => ({
      pages: [
        {
          id: 'page-1',
          name: 'Page 1',
          description: '',
          author: '',

          categoryId: null,
          categoryName: null,

          subcategoryId: null,
          subcategoryName: null,

          elements: [],
        },
      ],

      activePageId: 'page-1',

      meta: {
        name: 'Untitled Quiz',
        description: '',
        author: '',
        createdAt: Date.now(),
      },

      /* ================= meta ================= */

      setMeta: (partial) =>
        set((state) => ({
          meta: {
            ...state.meta,
            ...partial,
          },
        })),

      /* ================= pages ================= */

      setActivePage: (pageId) => set({ activePageId: pageId }),

      addPage: () =>
        set((state) => {
          const id = uid();
          const pageNumber = state.pages.length + 1;

          return {
            pages: [
              ...state.pages,
              {
                id,
                name: `Page ${pageNumber}`,
                description: '',
                author: '',
                categoryId: null,
                categoryName: null,
                subcategoryId: null,
                subcategoryName: null,
                elements: [],
              },
            ],
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

          const pages = state.pages.filter((p) => p.id !== pageId);
          const activePageId = state.activePageId === pageId ? pages[0].id : state.activePageId;

          return { pages, activePageId };
        }),

      /* ================= category ================= */

      setPageCategory: (pageId, payload) =>
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === pageId
              ? {
                  ...p,
                  categoryId: payload.id,
                  categoryName: payload.name ?? null,
                  subcategoryId: null,
                  subcategoryName: null,
                }
              : p,
          ),
        })),

      setPageSubcategory: (pageId, payload) =>
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === pageId
              ? {
                  ...p,
                  subcategoryId: payload.id,
                  subcategoryName: payload.name ?? null,
                }
              : p,
          ),
        })),

      /* ================= elements ================= */

      addElement: (type) =>
        set((state) => ({
          pages: state.pages.map((p) => {
            if (p.id !== state.activePageId) return p;

            let element: EditorElement;

            if (type === 'imageQuestion') {
              element = {
                id: uid(),
                type,
                x: 0,
                y: 0,
                image: '',
                question: '',
                answer: '',
              };
            } else if (type === 'question') {
              element = {
                id: uid(),
                type,
                x: 0,
                y: 0,
                question: '',
                answer: '',
              };
            } else if (type === 'input') {
              element = {
                id: uid(),
                type,
                x: 0,
                y: 0,
                label: 'Input',
                placeholder: 'Type here...',
              };
            } else {
              element = {
                id: uid(),
                type: 'text',
                x: 0,
                y: 0,
                value: 'New Text',
              };
            }

            return {
              ...p,
              elements: [...p.elements, element],
            };
          }),
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

      /* ================= updates ================= */

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
