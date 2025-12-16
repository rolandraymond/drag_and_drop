import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import { useEditorStore } from "./hooks/useEditorStore";
import DraggableElement from "./DraggableElement";

export default function App() {
  const elements = useEditorStore((state) => state.elements);
  const updatePosition = useEditorStore((state) => state.updatePosition);

 const handleDragEnd = (event: DragEndEvent) => {
  const { active, delta } = event;

  const element = elements.find((el) => el.id === active.id);
  if (!element) return;

  const newX = element.x + delta.x;
  const newY = element.y + delta.y;

  updatePosition(element.id, newX, newY);
};


  return (
    <div className="flex">
      <Sidebar />
      <DndContext onDragEnd={handleDragEnd}>
        <Canvas>
          {elements.map((el) => (
            <DraggableElement key={el.id} element={el} />
          ))}
        </Canvas>
      </DndContext>
    </div>
  );
}
