import { useState } from 'react';
import { toast } from 'react-toastify';
import { useEditorStore } from '../hooks/useEditorStore';
import ConfirmDialog from './ConfirmDialog';
import ExportAllButton from './ExportAllButton';

export default function PagesNav() {
  const pages = useEditorStore((s) => s.pages);
  const activePageId = useEditorStore((s) => s.activePageId);
  const setActivePage = useEditorStore((s) => s.setActivePage);
  const addPage = useEditorStore((s) => s.addPage);
  const renamePage = useEditorStore((s) => s.renamePage);
  const deletePage = useEditorStore((s) => s.deletePage);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [value, setValue] = useState('');
  const [pageToDelete, setPageToDelete] = useState<string | null>(null);

  return (
    <>
      {/* ===== NAV BAR ===== */}
      <div className='flex items-center gap-2 border-b bg-gray-50 px-4 py-2 overflow-x-auto'>
        {pages.map((page) => {
          const isActive = page.id === activePageId;
          const canDelete = pages.length > 1;

          return (
            <div key={page.id} className='flex items-center gap-1'>
              {/* Rename */}
              {editingId === page.id ? (
                <input
                  autoFocus
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onBlur={() => {
                    renamePage(page.id, value);
                    setEditingId(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      renamePage(page.id, value);
                      setEditingId(null);
                    }
                  }}
                  className='px-2 py-1 rounded border text-sm'
                />
              ) : (
                <button
                  onClick={() => setActivePage(page.id)}
                  onDoubleClick={() => {
                    setEditingId(page.id);
                    setValue(page.name);
                  }}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium
  transition-all duration-200 ease-out
  ${
    isActive
      ? 'bg-white text-black border shadow-sm -translate-y-[1px]'
      : 'text-gray-600 hover:bg-gray-200 hover:-translate-y-[1px]'
  }`}
                >
                  {page.name}
                </button>
              )}

              {/* Delete trigger */}
              <button
                type='button'
                disabled={!canDelete}
                onClick={() => {
                  if (!canDelete) {
                    toast.info('You need at least one page.');
                    return;
                  }
                  setPageToDelete(page.id);
                }}
                className={`px-2 py-1.5 rounded-md border text-sm
                  ${
                    canDelete
                      ? 'text-red-700 hover:bg-red-50 border-red-200'
                      : 'opacity-40 cursor-not-allowed'
                  }`}
                title='Delete page'
              >
                🗑
              </button>
            </div>
          );
        })}

        {/* Add Page */}
        <button
          onClick={addPage}
          className='ml-2 px-3 py-1.5 rounded-md border text-sm hover:bg-gray-100'
        >
          + Page
        </button>
      </div>
      <div className='ml-auto flex items-center gap-2'>
        <ExportAllButton />
      </div>

      {/* ===== CONFIRM DIALOG ===== */}
      <ConfirmDialog
        open={pageToDelete !== null}
        title='Delete page?'
        description='This page and all its elements will be permanently deleted.'
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
