export interface Frontmatter {
  title?: string;
  template?: 'editorial' | 'dark' | 'minimal' | 'neon' | string;
  format?: 'a4' | '16:9' | 'letter';
  palette?: string | ColorPalette;
  author?: string;
  date?: string;
  description?: string;
  // New features
  toc?: boolean;
  header?: string;
  footer?: string;
  pageNumbers?: boolean;
  totalPages?: boolean;
  logo?: string;
  [key: string]: unknown;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
}

export interface ParsedDocument {
  frontmatter: Frontmatter;
  html: string;
  raw: string;
  title: string;
}

export interface PDFOptions {
  format: 'a4' | '16:9' | 'letter';
  outputPath: string;
  printBackground?: boolean;
}

export interface TemplateConfig {
  name: string;
  css: string;
  pageFormat: 'a4' | '16:9';
}
