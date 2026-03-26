// Complete template CSS with design systems

import { Palette, generateCssVariables } from './palettes.js';

export interface Template {
  name: string;
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  css: (palette: Palette) => string;
}

export const templates: Record<string, Template> = {
  editorial: {
    name: 'Editorial Warm',
    fonts: {
      heading: "'Playfair Display', Georgia, 'Times New Roman', serif",
      body: "'Source Sans Pro', -apple-system, sans-serif",
      mono: "'SF Mono', Monaco, monospace",
    },
    css: (p) => `
      ${generateCssVariables(p)}
      
      body {
        background: var(--color-bg);
        color: var(--color-text);
        font-family: ${templates.editorial.fonts.body};
        font-size: 11pt;
        line-height: 1.7;
      }
      
      h1, h2, h3, h4, h5, h6 {
        font-family: ${templates.editorial.fonts.heading};
        font-weight: 700;
        line-height: 1.2;
        color: var(--color-text);
        margin-top: 1.5em;
        margin-bottom: 0.5em;
      }
      
      h1 { 
        font-size: 2.8em; 
        border-bottom: 3px solid var(--color-primary);
        padding-bottom: 0.3em;
        margin-top: 0;
      }
      h2 { font-size: 1.8em; color: var(--color-secondary); }
      h3 { font-size: 1.4em; }
      h4 { font-size: 1.2em; }
      
      p {
        margin-bottom: 1em;
        text-align: justify;
        hyphens: auto;
      }
      
      blockquote {
        border-left: 4px solid var(--color-accent);
        padding: 0.5em 1em;
        margin: 1em 0;
        background: var(--color-surface);
        font-style: italic;
        color: var(--color-text-muted);
      }
      
      blockquote p:last-child { margin-bottom: 0; }
      
      code {
        font-family: ${templates.editorial.fonts.mono};
        font-size: 0.9em;
        background: var(--color-surface);
        padding: 0.15em 0.4em;
        border-radius: 3px;
        color: var(--color-primary);
      }
      
      pre {
        background: #1c1917;
        color: #fafaf9;
        padding: 1em;
        border-radius: 8px;
        overflow-x: auto;
        margin: 1em 0;
      }
      
      pre code {
        background: none;
        color: inherit;
        padding: 0;
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 1em 0;
        font-size: 0.95em;
      }
      
      th, td {
        padding: 0.75em;
        text-align: left;
        border-bottom: 1px solid var(--color-border);
      }
      
      th {
        font-weight: 600;
        background: var(--color-surface);
        border-bottom: 2px solid var(--color-primary);
      }
      
      a {
        color: var(--color-primary);
        text-decoration: none;
        border-bottom: 1px solid transparent;
        transition: border-color 0.2s;
      }
      
      ul, ol {
        margin: 1em 0;
        padding-left: 1.5em;
      }
      
      li {
        margin: 0.3em 0;
      }
      
      hr {
        border: none;
        border-top: 1px solid var(--color-border);
        margin: 2em 0;
      }
    `,
  },

  dark: {
    name: 'Dark Executive',
    fonts: {
      heading: "'Inter', -apple-system, sans-serif",
      body: "'Inter', -apple-system, sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
    css: (p) => `
      ${generateCssVariables(p)}
      
      body {
        background: var(--color-bg);
        color: var(--color-text);
        font-family: ${templates.dark.fonts.body};
        font-size: 11pt;
        line-height: 1.6;
      }
      
      h1, h2, h3, h4, h5, h6 {
        font-family: ${templates.dark.fonts.heading};
        font-weight: 700;
        color: var(--color-text);
        margin-top: 1.5em;
        margin-bottom: 0.5em;
        letter-spacing: -0.02em;
      }
      
      h1 { 
        font-size: 2.5em;
        background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-top: 0;
      }
      h2 { font-size: 1.6em; color: var(--color-primary); }
      h3 { font-size: 1.3em; }
      
      p { margin-bottom: 1em; }
      
      blockquote {
        border-left: 3px solid var(--color-primary);
        padding: 0.75em 1.25em;
        margin: 1.5em 0;
        background: var(--color-surface);
        border-radius: 0 8px 8px 0;
      }
      
      code {
        font-family: ${templates.dark.fonts.mono};
        background: var(--color-surface);
        color: var(--color-primary);
        padding: 0.2em 0.4em;
        border-radius: 4px;
        font-size: 0.9em;
      }
      
      pre {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        padding: 1em;
        border-radius: 8px;
        overflow-x: auto;
      }
      
      pre code {
        background: none;
        color: var(--color-text);
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 1em 0;
      }
      
      th, td {
        padding: 0.75em;
        text-align: left;
        border-bottom: 1px solid var(--color-border);
      }
      
      th {
        font-weight: 600;
        color: var(--color-primary);
        text-transform: uppercase;
        font-size: 0.85em;
        letter-spacing: 0.05em;
      }
      
      tr:hover { background: var(--color-surface); }
      
      a {
        color: var(--color-primary);
        text-decoration: none;
      }
      
      a:hover { text-decoration: underline; }
    `,
  },

  minimal: {
    name: 'Clean Minimal',
    fonts: {
      heading: "'Inter', -apple-system, sans-serif",
      body: "'Inter', -apple-system, sans-serif",
      mono: "'SF Mono', monospace",
    },
    css: (p) => `
      ${generateCssVariables(p)}
      
      body {
        background: var(--color-bg);
        color: var(--color-text);
        font-family: ${templates.minimal.fonts.body};
        font-size: 10.5pt;
        line-height: 1.5;
      }
      
      h1, h2, h3, h4, h5, h6 {
        font-family: ${templates.minimal.fonts.heading};
        font-weight: 600;
        color: var(--color-text);
        margin-top: 2em;
        margin-bottom: 0.75em;
        letter-spacing: -0.01em;
      }
      
      h1 { 
        font-size: 2em; 
        font-weight: 700;
        border-bottom: 2px solid var(--color-text);
        padding-bottom: 0.3em;
        margin-top: 0;
      }
      h2 { font-size: 1.4em; border-bottom: 1px solid var(--color-border); padding-bottom: 0.2em; }
      h3 { font-size: 1.15em; font-weight: 600; }
      
      p { margin-bottom: 1em; }
      
      blockquote {
        border-left: 2px solid var(--color-text);
        padding-left: 1em;
        margin: 1em 0;
        color: var(--color-text-muted);
        font-style: normal;
      }
      
      code {
        font-family: ${templates.minimal.fonts.mono};
        background: var(--color-surface);
        padding: 0.15em 0.3em;
        font-size: 0.9em;
      }
      
      pre {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        padding: 1em;
        overflow-x: auto;
      }
      
      pre code {
        background: none;
        padding: 0;
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 1em 0;
        font-size: 0.95em;
      }
      
      th, td {
        padding: 0.5em;
        text-align: left;
        border-bottom: 1px solid var(--color-border);
      }
      
      th {
        font-weight: 600;
        border-bottom: 2px solid var(--color-text);
      }
      
      a {
        color: var(--color-text);
        text-decoration: underline;
        text-decoration-color: var(--color-text-muted);
      }
    `,
  },

  neon: {
    name: 'Neon Gradient',
    fonts: {
      heading: "'Space Grotesk', 'Inter', sans-serif",
      body: "'Inter', -apple-system, sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
    css: (p) => `
      ${generateCssVariables(p)}
      
      body {
        background: linear-gradient(135deg, var(--color-bg) 0%, var(--color-surface) 100%);
        color: var(--color-text);
        font-family: ${templates.neon.fonts.body};
        font-size: 11pt;
        line-height: 1.6;
      }
      
      h1, h2, h3, h4, h5, h6 {
        font-family: ${templates.neon.fonts.heading};
        font-weight: 700;
        margin-top: 1.5em;
        margin-bottom: 0.5em;
      }
      
      h1 { 
        font-size: 2.5em;
        background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 50%, var(--color-accent) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-top: 0;
      }
      h2 { 
        font-size: 1.5em; 
        color: var(--color-primary);
        text-shadow: 0 0 20px var(--color-primary);
      }
      h3 { font-size: 1.2em; color: var(--color-accent); }
      
      p { margin-bottom: 1em; }
      
      blockquote {
        border-left: 3px solid var(--color-primary);
        padding: 1em 1.5em;
        margin: 1.5em 0;
        background: rgba(168, 85, 247, 0.1);
        border-radius: 0 12px 12px 0;
        position: relative;
      }
      
      blockquote::before {
        content: '"';
        font-size: 4em;
        color: var(--color-primary);
        opacity: 0.3;
        position: absolute;
        top: -0.2em;
        left: 0.2em;
        font-family: Georgia, serif;
      }
      
      code {
        font-family: ${templates.neon.fonts.mono};
        background: rgba(168, 85, 247, 0.15);
        color: var(--color-primary);
        padding: 0.2em 0.4em;
        border-radius: 4px;
        font-size: 0.9em;
      }
      
      pre {
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid var(--color-border);
        padding: 1em;
        border-radius: 12px;
        overflow-x: auto;
        box-shadow: 0 0 30px rgba(168, 85, 247, 0.1);
      }
      
      pre code {
        background: none;
        color: var(--color-text);
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 1em 0;
      }
      
      th, td {
        padding: 0.75em;
        text-align: left;
        border-bottom: 1px solid var(--color-border);
      }
      
      th {
        font-weight: 600;
        color: var(--color-primary);
        text-transform: uppercase;
        font-size: 0.8em;
        letter-spacing: 0.1em;
      }
      
      a {
        color: var(--color-accent);
        text-decoration: none;
        border-bottom: 1px solid var(--color-primary);
      }
    `,
  },
};

export function getTemplate(name: string): Template {
  return templates[name] || templates.editorial;
}
