import { useEffect, useState } from 'react';
import { getSavedTheme, toggleTheme } from '../theme';

export default function ThemeToggle() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    setMode(getSavedTheme());
  }, []);

  const handleToggle = () => {
    const next = toggleTheme(); /
    setMode(next); 
  };

  return (
    <button
      type='button'
      onClick={handleToggle}
      className='
        px-3 py-2 rounded-lg border text-sm
        bg-white text-gray-900 border-gray-200 hover:bg-gray-50
        dark:bg-slate-900 dark:text-slate-100
        dark:border-slate-700 dark:hover:bg-slate-800
      '
      aria-label='Toggle theme'
      title='Toggle theme'
    >
      {mode === 'dark' ? '🌙 Dark' : '☀️ Light'} {/* تغيير النص على حسب الوضع */}
    </button>
  );
}
