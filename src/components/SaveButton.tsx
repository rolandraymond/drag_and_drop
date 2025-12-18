import { useEditorStore } from "../hooks/useEditorStore";

export default function SaveButton() {
  const buildSchema = useEditorStore((s) => s.buildSchema);

  const handleSave = () => {
    const schema = buildSchema();
    console.log("SAVED SCHEMA:", schema);
    alert("Page saved ✔️");
  };

  return (
    <button className="bg-black text-white px-4 py-2 rounded">
      Save
    </button>
  );
}
