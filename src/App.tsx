import {
  DndContext,
  closestCenter,
  type DragEndEvent
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import SaveButton from "./components/SaveButton";
import DraggableElement from "./DraggableElement";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import AboutPage from "./components/AboutPage";
import { useEditorStore } from "./hooks/useEditorStore";

const MainApp = () => {
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
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/About" element={<AboutPage />} />
      <Route path="/" element={<MainApp />} />
    </Routes>
  );
}
