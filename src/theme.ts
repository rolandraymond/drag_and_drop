const STORAGE_KEY = 'theme-mode'; 

export type ThemeMode = 'light' | 'dark';

export function getSavedTheme(): ThemeMode {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === 'dark' ? 'dark' : 'light';
}

export function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  root.classList.toggle('dark', mode === 'dark');
  localStorage.setItem(STORAGE_KEY, mode);
}

export function toggleTheme(): ThemeMode {
  const next = getSavedTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}
