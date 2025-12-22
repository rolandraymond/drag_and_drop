import { toast } from 'react-toastify';
import { useEditorStore } from '../hooks/useEditorStore';
import MetadataForm from './MetadataForm';

export default function Sidebar() {
  const addElement = useEditorStore((s) => s.addElement);
  const clearAll = useEditorStore((s) => s.clearAll);
  const count = useEditorStore((s) => s.elements.length);

  const handleClear = () => {
    const ok = window.confirm('Delete all elements? This cannot be undone.');
    if (!ok) return;

    clearAll();
    toast.info('All elements cleared');
  };

  const baseBtn =
    'w-full rounded-xl px-4 py-3 font-medium transition ' +
    'hover:opacity-75 active:opacity-80 focus:outline-none focus:ring-2 focus:ring-black/20';

  return (
    <div className='h-full p-4 space-y-4 bg-white'>
      <MetadataForm />
      <div className='text-left'>
        <div className='text-sm text-gray-500'>Elements</div>
        <div className='text-2xl font-semibold text-gray-900'>{count}</div>
      </div>

      <div className='space-y-2'>
        <button
          type='button'
          onClick={() => {
            addElement('text');
            toast.success('Text added');
          }}
          className={`${baseBtn} bg-black text-white`}
        >
          Add Text
        </button>

        <button
          type='button'
          onClick={() => {
            addElement('question');
            toast.success('Question added');
          }}
          className={`${baseBtn} bg-black text-white`}
        >
          Add Question
        </button>

        <button
          type='button'
          onClick={() => {
            addElement('imageQuestion');
            toast.success('Image Question added');
          }}
          className={`${baseBtn} bg-black text-white`}
        >
          Add Image Question
        </button>

        <hr className='border-gray-200 my-2' />

        <button
          type='button'
          onClick={handleClear}
          className={`${baseBtn} bg-red-600 text-white`}
          aria-label='Clear all elements'
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
