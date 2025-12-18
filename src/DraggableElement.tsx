import { useDraggable } from "@dnd-kit/core";
import { useRef } from "react";
import { useEditorStore } from "./hooks/useEditorStore";
import type { EditorElement } from "./types/editor";

interface Props {
  element: EditorElement;
}

export default function DraggableElement({ element }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: element.id
  });

  const updateText = useEditorStore((s) => s.updateText);
  const updateImage = useEditorStore((s) => s.updateImage);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div
      ref={setNodeRef}
      className="w-full bg-white rounded shadow"
      style={{
        transform: transform
          ? `translateY(${transform.y}px)`
          : "none"
      }}
    >
      {/* 🔹 Drag Handle */}
      <div
        {...listeners}
        {...attributes}
        className="cursor-grab bg-gray-100 px-3 py-2 text-sm text-gray-600 select-none"
      >
        ⠿ Drag
      </div>

      {/* 🔹 Content Area (NO drag here) */}
      <div className="p-4">
        {element.type === "text" && (
          <div
            contentEditable
            suppressContentEditableWarning
            className="outline-none border border-transparent focus:border-blue-400"
            onBlur={(e) =>
              updateText(element.id, e.currentTarget.innerText)
            }
          >
            {element.value}
          </div>
        )}

        {element.type === "image" && (
          <>
            <img
              src={element.src}
              className="w-full h-auto cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = () =>
                  updateImage(element.id, reader.result as string);
                reader.readAsDataURL(file);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
