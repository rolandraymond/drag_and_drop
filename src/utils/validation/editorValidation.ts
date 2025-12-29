import type { EditorElement } from '../../types/editor';

export type EditorPage = {
    id: string;
    name?: string;
    elements: EditorElement[];
};

/* ================= Pages ================= */

export function hasEmptyPages(pages: EditorPage[]): boolean {
    return pages.some((page) => page.elements.length === 0);
}

/* ================= Elements ================= */

export function hasEmptyElements(pages: EditorPage[]): boolean {
    return pages.some((page) =>
        page.elements.some((el) => {
            if (el.type === 'question' || el.type === 'imageQuestion') {
                return !el.question?.trim() || !el.answer?.trim();
            }

            if (el.type === 'input') {
                return !el.label?.trim();
            }

            return false;
        }),
    );
}
