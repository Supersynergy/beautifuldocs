# Requirements: BeautifulDocs Creator

**Defined:** 2026-03-25
**Core Value:** Any content → stunning document in seconds, locally, with infinite style flexibility

## v1 Requirements

### Core Engine

- [ ] **CORE-01**: CLI accepts Markdown file with frontmatter and produces PDF
- [ ] **CORE-02**: Frontmatter config: title, template, palette, format (A4/Letter/16:9), pages
- [ ] **CORE-03**: Markdown → HTML conversion via marked with GFM support
- [ ] **CORE-04**: HTML → PDF rendering via Playwright headless Chromium
- [ ] **CORE-05**: Watch mode — auto-rebuild on file changes, serve HTML in browser
- [ ] **CORE-06**: Batch processing — convert multiple files in one command

### Template System

- [ ] **TMPL-01**: Template engine using tagged template literals (zero deps)
- [ ] **TMPL-02**: 4+ built-in templates: Editorial Warm, Dark Executive, Clean Minimal, Neon Gradient
- [ ] **TMPL-03**: Dynamic style generation — describe desired look in frontmatter, system creates CSS
- [ ] **TMPL-04**: Component library: cards, tags, progress bars, funnels, quotes, metrics, tables
- [ ] **TMPL-05**: Page-fill intelligence — content distributes to fill pages completely
- [ ] **TMPL-06**: Multiple output layouts: multi-page report, slide deck (16:9), one-pager

### Visual System

- [ ] **VIS-01**: Gradient toolkit: linear, radial, conic, mesh — 50+ prebuilt combos as CSS classes
- [ ] **VIS-02**: Effect library: glassmorphism, neumorphism, aurora, grain, noise overlays
- [ ] **VIS-03**: Decorative elements: orbs, blobs, geometric shapes, accent lines as CSS primitives
- [ ] **VIS-04**: Background patterns: dots, grids, waves, topography as SVG patterns
- [ ] **VIS-05**: Icon integration: Lucide SVG sprites (1600+ icons) usable in any template
- [ ] **VIS-06**: Typography system: 5+ font pairings (Serif+Sans, all-Sans, Mono-accent)
- [ ] **VIS-07**: Color palette system: 20+ curated palettes + custom palette builder via frontmatter
- [ ] **VIS-08**: Page transitions: slide, fade, morph for HTML browser output (View Transitions API)

### AI Integration

- [ ] **AI-01**: fal.ai integration — generate hero images, backgrounds, textures per section
- [ ] **AI-02**: OpenRouter connection — content generation + style prompt interpretation
- [ ] **AI-03**: Claude Code skill `/beautifuldocs` — generates content + template + renders PDF
- [ ] **AI-04**: Style prompt system — user describes look in natural language, system creates matching CSS

### Developer Experience

- [ ] **DX-01**: `bun create beautifuldocs` scaffolding for new document projects
- [ ] **DX-02**: Clean README with before/after examples, output screenshots
- [ ] **DX-03**: npm publishable package with `npx beautifuldocs` support
- [ ] **DX-04**: Plugin architecture — custom templates/components via local plugin directory

## v2 Requirements

### Extended Features

- **EXT-01**: PPTX export (via pptxgenjs or similar)
- **EXT-02**: Analytics — track PDF opens/shares
- **EXT-03**: Template marketplace — share/discover community templates
- **EXT-04**: Localization — RTL support, multi-language templates

## Out of Scope

| Feature | Reason |
|---------|--------|
| Web app / SaaS | CLI-first, local-first tool |
| Real-time collaboration | Single-user tool |
| WYSIWYG editor | Code/markdown input only |
| PowerPoint/Keynote import | We generate, not convert |
| Video output | PDFs and HTML only |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CORE-01 | Phase 1 | Pending |
| CORE-02 | Phase 1 | Pending |
| CORE-03 | Phase 1 | Pending |
| CORE-04 | Phase 1 | Pending |
| CORE-05 | Phase 3 | Pending |
| CORE-06 | Phase 3 | Pending |
| TMPL-01 | Phase 2 | Pending |
| TMPL-02 | Phase 2 | Pending |
| TMPL-03 | Phase 4 | Pending |
| TMPL-04 | Phase 2 | Pending |
| TMPL-05 | Phase 2 | Pending |
| TMPL-06 | Phase 2 | Pending |
| VIS-01 | Phase 2 | Pending |
| VIS-02 | Phase 2 | Pending |
| VIS-03 | Phase 2 | Pending |
| VIS-04 | Phase 2 | Pending |
| VIS-05 | Phase 2 | Pending |
| VIS-06 | Phase 2 | Pending |
| VIS-07 | Phase 2 | Pending |
| VIS-08 | Phase 3 | Pending |
| AI-01 | Phase 4 | Pending |
| AI-02 | Phase 4 | Pending |
| AI-03 | Phase 5 | Pending |
| AI-04 | Phase 4 | Pending |
| DX-01 | Phase 5 | Pending |
| DX-02 | Phase 5 | Pending |
| DX-03 | Phase 5 | Pending |
| DX-04 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 26 total
- Mapped to phases: 26
- Unmapped: 0

---
*Requirements defined: 2026-03-25*
