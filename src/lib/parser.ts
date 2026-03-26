import matter from 'gray-matter';
import { marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import type { ParsedDocument, Frontmatter } from './types.js';

// Configure marked with GitHub Flavored Markdown extensions
marked.use(gfmHeadingId());

marked.setOptions({
  gfm: true,
  breaks: false,
  headerIds: true,
  mangle: false,
});

export function parseMarkdown(content: string): ParsedDocument {
  // Parse frontmatter
  const { data, content: markdownContent } = matter(content);
  
  // Convert markdown to HTML
  const html = marked.parse(markdownContent, { async: false }) as string;
  
  // Extract title from frontmatter or first h1
  let title = (data as Frontmatter).title || '';
  if (!title) {
    const h1Match = markdownContent.match(/^#\s+(.+)$/m);
    if (h1Match) {
      title = h1Match[1].trim();
    }
  }
  
  return {
    frontmatter: data as Frontmatter,
    html,
    raw: markdownContent,
    title,
  };
}

export function extractFirstParagraph(markdown: string): string {
  const lines = markdown.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('---')) {
      return trimmed;
    }
  }
  return '';
}
