export const baseStyles = `
/* Reset and base styles */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  line-height: 1.6;
  color: #1a1a1a;
}

/* Page format: A4 */
@page a4 {
  size: A4;
  margin: 20mm;
}

/* Page format: 16:9 Slides */
@page slides {
  size: 1920px 1080px;
  margin: 0;
}

/* Typography */
h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; line-height: 1.2; }
h2 { font-size: 1.75rem; font-weight: 600; margin-top: 2rem; margin-bottom: 0.75rem; line-height: 1.3; }
h3 { font-size: 1.375rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; }
h4 { font-size: 1.125rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem; }

p { margin-bottom: 1rem; }

/* Lists */
ul, ol { margin-bottom: 1rem; padding-left: 1.5rem; }
li { margin-bottom: 0.25rem; }

/* Code */
code {
  font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
  font-size: 0.875em;
  background: #f4f4f5;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
}

pre {
  background: #18181b;
  color: #fafafa;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 1rem;
}

pre code {
  background: none;
  padding: 0;
  color: inherit;
}

/* Tables */
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e4e4e7;
}

th {
  font-weight: 600;
  background: #f4f4f5;
}

/* Blockquotes */
blockquote {
  border-left: 4px solid #d4d4d8;
  padding-left: 1rem;
  margin-left: 0;
  margin-bottom: 1rem;
  color: #52525b;
  font-style: italic;
}

/* Page breaks */
.page-break {
  page-break-after: always;
  break-after: page;
}

/* Print optimizations */
@media print {
  body {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}
`;

export function getPageFormatCss(format: 'a4' | '16:9' | 'letter'): string {
  switch (format) {
    case 'a4':
      return `
        @page { size: A4; margin: 20mm; }
        body { padding: 0; }
      `;
    case '16:9':
      return `
        @page { size: 1920px 1080px; margin: 0; }
        body { 
          width: 1920px; 
          height: 1080px; 
          padding: 60px 80px;
          overflow: hidden;
        }
        .slide { page-break-after: always; }
      `;
    case 'letter':
      return `
        @page { size: letter; margin: 20mm; }
        body { padding: 0; }
      `;
    default:
      return getPageFormatCss('a4');
  }
}
