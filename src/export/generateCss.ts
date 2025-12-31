export function generateCss() {
  return {
    fileName: 'style.css',
    code: `
:root {
  --bg: #f9fafb;
  --card: #ffffff;
  --text: #111827;
  --muted: #6b7280;
  --border: #e5e7eb;
  --ok: #16a34a;
  --bad: #dc2626;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  background: var(--bg);
  color: var(--text);
}

.container {
  max-width: 720px;
  margin: 40px auto;
  padding: 0 16px 48px;
}

.header {
  margin-bottom: 16px;
}

.h1 {
  margin: 0;
  font-size: 28px;
}

.text {
  color: #374151;
  line-height: 1.7;
  margin: 12px 0;
}

.muted {
  color: var(--muted);
}

.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  margin: 14px 0;
}

.label {
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-weight: 600;
  font-size: 14px;
}

.input {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
}

.input:focus {
  border-color: #111827;
}

.question__img {
  width: 100%;
  height: auto;
  border-radius: 10px;
  border: 1px solid var(--border);
  margin-bottom: 10px;
}

.question__title {
  font-weight: 700;
  margin-bottom: 10px;
}

.question__row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn {
  border: 1px solid var(--border);
  background: #111827;
  color: white;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  white-space: nowrap;
}

.btn:active {
  transform: translateY(1px);
}

.feedback {
  margin-top: 10px;
  font-size: 14px;
}

.feedback.ok { color: var(--ok); }
.feedback.bad { color: var(--bad); }
`,
  };
}
