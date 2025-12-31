module.exports = {
  darkMode: 'class', // تأكد من تمكين الوضع الداكن باستخدام 'class'
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'], // تأكد من أن Tailwind يراقب جميع ملفاتك
  theme: {
    extend: {}, // هنا تقدر تضيف أي تعديلات تانية
  },
  plugins: [],
};
