type Page = {
  id: string;
  name?: string;
  categoryId: string | null;
  subcategoryId: string | null;
};

type Props = {
  pages: Page[];
  activePageId: string;
  onSelectPage: (pageId: string) => void;
};

export default function PreviewSidebar({
  pages,
  activePageId,
  onSelectPage,
}: Props) {
  const grouped = pages.reduce<Record<string, Page[]>>((acc, page) => {
    const key = page.categoryId ?? 'uncategorized';
    if (!acc[key]) acc[key] = [];
    acc[key].push(page);
    return acc;
  }, {});

  return (
    <aside className="w-64 border-r bg-white p-4 overflow-y-auto">
      <div className="font-semibold mb-4">Categories</div>

      {Object.entries(grouped).map(([categoryId, pages]) => (
        <div key={categoryId} className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">
            {categoryId === 'uncategorized'
              ? 'Uncategorized'
              : `Category ${categoryId}`}
          </div>

          <div className="space-y-1">
            {pages.map((p) => (
              <button
                key={p.id}
                disabled={p.id !== activePageId}
                onClick={() => onSelectPage(p.id)}
                className={`w-full text-left px-2 py-1 rounded text-sm
                  ${
                    p.id === activePageId
                      ? 'bg-black text-white'
                      : 'hover:bg-gray-100 opacity-50 cursor-not-allowed'
                  }`}
              >
                {p.name ?? 'Untitled Page'}
              </button>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
