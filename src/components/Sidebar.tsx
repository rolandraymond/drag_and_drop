import { useEditorStore } from "../hooks/useEditorStore";

export default function Sidebar() {
  const addElement = useEditorStore((s) => s.addElement);

  return (
    <div className="w-56 bg-white border-r p-4 space-y-3">
      <button
        onClick={() => addElement("text")}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Add Text
      </button>

      <button
        onClick={() => addElement("image")}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        Add Image
      </button>
    </div>
  );
}
