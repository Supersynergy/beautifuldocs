// Export to various formats: PPTX, reveal.js, etc.

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import type { ParsedDocument } from './types.js';

export async function exportToPptx(
  doc: ParsedDocument,
  outputPath: string
): Promise<void> {
  // Check for pandoc
  try {
    execSync('which pandoc', { stdio: 'pipe' });
  } catch {
    throw new Error('pandoc not installed. Install with: brew install pandoc');
  }
  
  // Create temporary markdown file
  const tempMd = outputPath.replace('.pptx', '.temp.md');
  const { title, raw } = doc;
  
  // Convert markdown to pandoc format
  const pandocContent = `% ${title}\n\n${raw}`;
  writeFileSync(tempMd, pandocContent);
  
  try {
    // Use pandoc to convert to PPTX
    execSync(`pandoc "${tempMd}" -o "${outputPath}" --reference-doc=default`, {
      stdio: 'inherit',
    });
  } finally {
    // Cleanup
    try {
      execSync(`rm "${tempMd}"`);
    } catch {}
  }
}

export async function exportToReveal(
  doc: ParsedDocument,
  outputPath: string
): Promise<void> {
  const { title, html, frontmatter } = doc;
  
  // Parse slides from HTML (split by h1)
  const slides = parseSlides(html);
  
  const revealHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/reveal.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/theme/${frontmatter.template === 'dark' ? 'black' : 'white'}.css">
  <style>
    .reveal {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .reveal h1, .reveal h2, .reveal h3 {
      font-family: inherit;
      text-transform: none;
    }
    .reveal .slides section {
      text-align: left;
    }
  </style>
</head>
<body>
  <div class="reveal">
    <div class="slides">
      ${slides.map(slide => `<section>${slide}</section>`).join('\n      ')}
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/reveal.js"></script>
  <script>
    Reveal.initialize({
      hash: true,
      slideNumber: 'c/t',
      showSlideNumber: 'all',
      transition: 'slide',
      width: 1920,
      height: 1080,
    });
  </script>
</body>
</html>`;
  
  writeFileSync(outputPath, revealHtml);
}

function parseSlides(html: string): string[] {
  // Split by h1
  const sections = html.split(/<h1[^>]*>([^<]*)<\/h1>/i);
  const slides: string[] = [];
  
  for (let i = 1; i < sections.length; i += 2) {
    const title = sections[i];
    const content = sections[i + 1] || '';
    slides.push(`<h2>${title}</h2>${content}`);
  }
  
  // If no h1 found, treat entire content as one slide
  if (slides.length === 0) {
    slides.push(html);
  }
  
  return slides;
}

export async function exportToSingleHtml(
  html: string,
  outputPath: string
): Promise<void> {
  // Inline all resources for single-file export
  const inlined = await inlineResources(html);
  writeFileSync(outputPath, inlined);
}

async function inlineResources(html: string): Promise<string> {
  // Simple inlining - replace external links with inline content
  // In production, would fetch and inline CSS, fonts, images
  
  return html.replace(
    /<link[^>]*href="([^"]*)"[^>]*>/g,
    (match, href) => {
      if (href.startsWith('http')) {
        // Keep external links for now
        return match;
      }
      return match; // Would inline local resources
    }
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// List available export formats
export const EXPORT_FORMATS = {
  pptx: {
    name: 'PowerPoint',
    ext: '.pptx',
    description: 'Microsoft PowerPoint presentation',
    requires: ['pandoc'],
  },
  reveal: {
    name: 'Reveal.js',
    ext: '.html',
    description: 'Interactive HTML slides',
    requires: [],
  },
  single: {
    name: 'Single File HTML',
    ext: '.html',
    description: 'Self-contained HTML document',
    requires: [],
  },
};
