import type { InputElement } from '../types/editor';

export default function InputCard({
  element,
  onDelete,
}: {
  element: InputElement;
  onDelete: () => void;
}) {
  return (
    <div className='border rounded-xl bg-white p-4 flex justify-between items-center'>
      <div>
        <div className='font-semibold'>Input Page</div>
        <div className='text-xs text-gray-500'>{element.label ?? 'User input'}</div>
      </div>

      <button onClick={onDelete} className='text-red-600 text-sm border px-3 py-1 rounded'>
        Delete
      </button>
    </div>
  );
}
