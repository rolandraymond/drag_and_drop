import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { downloadTextFile } from '../export/downloadTextFile';
import { generateReactTsx } from '../export/generateReactTsx';
import { generateSchemaJson } from '../export/generateSchemaJson';
import { saveDesignSchema } from '../api/designs';
import { saveDesign } from '../api/saveDesign';



import { useEditorStore } from '../hooks/useEditorStore';
import Popup from './Popup';
export default function SaveButton() {
  const elements = useEditorStore((s) => s.elements);
  const [showPopup, setShowPopup] = useState(false);

  const handleSave = async () => {
    if (!elements || elements.length === 0) {
      toast.error('Nothing to export yet');
      return;
    }

    try {
      const result = generateReactTsx(elements, {
        componentName: 'Page',
        wrapperClassName: 'max-w-3xl mx-auto px-6 py-8 space-y-6',
      });

      // Show warnings (but still export)
      result.warnings.forEach((warning) => {
        toast.warning(warning);
      });

       const schema = generateSchemaJson(elements, { title: 'Generated Page' });

        downloadTextFile(result.fileName, result.code);
        // downloadTextFile('page.schema.json', JSON.stringify(schema, null, 2));

          await saveDesignSchema(schema);
          await saveDesign(schema);

      toast.success('Exported TSX + JSON successfully');
      setShowPopup(true);

      console.log('EXPORTED TSX CODE:\n', result.code);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to export page';

      toast.error(message);
    }
  };

  useEffect(() => {
    if (!showPopup) return;

    const timer = setTimeout(() => {
      setShowPopup(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [showPopup]);

  return (
    <>
      <button
        type='button'
        onClick={handleSave}
        className='bg-black text-white px-4 py-2 rounded'
        aria-label='Export React TSX'
        title='Export React + Tailwind as TSX'
      >
        Export .tsx
      </button>

      {showPopup && (
        <Popup message='Page saved successfully ' onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
