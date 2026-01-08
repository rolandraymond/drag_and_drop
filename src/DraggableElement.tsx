import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import { useEditorStore } from './hooks/useEditorStore';
import type { EditorElement } from './types/editor';

interface Props {
  element: EditorElement;
}

export default function DraggableElement({ element }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: element.id,
  });

  const {
    updateText,
    updateQuestion,
    updateAnswer,
    updateImageQuestionImage,
    updateInputLabel,
    updateInputPlaceholder,
    deleteElement,
  } = useEditorStore();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const stopDnd = {
    onMouseDown: (e: React.MouseEvent) => e.stopPropagation(),
    onKeyDown: (e: React.KeyboardEvent) => e.stopPropagation(),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='w-full rounded-2xl border bg-white shadow-sm overflow-hidden'
    >
      {/* Header */}
      <div className='flex items-center justify-between px-4 py-3 bg-gray-50 border-b'>
        <div className='flex items-center gap-3'>
          <button
            type='button'
            {...listeners}
            {...attributes}
            className='cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-800 select-none'
            aria-label='Drag item'
            title='Drag'
          >
            ⠿
          </button>

          <div>
            <div className='text-sm font-semibold text-gray-900'>
              {element.type === 'text'
                ? 'Text'
                : element.type === 'question'
                ? 'Question'
                : element.type === 'imageQuestion'
                ? 'Image Question'
                : element.type === 'input'
                ? 'Input'
                : 'Unknown'}
            </div>
            <div className='text-xs text-gray-500'>Drag to reorder</div>
          </div>
        </div>

        <button
          type='button'
          onClick={() => {
            deleteElement(element.id);
            toast.info('Element deleted');
          }}
          className='text-sm px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50'
        >
          Delete
        </button>
      </div>

      {/* Content */}
      <div className='p-5 space-y-4'>
        {/* INPUT */}
        {element.type === 'input' && (
          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium text-gray-800'>Label</label>
              <input
                {...stopDnd}
                type='text'
                defaultValue={element.label ?? 'Input'}
                className='w-full rounded-lg border px-3 py-2 outline-none'
                onBlur={(e) => updateInputLabel(element.id, e.target.value)}
              />
            </div>

            <div>
              <label className='text-sm font-medium text-gray-800'>Placeholder</label>
              <input
                {...stopDnd}
                type='text'
                defaultValue={element.placeholder ?? 'Type here...'}
                className='w-full rounded-lg border px-3 py-2 outline-none'
                onBlur={(e) => updateInputPlaceholder(element.id, e.target.value)}
              />
            </div>
          </div>
        )}

        {/* TEXT */}
        {element.type === 'text' && (
          <div
            {...stopDnd}
            contentEditable
            suppressContentEditableWarning
            className='outline-none border rounded px-2 py-1'
            onBlur={(e) => updateText(element.id, e.currentTarget.innerText)}
          >
            {element.value}
          </div>
        )}

        {/* IMAGE QUESTION */}
        {element.type === 'imageQuestion' && (
          <div className='space-y-3'>
            <img
              src={element.image || '/placeholder.png'}
              className='w-full rounded cursor-pointer'
              alt='question'
              onClick={() => fileInputRef.current?.click()}
            />

            <input
              ref={fileInputRef}
              type='file'
              hidden
              accept='image/*'
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = () => updateImageQuestionImage(element.id, reader.result as string);
                reader.readAsDataURL(file);
              }}
            />

            <input
              {...stopDnd}
              type='text'
              defaultValue={element.question}
              className='w-full rounded-lg border px-3 py-2'
              placeholder='Question'
              onBlur={(e) => updateQuestion(element.id, e.target.value)}
            />

            <input
              {...stopDnd}
              type='text'
              defaultValue={element.answer}
              className='w-full rounded-lg border px-3 py-2'
              placeholder='Answer'
              onBlur={(e) => updateAnswer(element.id, e.target.value)}
            />
          </div>
        )}

        {/* QUESTION */}
        {element.type === 'question' && (
          <>
            <input
              {...stopDnd}
              type='text'
              defaultValue={element.question}
              className='w-full rounded-lg border px-3 py-2'
              placeholder='Question'
              onBlur={(e) => updateQuestion(element.id, e.target.value)}
            />

            <input
              {...stopDnd}
              type='text'
              defaultValue={element.answer}
              className='w-full rounded-lg border px-3 py-2'
              placeholder='Answer'
              onBlur={(e) => updateAnswer(element.id, e.target.value)}
            />
          </>
        )}
      </div>
    </div>
  );
}
