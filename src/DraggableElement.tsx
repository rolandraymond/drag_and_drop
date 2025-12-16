import { useDraggable } from "@dnd-kit/core";

import type { EditorElement } from "./types/editor";

interface Props {
  element: EditorElement;
}

export default function DraggableElement({ element }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: element.id
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="absolute cursor-move"
      style={{
        left: element.x,
        top: element.y,
        position: "absolute",
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : "none"
      }}
    >
      {element.type === "text" && (
        <div className="p-1 text-xl">{element.value}</div>
      )}

      {element.type === "image" && (
        <img src={element.src} alt="element" className="w-32 h-auto" />
      )}
    </div>
  );
}
