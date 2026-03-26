import type { ParsedDocument, Frontmatter } from './types.js';
import { baseStyles, getPageFormatCss } from './css.js';

export interface TemplateOptions {
  format: 'a4' | '16:9' | 'letter';
  template?: string;
  palette?: Frontmatter['palette'];
}

export function generateHtml(
  doc: ParsedDocument,
  options: TemplateOptions
): string {
  const { format, template = 'editorial' } = options;
  const { html, title, frontmatter } = doc;
  
  const pageCss = getPageFormatCss(format);
  const templateCss = getTemplateCss(template);
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title || 'Document')}</title>
  <style>
    ${baseStyles}
    ${pageCss}
    ${templateCss}
  </style>
</head>
<body>
  <main class="document">
    ${format === '16:9' ? wrapSlides(html) : html}
  </main>
</body>
</html>`;
}

function wrapSlides(html: string): string {
  // For slide format, wrap each h1 section in a slide div
  const sections = html.split(/(<h1[^>]*>.*?<\/h1>)/);
  let result = '';
  let currentSlide = '';
  
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (section.match(/^<h1/)) {
      if (currentSlide) {
        result += `<div class="slide">${currentSlide}</div>`;
      }
      currentSlide = section;
    } else {
      currentSlide += section;
    }
  }
  
  if (currentSlide) {
    result += `<div class="slide">${currentSlide}</div>`;
  }
  
  return result || html;
}

function getTemplateCss(template: string): string {
  // Template-specific CSS will be expanded in Phase 2
  // For now, return the base Editorial template
  switch (template) {
    case 'dark':
      return darkTemplateCss;
    case 'minimal':
      return minimalTemplateCss;
    case 'neon':
      return neonTemplateCss;
    case 'editorial':
    default:
      return editorialTemplateCss;
  }
}

const editorialTemplateCss = `
:root {
  --color-bg: #fafaf9;
  --color-text: #1c1917;
  --color-text-muted: #78716c;
  --color-primary: #ea580c;
  --color-accent: #0d9488;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: Georgia, 'Times New Roman', serif;
}

h1, h2, h3 {
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--color-text);
}

h1 {
  border-bottom: 3px solid var(--color-primary);
  padding-bottom: 0.5rem;
}

blockquote {
  border-left-color: var(--color-accent);
}
`;

const darkTemplateCss = `
:root {
  --color-bg: #0c0a09;
  --color-text: #fafaf9;
  --color-text-muted: #a8a29e;
  --color-primary: #f97316;
  --color-accent: #14b8a6;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
}

pre {
  background: #1c1917;
  border: 1px solid #292524;
}
`;

const minimalTemplateCss = `
:root {
  --color-bg: #ffffff;
  --color-text: #171717;
  --color-text-muted: #737373;
  --color-primary: #171717;
  --color-accent: #404040;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

h1 { font-size: 2rem; }
h2 { font-size: 1.5rem; }
h3 { font-size: 1.25rem; }
`;

const neonTemplateCss = `
:root {
  --color-bg: #09090b;
  --color-text: #fafafa;
  --color-text-muted: #a1a1aa;
  --color-primary: #a855f7;
  --color-accent: #06b6d4;
}

body {
  background: linear-gradient(135deg, #09090b 0%, #1a0b2e 100%);
  color: var(--color-text);
}

h1 {
  background: linear-gradient(135deg, #a855f7 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
`;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
