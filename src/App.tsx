import ThemeToggle from './components/ThemeToggle';

import { closestCenter, DndContext, type DragEndEvent } from '@dnd-kit/core';
import { Route, Routes } from 'react-router-dom';

import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import AboutPage from './components/AboutPage';
import Canvas from './components/Canvas';
import ForgotPassword from './components/ForgotPassword';
import Login from './components/Login';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';
import SaveButton from './components/SaveButton';
import Sidebar from './components/Sidebar';
import DraggableElement from './DraggableElement';
import { useEditorStore } from './hooks/useEditorStore';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainApp = () => {
  const elements = useEditorStore((s) => s.elements);
  const reorderElements = useEditorStore((s) => s.reorderElements);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    reorderElements(active.id as string, over.id as string);
  };
  return (
    <div className='flex h-screen bg-gray-50'>
      <div className='w-72 shrink-0 border-r bg-white sticky top-0 h-screen overflow-auto'>
        <Sidebar />
      </div>

      <div className='flex-1 overflow-hidden'>
        <div className='h-full overflow-auto'>
          {/* Top bar */}
          <div className='sticky top-0 z-10 bg-gray-50/90 backdrop-blur border-b'>
            <div className='max-w-3xl mx-auto px-6 py-4 flex items-center justify-between'>
              <div className='text-left'>
                <div className='text-lg font-semibold text-gray-900'>Page Builder</div>
                <div className='text-sm text-gray-500'>Drag to reorder • Edit inline</div>
              </div>
              <div>
                <ThemeToggle />
                <SaveButton />
              </div>
            </div>
          </div>
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
          >
            <Canvas>
              <SortableContext
                items={elements.map((e) => e.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className='max-w-3xl mx-auto px-6 py-8 space-y-6'>
                  {elements.length === 0 ? (
                    <div className='rounded-xl border border-dashed bg-white p-10 text-center'>
                      <div className='text-gray-900 font-medium'>No elements yet</div>
                      <div className='text-gray-500 text-sm mt-1'>
                        Add Text / Question / Image Question from the left.
                      </div>
                    </div>
                  ) : (
                    elements.map((el) => <DraggableElement key={el.id} element={el} />)
                  )}
                </div>
              </SortableContext>
            </Canvas>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <>
      <ToastContainer
        position='top-right'
        autoClose={2500}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/About' element={<AboutPage />} />
        <Route path='/' element={<MainApp />} />
      </Routes>
    </>
  );
}
