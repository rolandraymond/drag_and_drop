interface Props {
  code: string;
  fileName: string;
  onDownload: () => void;
  onClose: () => void;
}

export default function ExportPreviewModal({ code, fileName, onDownload, onClose }: Props) {
  return (
    <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center'>
      <div className='bg-white w-full max-w-3xl rounded-lg shadow-lg p-4'>
        <div className='flex justify-between items-center mb-3'>
          <h2 className='font-semibold'>Export Preview</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <pre className='bg-gray-900 text-white text-sm p-4 rounded h-80 overflow-auto'>{code}</pre>

        <div className='mt-4 flex justify-end gap-2'>
          <button
            onClick={() => navigator.clipboard.writeText(code)}
            className='px-3 py-1 border rounded'
          >
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
