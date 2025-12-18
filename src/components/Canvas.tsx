import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Canvas({ children }: Props) {
  return (
    <div className="flex-1 bg-gray-100 min-h-screen p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-4">
        {children}
      </div>
    </div>
  );
}
