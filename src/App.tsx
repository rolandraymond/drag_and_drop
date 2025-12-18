import {
  DndContext,
  closestCenter,
  type DragEndEvent
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import SaveButton from "./components/SaveButton";
import DraggableElement from "./DraggableElement";
import { useEditorStore } from "./hooks/useEditorStore";

export default function App() {
  const elements = useEditorStore((s) => s.elements);
  const reorderElements = useEditorStore((s) => s.reorderElements);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    reorderElements(active.id as string, over.id as string);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 relative">
        <div className="absolute top-4 right-4 z-10">
          <SaveButton />
        </div>

        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <Canvas>
            {elements.map((el) => (
              <DraggableElement key={el.id} element={el} />
            ))}
          </Canvas>
        </DndContext>
      </div>
    </div>
  );
}
