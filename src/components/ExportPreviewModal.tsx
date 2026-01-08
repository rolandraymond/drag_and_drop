import { useEffect } from 'react';
import { toast } from 'react-toastify';

interface Props {
  code: string;
  fileName: string;
  onDownload: () => void;
  onClose: () => void;
}

export default function ExportPreviewModal({ code, fileName, onDownload, onClose }: Props) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-label='Export preview'
      className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center'
      onClick={onClose}
    >
      <div
        className='bg-white w-full max-w-3xl rounded-lg shadow-lg p-4'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex justify-between items-center mb-2'>
          <h2 className='font-semibold'>Export Preview</h2>
          <button onClick={onClose} aria-label='Close preview'>
            ✕
          </button>
        </div>

        <div className='text-xs text-gray-500 mb-2'>File: {fileName}</div>

        <pre className='bg-gray-900 text-white text-sm p-4 rounded h-80 overflow-auto'>{code}</pre>

        <div className='mt-4 flex justify-end gap-2'>
          <button onClick={handleCopy} className='px-3 py-1 border rounded'>
            Copy
          </button>

          <button onClick={onDownload} className='px-3 py-1 bg-black text-white rounded'>
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
