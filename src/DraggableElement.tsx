import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useRef } from 'react';
import { useEditorStore } from './hooks/useEditorStore';
import type { EditorElement } from './types/editor';
import { toast } from 'react-toastify';

interface Props {
  element: EditorElement;
}

export default function DraggableElement({ element }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: element.id,
  });
  const updateInputLabel = useEditorStore((s) => s.updateInputLabel);
  const updateInputPlaceholder = useEditorStore((s) => s.updateInputPlaceholder);

  const updateText = useEditorStore((s) => s.updateText);
  const updateQuestion = useEditorStore((s) => s.updateQuestion);
  const updateAnswer = useEditorStore((s) => s.updateAnswer);
  const updateImageQuestionImage = useEditorStore((s) => s.updateImageQuestionImage);
  const deleteElement = useEditorStore((s) => s.deleteElement);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='w-full rounded-2xl border bg-white shadow-sm overflow-hidden'
    >
      {/* Header (Drag handle + Delete) */}
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

          <div className='text-left'>
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
          aria-label='Delete item'
          title='Delete'
        >
          Delete
        </button>
      </div>

      {/* Content */}
      <div className='p-5 space-y-4'>
        {element.type === 'input' && (
          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium text-gray-800'>Label</label>
              <input
                type='text'
                defaultValue={element.label ?? 'Input'}
                className='w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black/20 focus:border-gray-400'
                placeholder='Input label'
                onBlur={(e) => updateInputLabel(element.id, e.target.value)}
              />
            </div>

            <div>
              <label className='text-sm font-medium text-gray-800'>Placeholder</label>
              <input
                type='text'
                defaultValue={element.placeholder ?? 'Type here...'}
                className='w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black/20 focus:border-gray-400'
                placeholder='Input placeholder'
                onBlur={(e) => updateInputPlaceholder(element.id, e.target.value)}
              />
            </div>
          </div>
        )}
        {element.type === 'text' && (
          <div
            contentEditable
            suppressContentEditableWarning
            className='outline-none border border-transparent focus:border-blue-400 rounded px-2 py-1 text-left'
            onBlur={(e) => updateText(element.id, e.currentTarget.innerText)}
          >
            {element.value}
          </div>
        )}

        {element.type === 'imageQuestion' && (
          <div className='space-y-3'>
            <div>
              <img
                src={element.image || '/placeholder.png'}
                className='w-full h-auto cursor-pointer rounded'
                alt='question'
                onClick={() => fileInputRef.current?.click()}
              />

              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const reader = new FileReader();
                  reader.onload = () =>
                    updateImageQuestionImage(element.id, reader.result as string);
                  reader.readAsDataURL(file);
                }}
              />
            </div>

            <div>
              <label className='text-sm font-medium text-gray-800'>Question</label>
              <input
                type='text'
                className='w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black/20 focus:border-gray-400'
                placeholder='Write question here'
                defaultValue={element.question}
                onBlur={(e) => updateQuestion(element.id, e.target.value)}
              />
            </div>

            <div>
              <label className='text-sm font-medium text-gray-800'>Answer</label>
              <input
                type='text'
                className='w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black/20 focus:border-gray-400'
                placeholder='Write answer here'
                defaultValue={element.answer}
                onBlur={(e) => updateAnswer(element.id, e.target.value)}
              />
            </div>
          </div>
        )}

        {element.type === 'question' && (
          <>
            <div>
              <label className='text-sm font-medium text-gray-800'>Question</label>
              <input
                type='text'
                defaultValue={element.question}
                className='w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black/20 focus:border-gray-400'
                placeholder='Write question here'
                onBlur={(e) => updateQuestion(element.id, e.target.value)}
              />
            </div>

            <div>
              <label className='text-sm font-medium text-gray-800'>Answer</label>
              <input
                type='text'
                defaultValue={element.answer}
                className='w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black/20 focus:border-gray-400'
                placeholder='Write answer here'
                onBlur={(e) => updateAnswer(element.id, e.target.value)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

