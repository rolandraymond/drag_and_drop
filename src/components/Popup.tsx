import { createPortal } from 'react-dom';

interface PopupProps {
  message: string;
  onClose: () => void;
}

export default function Popup({ message, onClose }: PopupProps) {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return createPortal(
    <div
      className='fixed inset-0 z-[9999] flex items-center justify-center'
      role='dialog'
      aria-modal='true'
      aria-label='Success message'
    >
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black/50 backdrop-blur-[1px]' onClick={onClose} />

      {/* Modal */}
      <div
        className='relative bg-white rounded-xl shadow-xl w-[320px] p-6 text-center'
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>Export completed</h3>

        <p className='text-gray-600 mb-5 text-sm'>{message}</p>

        <button
          type='button'
          onClick={onClose}
          className='px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition'
        >
          OK
        </button>
      </div>
    </div>,
    modalRoot,
  );
}
