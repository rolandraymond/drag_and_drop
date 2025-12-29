import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { saveDesign } from '../api/saveDesign';
import { downloadTextFile } from '../export/downloadTextFile';
import { generateReactTsx } from '../export/generateReactTsx';
import { toComponentName } from '../utils/toComponentName';

import {
  hasEmptyPages,
  hasEmptyElements,
} from '../utils/validation/editorValidation';

import { useEditorStore } from '../hooks/useEditorStore';
import Popup from './Popup';

export default function SaveButton() {
  const [showPopup, setShowPopup] = useState(false);

  const meta = useEditorStore((s) => s.meta);
  const pages = useEditorStore((s) => s.pages);
  const activePageId = useEditorStore((s) => s.activePageId);
  const categoryId = useEditorStore((s) => s.categoryId);
  const subcategoryId = useEditorStore((s) => s.subcategoryId);

  const componentName = meta.name?.trim()
    ? toComponentName(meta.name)
    : 'QuizPage';

  const activePage = pages.find((p) => p.id === activePageId);
  const elements = activePage?.elements ?? [];

  const handleSave = async () => {
    if (pages.every((p) => p.elements.length === 0)) {
      toast.error('Nothing to export yet');
      return;
    }

    if (hasEmptyPages(pages)) {
      toast.error('One or more pages are empty.');
      return;
    }

    if (hasEmptyElements(pages)) {
      toast.error(
        'Some questions or inputs are empty. Please fill them before continuing.'
      );
      return;
    }

    if (!categoryId) {
      toast.error('Please select a category before saving');
      return;
    }

    try {
      const result = generateReactTsx(elements, {
        componentName,
        wrapperClassName: 'max-w-3xl mx-auto px-6 py-8 space-y-6',
      });

      result.warnings.forEach((w) => toast.warning(w));

      const schema = {
        version: '1.0',
        meta: {
          name: meta.name,
          description: meta.description,
          author: meta.author,
          createdAt: Date.now(),
        },
        categoryId,
        subcategoryId,
        pages,
      };

      downloadTextFile(result.fileName, result.code);

        await saveDesign({
        schema,
        categoryId: categoryId ?? undefined,
        subcategoryId: subcategoryId ?? undefined,
      });


      toast.success('Exported & saved successfully');
      setShowPopup(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to export page'
      );
    }
  };

  useEffect(() => {
    if (!showPopup) return;
    const timer = setTimeout(() => setShowPopup(false), 4000);
    return () => clearTimeout(timer);
  }, [showPopup]);

  return (
    <>
      <button
        type="button"
        onClick={handleSave}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Export .tsx
      </button>

      {showPopup && (
        <Popup
          message="Page saved successfully"
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}
