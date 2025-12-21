import type { EditorElement } from '../types/editor';
import type { ExportResult } from './types';

type GenerateOptions = {
  componentName?: string;
  wrapperClassName?: string;
  textClassName?: string;
};

function assertNever(value: never): never {
  const _exhaustiveCheck: never = value;
  void _exhaustiveCheck;

  throw new Error('Unsupported editor element');
}

function escapeText(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function safeClassName(className: unknown): string {
  return typeof className === 'string' ? className.trim() : '';
}

function indent(lines: string, spaces = 6): string {
  const pad = ' '.repeat(spaces);
  return lines
    .split('\n')
    .map((l) => (l.length ? pad + l : l))
    .join('\n');
}

function elementToJsx(el: EditorElement, warnings: string[], options: GenerateOptions): string {
  // TEXT
  if (el.type === 'text') {
    const raw = String(el.value ?? '');
    const text = escapeText(raw.trim());

    if (!text) {
      warnings.push(`Text element (${el.id}) is empty`);
      return '';
    }

    const className = safeClassName(options.textClassName) || 'text-base text-gray-900';

    return `<p className="${className}">${text}</p>`;
  }

  // QUESTION
  if (el.type === 'question') {
    const question = escapeText(String(el.question ?? '').trim());
    const answer = escapeText(String(el.answer ?? '').trim());

    if (!question) warnings.push(`Question (${el.id}) has no question`);
    if (!answer) warnings.push(`Question (${el.id}) has no answer`);

    return `
<div className="space-y-2">
  <p className="font-medium text-gray-900">${question}</p>
  <p className="text-gray-700">${answer}</p>
</div>
`.trim();
  }

  // IMAGE QUESTION
  if (el.type === 'imageQuestion') {
    const image = String(el.image ?? '').trim();
    const question = escapeText(String(el.question ?? '').trim());
    const answer = escapeText(String(el.answer ?? '').trim());

    if (!image) {
      throw new Error(`ImageQuestion (${el.id}) has no image`);
    }

    if (!question) warnings.push(`ImageQuestion (${el.id}) has no question`);
    if (!answer) warnings.push(`ImageQuestion (${el.id}) has no answer`);

    return `
<div className="space-y-2">
  <img src="${image}" alt="question image" className="w-full h-auto rounded" />
  <p className="font-medium text-gray-900">${question}</p>
  <p className="text-gray-700">${answer}</p>
</div>
`.trim();
  }

  return assertNever(el);
}

export function generateReactTsx(
  elements: EditorElement[],
  options: GenerateOptions = {},
): { fileName: string } & ExportResult {
  const warnings: string[] = [];

  const componentName = options.componentName || 'ExportedPage';
  const wrapperClassName = options.wrapperClassName || 'max-w-3xl mx-auto px-6 py-8 space-y-6';

  const body = elements
    .map((el) => elementToJsx(el, warnings, options))
    .filter(Boolean)
    .join('\n');

  const code = `import React from "react";

export default function ${componentName}() {
  return (
    <div className="${wrapperClassName}">
${indent(body, 6)}
    </div>
  );
}
`;

  return {
    fileName: `${componentName}.tsx`,
    code,
    warnings,
  };
}
