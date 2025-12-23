interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <div className='w-full max-w-sm rounded-xl bg-white p-6 shadow-lg'>
        <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>

        {description && <p className='mt-2 text-sm text-gray-600'>{description}</p>}

        <div className='mt-6 flex justify-end gap-3'>
          <button
            onClick={onCancel}
            className='px-4 py-2 rounded-lg border text-sm hover:bg-gray-50'
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className='px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700'
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
