type Page = {
  id: string;
  name?: string;
  categoryId: string | null;
  subcategoryId: string | null;
};

type Props = {
  pages: Page[];
  activePageId: string;
  onSelectPage: (id: string) => void;
};

export default function PreviewSidebar({
  pages,
  activePageId,
  onSelectPage,
}: Props) {
  const grouped = pages.reduce<
    Record<string, Record<string, Page[]>>
  >((acc, page) => {
    const cat = page.categoryId ?? 'Uncategorized';
    const sub = page.subcategoryId ?? 'Uncategorized';

    acc[cat] ??= {};
    acc[cat][sub] ??= [];
    acc[cat][sub].push(page);

    return acc;
  }, {});

  return (
    <aside className="w-64 border-r bg-white p-4 overflow-y-auto">
      {Object.entries(grouped).map(([cat, subs]) => (
        <div key={cat} className="mb-4">
          <div className="font-semibold mb-1">{cat}</div>

          {Object.entries(subs).map(([sub, pages]) => (
            <div key={sub} className="ml-3 mb-2">
              <div className="text-xs text-gray-500 mb-1">
                {sub}
              </div>

              {pages.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectPage(p.id)}
                  className={`block w-full text-left px-2 py-1 text-sm rounded ${
                    p.id === activePageId
                      ? 'bg-black text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {p.name ?? 'Untitled'}
                </button>
              ))}
            </div>
          ))}
        </div>
      ))}
    </aside>
  );
}
