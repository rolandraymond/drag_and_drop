import { toast } from 'react-toastify';
import { useEditorStore } from '../hooks/useEditorStore';
import { generateReactTsx } from '../export/generateReactTsx';
import { generateSchemaJson } from '../export/generateSchemaJson';
import { downloadTextFile } from '../export/downloadTextFile';
import { toComponentName } from '../utils/toComponentName';

export default function ExportAllButton() {
  const pages = useEditorStore((s) => s.pages);

  const handleExportAll = () => {
    if (pages.length === 0) {
      toast.error('No pages to export');
      return;
    }

    pages.forEach((page) => {
      if (page.elements.length === 0) return;

      const componentName = toComponentName(page.name || 'Page');

      /* ---------- React Component ---------- */
      const reactResult = generateReactTsx(page.elements, {
        componentName,
        wrapperClassName: 'max-w-3xl mx-auto px-6 py-8 space-y-6',
      });

      /* ---------- Schema (FULL DATA) ---------- */
      const schema = generateSchemaJson(page.elements, {
        title: page.name,
        description: page.description,
        author: page.author,

        category: {
          id: page.categoryId,
          name: page.categoryName,
        },

        subcategory: {
          id: page.subcategoryId,
          name: page.subcategoryName,
        },
      });

      downloadTextFile(reactResult.fileName, reactResult.code);
      downloadTextFile(`${componentName}.schema.json`, JSON.stringify(schema, null, 2));
    });

    toast.success('All pages exported');
  };

  return (
    <button
      type='button'
      onClick={handleExportAll}
      className='
        flex items-center gap-1
        px-3 py-1.5 rounded-md text-sm font-medium
        border bg-white text-gray-700
        hover:bg-gray-100 transition-all
      '
      title='Export all pages'
    >
      📦 Export
    </button>
  );
}
