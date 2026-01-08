import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { saveDesign } from '../api/saveDesign';

import { useEditorStore } from '../hooks/useEditorStore';
import { hasEmptyElements, hasEmptyPages } from '../utils/validation/editorValidation';
import Popup from './Popup';

import { downloadZip } from '../export/downloadZip';
import { generateCss } from '../export/generateCss';
import { generateHtml } from '../export/generateHtml';
import { generateJs } from '../export/generateJs';

export default function SaveButton() {
  const [showPopup, setShowPopup] = useState(false);

  const meta = useEditorStore((s) => s.meta);
  const pages = useEditorStore((s) => s.pages);

  const handleSave = async () => {
    /* ✅ per-page category validation */
    if (pages.some((p) => !p.categoryId)) {
      toast.error('Every page must have a category');
      return;
    }

    if (pages.some((p) => !p.subcategoryId)) {
      toast.error('Every page must have a subcategory');
      return;
    }

    if (pages.every((p) => p.elements.length === 0)) {
      toast.error('Nothing to export yet');
      return;
    }

    if (hasEmptyPages(pages)) {
      toast.error('One or more pages are empty');
      return;
    }

    if (hasEmptyElements(pages)) {
      toast.error('Some questions or inputs are empty');
      return;
    }

    try {
      const files: { name: string; content: string }[] = [];

      /* 1️⃣ Generate HTML per page */
      pages.forEach((page, index) => {
        const html = generateHtml(page, pages, index);
        html.warnings.forEach((w) => toast.warning(w));

        files.push({
          name: html.fileName,
          content: html.code,
        });
      });

      /* 2️⃣ Shared assets */
      const css = generateCss();
      const js = generateJs();

      files.push(
        { name: css.fileName, content: css.code },
        { name: js.fileName, content: js.code },
      );

      /* 3️⃣ Download ZIP */
      await downloadZip('website.zip', files);

      /* 4️⃣ Save schema */
      const schema = {
        version: '1.0',
        meta: {
          name: meta.name,
          description: meta.description,
          author: meta.author,
          createdAt: Date.now(),
        },
        pages: pages.map((p) => ({
          id: p.id,
          name: p.name,

          category: {
            id: p.categoryId,
            name: p.categoryName,
          },

          subcategory: {
            id: p.subcategoryId,
            name: p.subcategoryName,
          },

          elements: p.elements,
        })),
      };

      await saveDesign({ schema });

      toast.success('Website exported successfully');
      setShowPopup(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to export website');
    }
  };

  useEffect(() => {
    if (!showPopup) return;
    const t = setTimeout(() => setShowPopup(false), 4000);
    return () => clearTimeout(t);
  }, [showPopup]);

  return (
    <>
      <button type='button' onClick={handleSave} className='bg-black text-white px-4 py-2 rounded'>
        Export Website
      </button>

      {showPopup && (
        <Popup message='Website exported successfully' onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
