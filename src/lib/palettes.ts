// Color palettes for all templates

export interface Palette {
  name: string;
  bg: string;
  surface: string;
  text: string;
  textMuted: string;
  primary: string;
  secondary: string;
  accent: string;
  border: string;
}

export const palettes: Record<string, Palette> = {
  // Editorial Warm palettes
  'editorial-cream': {
    name: 'Cream',
    bg: '#fafaf9',
    surface: '#ffffff',
    text: '#1c1917',
    textMuted: '#78716c',
    primary: '#ea580c',
    secondary: '#a16207',
    accent: '#0d9488',
    border: '#e7e5e4',
  },
  'editorial-sage': {
    name: 'Sage',
    bg: '#f6f7f4',
    surface: '#ffffff',
    text: '#1c1917',
    textMuted: '#657058',
    primary: '#4d7c0f',
    secondary: '#78716c',
    accent: '#0f766e',
    border: '#dcfce7',
  },
  'editorial-terracotta': {
    name: 'Terracotta',
    bg: '#fdf8f6',
    surface: '#ffffff',
    text: '#1c1917',
    textMuted: '#9a3412',
    primary: '#c2410c',
    secondary: '#78716c',
    accent: '#be185d',
    border: '#fed7aa',
  },

  // Dark Executive palettes
  'dark-slate': {
    name: 'Slate',
    bg: '#0f172a',
    surface: '#1e293b',
    text: '#f8fafc',
    textMuted: '#94a3b8',
    primary: '#38bdf8',
    secondary: '#818cf8',
    accent: '#f472b6',
    border: '#334155',
  },
  'dark-amber': {
    name: 'Amber',
    bg: '#0c0a09',
    surface: '#1c1917',
    text: '#fafaf9',
    textMuted: '#a8a29e',
    primary: '#f59e0b',
    secondary: '#d97706',
    accent: '#10b981',
    border: '#292524',
  },
  'dark-cyber': {
    name: 'Cyber',
    bg: '#09090b',
    surface: '#18181b',
    text: '#fafafa',
    textMuted: '#a1a1aa',
    primary: '#22d3ee',
    secondary: '#a855f7',
    accent: '#f43f5e',
    border: '#27272a',
  },

  // Clean Minimal palettes
  'minimal-pure': {
    name: 'Pure',
    bg: '#ffffff',
    surface: '#fafafa',
    text: '#171717',
    textMuted: '#737373',
    primary: '#171717',
    secondary: '#525252',
    accent: '#404040',
    border: '#e5e5e5',
  },
  'minimal-mono': {
    name: 'Mono',
    bg: '#fafafa',
    surface: '#ffffff',
    text: '#000000',
    textMuted: '#666666',
    primary: '#000000',
    secondary: '#333333',
    accent: '#999999',
    border: '#dddddd',
  },

  // Neon Gradient palettes
  'neon-purple': {
    name: 'Purple',
    bg: '#09090b',
    surface: '#0f0518',
    text: '#fafafa',
    textMuted: '#c4b5fd',
    primary: '#a855f7',
    secondary: '#7c3aed',
    accent: '#06b6d4',
    border: '#4c1d95',
  },
  'neon-sunset': {
    name: 'Sunset',
    bg: '#0c0a09',
    surface: '#1a0f0a',
    text: '#fff7ed',
    textMuted: '#fdba74',
    primary: '#f97316',
    secondary: '#ec4899',
    accent: '#8b5cf6',
    border: '#7c2d12',
  },
};

export function getPalette(name: string): Palette {
  return palettes[name] || palettes['editorial-cream'];
}

export function generateCssVariables(palette: Palette): string {
  return `
    --color-bg: ${palette.bg};
    --color-surface: ${palette.surface};
    --color-text: ${palette.text};
    --color-text-muted: ${palette.textMuted};
    --color-primary: ${palette.primary};
    --color-secondary: ${palette.secondary};
    --color-accent: ${palette.accent};
    --color-border: ${palette.border};
  `;
}
