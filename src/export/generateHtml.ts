import type { EditorPage } from '../types/editor';
import type { ExportResult } from './types';

/* ================= helpers ================= */

function escapeHtml(value: string | undefined | null): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function fileNameForPage(index: number) {
  return index === 0 ? 'index.html' : `page-${index + 1}.html`;
}

/* ================= navigation ================= */

function renderNav(pages: EditorPage[], activeIndex: number) {
  return `
<nav class="nav">
  ${pages
    .map((p, i) => {
      const file = fileNameForPage(i);
      const label = escapeHtml(p.name || `Page ${i + 1}`);
      const active = i === activeIndex ? 'active' : '';
      return `<a class="nav__link ${active}" href="./${file}">${label}</a>`;
    })
    .join('\n')}
</nav>
`.trim();
}

/* ================= elements ================= */

function renderElement(el: any): string {
  if (el.type === 'text') {
    return `<p class="text">${escapeHtml(el.value)}</p>`;
  }

  if (el.type === 'question') {
    return `
<section class="card question">
  <div class="question__title">${escapeHtml(el.question)}</div>
  <div class="question__row">
    <input class="input" type="text" data-answer="${escapeHtml(el.answer)}" />
    <button class="btn submit">Submit</button>
  </div>
  <div class="feedback"></div>
</section>
`.trim();
  }

  if (el.type === 'imageQuestion') {
    return `
<section class="card question">
  <img class="question__img" src="${escapeHtml(el.image)}" alt="question image" />
  <div class="question__title">${escapeHtml(el.question)}</div>
  <div class="question__row">
    <input class="input" type="text" data-answer="${escapeHtml(el.answer)}" />
    <button class="btn submit">Submit</button>
  </div>
  <div class="feedback"></div>
</section>
`.trim();
  }

  if (el.type === 'input') {
    return `
<section class="card">
  <label class="input__label">${escapeHtml(el.label)}</label>
  <input class="input" type="text" placeholder="${escapeHtml(el.placeholder)}" />
</section>
`.trim();
  }

  return '';
}

/* ================= main generator ================= */

export function generateHtml(
  page: EditorPage,
  pages: EditorPage[],
  pageIndex: number,
): { fileName: string } & ExportResult {
  const warnings: string[] = [];

  const categoryLabel = page.categoryName ?? page.categoryId ?? '';
  const subcategoryLabel = page.subcategoryName ?? page.subcategoryId ?? '';

  const elementsHtml = page.elements.map(renderElement).join('\n');

  const code = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(page.name)}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="./style.css" />
</head>

<body>

  ${renderNav(pages, pageIndex)}

  <main class="container">

    <header class="page-header">
      <h1 class="page-title">${escapeHtml(page.name)}</h1>

      ${page.description ? `<p class="page-description">${escapeHtml(page.description)}</p>` : ''}

      <div class="page-meta">
        ${
          categoryLabel
            ? `<span class="page-category">Category: ${escapeHtml(categoryLabel)}</span>`
            : ''
        }
        ${
          subcategoryLabel
            ? `<span class="page-subcategory">Subcategory: ${escapeHtml(subcategoryLabel)}</span>`
            : ''
        }
      </div>
    </header>

    <section class="page-content">
      ${elementsHtml}
    </section>

    ${page.author ? `<footer class="page-footer">By ${escapeHtml(page.author)}</footer>` : ''}

  </main>

  <script src="./script.js"></script>
</body>
</html>`;

  return {
    fileName: fileNameForPage(pageIndex),
    code,
    warnings,
  };
}
