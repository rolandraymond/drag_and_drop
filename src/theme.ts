const STORAGE_KEY = 'theme-mode'; // مفتاح لتخزين الوضع في localStorage

// نوع البيانات لحفظ الوضع
export type ThemeMode = 'light' | 'dark';

// دالة لاسترجاع الوضع المحفوظ من localStorage
export function getSavedTheme(): ThemeMode {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === 'dark' ? 'dark' : 'light'; // لو مفيش وضع محفوظ، يرجع "light" بالافتراضي
}

// دالة لتطبيق الوضع (تغيير الـ class في الـ HTML)
export function applyTheme(mode: ThemeMode) {
  const root = document.documentElement; // <html>
  root.classList.toggle('dark', mode === 'dark'); // إذا كان الوضع داكن، إضافة class 'dark'
  localStorage.setItem(STORAGE_KEY, mode); // حفظ الوضع في localStorage
}

// دالة لتبديل الوضع بين "light" و "dark"
export function toggleTheme(): ThemeMode {
  const next = getSavedTheme() === 'dark' ? 'light' : 'dark'; // تبديل الوضع
  applyTheme(next); // تطبيق الوضع الجديد
  return next; // إرجاع الوضع الجديد
}
