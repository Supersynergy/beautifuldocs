// Table of Contents generation

import type { ParsedDocument } from './types.js';

interface TocEntry {
  level: number;
  text: string;
  id: string;
}

export function extractToc(html: string): TocEntry[] {
  const toc: TocEntry[] = [];
  const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[1-6]>/gi;
  
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const id = match[2];
    // Strip HTML tags from text
    const text = match[3].replace(/<[^>]*>/g, '');
    
    if (level <= 3) { // Only h1-h3 in TOC
      toc.push({ level, text, id });
    }
  }
  
  return toc;
}

export function generateTocHtml(toc: TocEntry[]): string {
  if (toc.length === 0) return '';
  
  let html = '<nav class="toc">\n';
  html += '<h2 class="toc-title">Inhaltsverzeichnis</h2>\n';
  html += '<ul class="toc-list">\n';
  
  for (const entry of toc) {
    const indent = entry.level > 1 ? ` style="margin-left: ${(entry.level - 1) * 20}px"` : '';
    html += `  <li class="toc-item toc-level-${entry.level}"${indent}>`;
    html += `<a href="#${entry.id}">${escapeHtml(entry.text)}</a>`;
    html += '</li>\n';
  }
  
  html += '</ul>\n</nav>';
  return html;
}

export function insertToc(html: string, tocHtml: string): string {
  // Insert TOC after first h1 or at beginning
  const h1Match = html.match(/<h1[^>]*>.*?<\/h1>/i);
  if (h1Match) {
    const insertIndex = html.indexOf(h1Match[0]) + h1Match[0].length;
    return html.slice(0, insertIndex) + '\n' + tocHtml + '\n' + html.slice(insertIndex);
  }
  return tocHtml + '\n' + html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
