import { useEditorStore } from "./../hooks/useEditorStore";

export default function Sidebar() {
  const addElement = useEditorStore((state) => state.addElement);

  return (
    <div className="w-48 bg-white border-r p-4 space-y-3">
      <button
        onClick={() => addElement("text")}
        className="w-full p-2 bg-blue-500 text-white"
      >
        Add Text
      </button>

      <button
        onClick={() => addElement("image")}
        className="w-full p-2 bg-green-500 text-white"
      >
        Add Image
      </button>
    </div>
  );
}
