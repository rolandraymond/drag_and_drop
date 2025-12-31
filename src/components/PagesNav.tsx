import { useState } from 'react';
import { toast } from 'react-toastify';
import { useEditorStore } from '../hooks/useEditorStore';
import ConfirmDialog from './ConfirmDialog';

export default function PagesNav() {
  const pages = useEditorStore((s) => s.pages);
  const activePageId = useEditorStore((s) => s.activePageId);

  const setActivePage = useEditorStore((s) => s.setActivePage);
  const addPage = useEditorStore((s) => s.addPage);
  const addElement = useEditorStore((s) => s.addElement);
  const renamePage = useEditorStore((s) => s.renamePage);
  const deletePage = useEditorStore((s) => s.deletePage);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [value, setValue] = useState('');
  const [pageToDelete, setPageToDelete] = useState<string | null>(null);

  return (
    <>
      <div className='flex items-center gap-2 border-b bg-gray-50 px-4 py-2 overflow-x-auto'>
        {pages.map((page, index) => {
          const isActive = page.id === activePageId;
          const displayName = page.name?.trim() || `Page ${index + 1}`;

          return (
            <div key={page.id} className='flex items-center gap-1'>
              {editingId === page.id ? (
                <input
                  autoFocus
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onBlur={() => {
                    renamePage(page.id, value.trim() || `Page ${index + 1}`);
                    setEditingId(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      renamePage(page.id, value.trim() || `Page ${index + 1}`);
                      setEditingId(null);
                    }
                  }}
                  className='border px-2 py-1 text-sm rounded'
                />
              ) : (
                <button
                  onClick={() => setActivePage(page.id)}
                  onDoubleClick={() => {
                    setEditingId(page.id);
                    setValue(page.name ?? '');
                  }}
                  className={`px-4 py-1 text-sm rounded transition ${
                    isActive ? 'bg-white border shadow-sm' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {displayName}
                </button>
              )}

              <button
                onClick={() => setPageToDelete(page.id)}
                disabled={pages.length === 1}
                className='px-2 text-red-600 disabled:opacity-30'
                title='Delete page'
              >
                🗑
              </button>
            </div>
          );
        })}

        <button
          onClick={addPage}
          className='ml-2 px-3 py-1 text-sm border rounded hover:bg-gray-100'
        >
          + Page
        </button>

        <button
          onClick={() => addElement('input')}
          className='px-3 py-1 text-sm border rounded hover:bg-gray-100'
        >
          + Input
        </button>
      </div>

      <ConfirmDialog
        open={!!pageToDelete}
        title='Delete page?'
        description='This page will be permanently removed.'
        confirmText='Delete'
        onCancel={() => setPageToDelete(null)}
        onConfirm={() => {
          if (!pageToDelete) return;
          deletePage(pageToDelete);
          toast.info('Page deleted');
          setPageToDelete(null);
        }}
      />
    </>
  );
}
