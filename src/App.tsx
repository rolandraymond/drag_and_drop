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
import { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  hasEmptyPages,
  hasEmptyElements,
} from './utils/validation/editorValidation';

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
import type { Category, Subcategory } from './types/schema';


const RedirectToReset = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/reset-password${window.location.search}`);
  }, [navigate]);

  return <div>Redirecting...</div>;
};
const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('access_token');

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }

  return res.json();
};

const MainApp = () => {
  const navigate = useNavigate();

 const reorderElements = useEditorStore((s) => s.reorderElements);
const meta = useEditorStore((s) => s.meta);
const pages = useEditorStore((s) => s.pages);
const activePageId = useEditorStore((s) => s.activePageId);

const categoryId = useEditorStore((s) => s.categoryId);
const setCategoryId = useEditorStore((s) => s.setCategoryId);

const subcategoryId = useEditorStore((s) => s.subcategoryId);
const setSubcategoryId = useEditorStore((s) => s.setSubcategoryId);

const [categories, setCategories] = useState<Category[]>([]);
const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

const [newCategoryName, setNewCategoryName] = useState('');
const [newSubcategoryName, setNewSubcategoryName] = useState('');
const handlePreview = () => {
  const pages = useEditorStore.getState().pages;
  const categoryId = useEditorStore.getState().categoryId;

  if (hasEmptyPages(pages)) {
    toast.error('One or more pages are empty.');
    return;
  }

  if (hasEmptyElements(pages)) {
    toast.error('Some questions or inputs are empty.');
    return;
  }

  if (!categoryId) {
    toast.error('Please select a category before previewing.');
    return;
  }

  navigate('/quiz');
};

 useEffect(() => {
  authFetch('http://localhost:8000/api/categories')
    .then(setCategories)
    .catch(console.error);
}, []);

 useEffect(() => {
  if (!categoryId) return;

  fetch(`http://localhost:8000/api/categories/${categoryId}/subcategories`)
    .then(res => res.json())
    .then(setSubcategories);
}, [categoryId]);


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
  <div className='max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4'>

    {/* LEFT */}
    <div className='min-w-[200px]'>
      <div className='text-lg font-semibold text-gray-900'>
        {meta.name || 'Untitled Quiz'}
      </div>
      <div className='text-sm text-gray-500'>
        Drag to reorder • Edit inline
      </div>
    </div>

    {/* CENTER */}
    <div className='flex flex-col gap-2'>

      {/* CATEGORY */}
      <div className='flex items-center gap-2'>
        <select
           value={categoryId ?? ''}
          onChange={(e) => {
            const id = e.target.value;
            setCategoryId(id || '');
            setSubcategoryId('');
            setSubcategories([]);
            setNewSubcategoryName('');
          }}
          className='border rounded px-2 py-1 text-sm'
        >
          <option value=''>Select category</option>
          {categories.map((c) => (
            <option key={c._id ?? c.name} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder='New category'
          className='border rounded px-2 py-1 text-sm'
        />

        <button
          disabled={!newCategoryName.trim()}
       onClick={async () => {
              if (!newCategoryName.trim()) return;

              try {
                const created: Category = await authFetch(
                  'http://localhost:8000/api/categories',
                  {
                    method: 'POST',
                    body: JSON.stringify({ name: newCategoryName }),
                  }
                );

                setCategories((prev) => [created, ...prev]);
                setCategoryId(created._id);
                setNewCategoryName('');
              } catch (err) {
                console.error(err);
              }
            }}

              className='px-3 py-1 border rounded text-sm disabled:opacity-50'
            >
              Add
            </button>
          </div>

          {/* SUBCATEGORY */}
          <div className='flex items-center gap-2'>
            <select
               value={subcategoryId ?? ''}
              onChange={(e) => setSubcategoryId(e.target.value)}
              disabled={!categoryId}
              className='border rounded px-2 py-1 text-sm'
            >
              <option value=''>Select subcategory</option>
              {subcategories.map((s) => (
                <option key={s._id}  value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>

            <input
              value={newSubcategoryName}
              onChange={(e) => setNewSubcategoryName(e.target.value)}
              placeholder='New subcategory'
              disabled={!categoryId}
              className='border rounded px-2 py-1 text-sm'
            />

            <button
              disabled={!categoryId || !newSubcategoryName.trim()}
              onClick={async () => {
      if (!newSubcategoryName.trim()) return;

      try {
        const created: Subcategory = await authFetch(
          'http://localhost:8000/api/subcategories',
          {
            method: 'POST',
            body: JSON.stringify({
              name: newSubcategoryName,
              category_id: categoryId,
            }),
          }
        );

        setSubcategories((prev) => [...prev, created]);
        setSubcategoryId(created._id);
        setNewSubcategoryName('');
      } catch (err) {
        console.error(err);
      }
    }}


          className='px-3 py-1 border rounded text-sm disabled:opacity-50'
        >
          Add
        </button>
      </div>
    </div>

    {/* RIGHT */}
    <div className='flex items-center gap-2'>
      <ThemeToggle />
      <SaveButton />
            <button
        type="button"
        onClick={handlePreview}
        className="px-4 py-2 rounded border text-sm hover:bg-gray-100"
      >
        Preview
      </button>

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
