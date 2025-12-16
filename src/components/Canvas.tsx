import type { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";

interface CanvasProps {
  children: ReactNode;
}

export default function Canvas({ children }: CanvasProps) {
  const { setNodeRef } = useDroppable({
    id: "canvas"
  });

  return (
    <div
      ref={setNodeRef}
      className="flex-1 relative bg-gray-100 h-screen overflow-hidden"
    >
      {children}
    </div>
  );
}
