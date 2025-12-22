import { useEditorStore } from '../hooks/useEditorStore';

export default function MetadataForm() {
  const meta = useEditorStore((s) => s.meta);
  const setMeta = useEditorStore((s) => s.setMeta);

  return (
    <div className='space-y-3'>
      <div>
        <label className='block text-sm text-gray-600 mb-1'>Page name</label>
        <input
          type='text'
          value={meta.name}
          onChange={(e) => setMeta({ name: e.target.value })}
          className='w-full border rounded px-3 py-2 text-sm'
          placeholder='Landing page'
        />
      </div>

      <div>
        <label className='block text-sm text-gray-600 mb-1'>Description</label>
        <textarea
          value={meta.description}
          onChange={(e) => setMeta({ description: e.target.value })}
          className='w-full border rounded px-3 py-2 text-sm'
          rows={3}
          placeholder='Short description of the page'
        />
      </div>

      <div>
        <label className='block text-sm text-gray-600 mb-1'>Author</label>
        <input
          type='text'
          value={meta.author}
          onChange={(e) => setMeta({ author: e.target.value })}
          className='w-full border rounded px-3 py-2 text-sm'
          placeholder='Your name'
        />
      </div>
    </div>
  );
}
