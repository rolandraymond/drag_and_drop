import {
  closestCenter,
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useEffect } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';

import Canvas from './components/Canvas';
import PagesNav from './components/PagesNav';
import SaveButton from './components/SaveButton';
import Sidebar from './components/Sidebar';
import ThemeToggle from './components/ThemeToggle';
import DraggableElement from './DraggableElement';

import AboutPage from './components/AboutPage';
import AccountPage from './components/AccountPage';
import EmailVerification from './components/EmailVerification';
import ForgotPassword from './components/ForgotPassword';
import Home from './components/Home';
import HowItWorks from './components/HowItWorks';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import QuizRuntime from './components/QuizRuntime';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from './hooks/useAuth';
import { useEditorStore } from './hooks/useEditorStore';
import { setNavigateFunction } from './utils/navigation';

const RedirectToReset = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/reset-password${window.location.search}`);
  }, [navigate]);

  return <div>Redirecting...</div>;
};

const MainApp = () => {
  const reorderElements = useEditorStore((s) => s.reorderElements);
  const meta = useEditorStore((s) => s.meta);
  const pages = useEditorStore((s) => s.pages);
  const activePageId = useEditorStore((s) => s.activePageId);

  const activePage = pages.find((p) => p.id === activePageId);
  const elements = activePage?.elements ?? [];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 8 },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    reorderElements(active.id as string, over.id as string);
  };

  return (
    <div className='h-screen flex flex-col'>
      <div className='sticky top-0 z-20 bg-white'>
        <PagesNav />
      </div>

      <div className='flex flex-1 bg-gray-50'>
        <div className='w-72 shrink-0 border-r bg-white'>
          <Sidebar />
        </div>

        <div className='flex-1 overflow-hidden'>
          <div className='h-full overflow-auto'>
            <div className='sticky top-0 z-10 bg-gray-50/90 backdrop-blur border-b'>
              <div className='max-w-3xl mx-auto px-6 py-4 flex items-center justify-between'>
                <div>
                  <div className='text-lg font-semibold text-gray-900'>
                    {meta.name || 'Untitled Quiz'}
                  </div>
                  <div className='text-sm text-gray-500'>Drag to reorder • Edit inline</div>
                </div>

                <div className='flex items-center gap-2'>
                  <ThemeToggle />
                  <SaveButton />
                  <Link to='/quiz' className='px-4 py-2 rounded border text-sm hover:bg-gray-100'>
                    Preview Quiz
                  </Link>
                </div>
              </div>
            </div>

            <DndContext
              sensors={sensors}
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
    </div>
  );
};

export default function App() {
  const navigate = useNavigate();
  const { loading } = useAuth();

  useEffect(() => {
    setNavigateFunction(navigate);
  }, [navigate]);

  if (loading) {
    return (
      <div className='min-h-screen bg-[#282930] flex items-center justify-center'>
        <div className='text-[#E3FFCC] text-xl animate-pulse'>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position='top-right' autoClose={2500} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/api/password/reset' element={<RedirectToReset />} />
        <Route path='/verify-email/:token' element={<EmailVerification />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/how-it-works' element={<HowItWorks />} />
        <Route path='/quiz' element={<QuizRuntime />} />
        <Route
          path='/account'
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/editor'
          element={
            <ProtectedRoute>
              <MainApp />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
