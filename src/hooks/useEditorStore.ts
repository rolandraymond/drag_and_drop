import { create } from "zustand";
import type { EditorElement } from "../types/editor";
import { uid } from "../utils/uid";

interface EditorStore {
    elements: EditorElement[];
    addElement: (type: "text" | "image") => void;
    updatePosition: (id: string, x: number, y: number) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
    elements: [],

    addElement: (type) =>
        set((state) => ({
            elements: [
                ...state.elements,
                type === "text"
                    ? {
                        id: uid(),
                        type: "text",
                        x: 120,
                        y: 120,
                        value: "New Text"
                    }
                    : {
                        id: uid(),
                        type: "image",
                        x: 120,
                        y: 120,
                        src: "/placeholder.png"
                    }
            ]
        })),

    updatePosition: (id, x, y) =>
        set((state) => ({
            elements: state.elements.map((el) =>
                el.id === id ? { ...el, x, y } : el
            )
        }))
}));
