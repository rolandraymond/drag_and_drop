import { create } from "zustand";
import type { EditorElement, PageSchema } from "../types/editor";
import { uid } from "../utils/uid";

interface EditorStore {
    elements: EditorElement[];

    addElement: (type: "text" | "image") => void;
    updateText: (id: string, value: string) => void;
    updateImage: (id: string, src: string) => void;
    reorderElements: (activeId: string, overId: string) => void;

    buildSchema: () => PageSchema;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
    elements: [],

    addElement: (type) =>
        set((state) => ({
            elements: [
                ...state.elements,
                type === "text"
                    ? { id: uid(), type: "text", value: "write text here" }
                    : { id: uid(), type: "image", src: "/placeholder.png" }
            ]
        })),

    updateText: (id, value) =>
        set((state) => ({
            elements: state.elements.map((el) =>
                el.id === id && el.type === "text"
                    ? { ...el, value }
                    : el
            )
        })),

    updateImage: (id, src) =>
        set((state) => ({
            elements: state.elements.map((el) =>
                el.id === id && el.type === "image"
                    ? { ...el, src }
                    : el
            )
        })),

    reorderElements: (activeId, overId) =>
        set((state) => {
            const oldIndex = state.elements.findIndex(e => e.id === activeId);
            const newIndex = state.elements.findIndex(e => e.id === overId);

            const updated = [...state.elements];
            const [moved] = updated.splice(oldIndex, 1);
            updated.splice(newIndex, 0, moved);

            return { elements: updated };
        }),

    buildSchema: () => ({
        id: uid(),
        elements: get().elements,
        updatedAt: new Date().toISOString()
    })
}));
