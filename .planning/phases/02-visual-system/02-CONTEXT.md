# Phase 2: Visual System & Templates - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the visual system: 4 templates (Editorial Warm, Dark Executive, Clean Minimal, Neon Gradient), component library, icons (Lucide), effects (glassmorphism, gradients), and color palettes.

</domain>

<decisions>
## Implementation Decisions

### Templates
- **Editorial Warm**: Serif + Sans mix, warm earth tones, magazine feel
- **Dark Executive**: Dark backgrounds, amber/cyan accents, pitch deck style
- **Clean Minimal**: Swiss design, black/white, generous whitespace
- **Neon Gradient**: Purple/cyan gradients, dark bg, modern SaaS feel

### Icons
- Lucide icons via CDN (zero bundle size)
- Syntax: `:icon-name:` in markdown → SVG inline

### Effects
- Glassmorphism: backdrop-filter blur + semi-transparent backgrounds
- Gradients: Linear, radial, mesh via CSS
- Aurora: Animated gradient backgrounds (CSS only)
- No JS animations for PDF (static only)

### Color Palettes
- 6 built-in palettes per template
- CSS custom properties for easy theming

### Code Context
- Extend existing CSS in src/lib/css.ts
- Template CSS lives in src/lib/template.ts
- Components as reusable CSS classes

</decisions>

<code_context>
## Existing Code

- src/lib/template.ts has basic template CSS
- src/lib/css.ts has base styles
- Need to expand with full design system

</code_context>

<specifics>
## Specific Requirements

From ROADMAP:
1. Editorial Warm template produces magazine-quality PDF
2. Dark Executive template produces pitch-deck quality PDF
3. Clean Minimal template produces Swiss-design quality PDF
4. Neon Gradient template produces modern SaaS-style PDF
5. Components (cards, tags, tables, quotes, metrics) render in all templates
6. Lucide icons render inline in documents
7. Gradient classes apply correctly (50+ prebuilt)
8. Pages fill completely — no half-empty pages
</specifics>

<deferred>
## Deferred

- Page transitions (Phase 3)
- fal.ai image generation (Phase 4)
</deferred>
