import type { EditorPage } from '../types/editor';

type Props = {
  pages: EditorPage[];
  pageIndex: number;
  onSelect: (pageIndex: number) => void;
};

export default function QuizSidebar({
  pages,
  pageIndex,
  onSelect,
}: Props) {
  return (
    <aside className="w-64 border-r bg-white p-4 overflow-y-auto">
      <div className="font-semibold mb-4">Pages</div>

      <div className="space-y-1">
        {pages.map((page, index) => {
          const active = index === pageIndex;

          return (
            <button
              key={page.id}
              onClick={() => onSelect(index)}
              className={`w-full text-left text-sm px-3 py-2 rounded
                ${active
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-100'
                }`}
            >
              {page.name || `Page ${index + 1}`}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
