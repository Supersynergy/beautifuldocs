import type { ParsedDocument, Frontmatter } from './types.js';
import { baseStyles, getPageFormatCss } from './css.js';
import { getTemplate, getPalette, generateCssVariables } from './templates.js';
import { getEffectStyles } from './effects.js';
import { getComponentStyles } from './components.js';

export interface TemplateOptions {
  format: 'a4' | '16:9' | 'letter';
  template?: string;
  palette?: Frontmatter['palette'];
}

export function generateHtml(
  doc: ParsedDocument,
  options: TemplateOptions
): string {
  const { format, template: templateName = 'editorial', palette: paletteName } = options;
  const { html, title, frontmatter } = doc;
  
  // Get template and palette
  const template = getTemplate(templateName);
  const paletteKey = (typeof paletteName === 'string' ? paletteName : null) || 
                     `${templateName}-${getDefaultPaletteForTemplate(templateName)}`;
  const palette = getPalette(paletteKey);
  
  const pageCss = getPageFormatCss(format);
  const templateCss = template.css(palette);
  const effectCss = getEffectStyles();
  const componentCss = getComponentStyles();
  
  // Add Google Fonts link for the template
  const fontLink = getFontLink(templateName);
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title || 'Document')}</title>
  ${fontLink}
  <style>
    ${baseStyles}
    ${pageCss}
    ${templateCss}
    ${effectCss}
    ${componentCss}
    
    /* Template-specific CSS variables */
    :root {
      ${generateCssVariables(palette)}
    }
  </style>
</head>
<body>
  <main class="document template-${templateName}">
    ${format === '16:9' ? wrapSlides(html) : html}
  </main>
</body>
</html>`;
}

function getFontLink(templateName: string): string {
  const fonts: Record<string, string> = {
    editorial: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Source+Sans+Pro:wght@400;600&display=swap',
    dark: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
    minimal: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    neon: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap',
  };
  
  const fontUrl = fonts[templateName] || fonts.editorial;
  return `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontUrl}" rel="stylesheet">`;
}

function getDefaultPaletteForTemplate(template: string): string {
  const defaults: Record<string, string> = {
    editorial: 'cream',
    dark: 'slate',
    minimal: 'pure',
    neon: 'purple',
  };
  return defaults[template] || 'cream';
}

function wrapSlides(html: string): string {
  // Split by h1 for slides
  const sections = html.split(/(<h1[^>]*>.*?<\/h1>)/i);
  let result = '';
  let currentSlide = '';
  
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (section.match(/^<h1/i)) {
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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Re-export for convenience
export { getTemplate, getPalette, templates, palettes };
