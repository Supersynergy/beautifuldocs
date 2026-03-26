# BeautifulDocs Creator

## What This Is

A CLI tool + Claude Code skill that transforms Markdown/HTML into gorgeous PDFs, slide decks, one-pagers, lead magnets, pitch decks, and large multi-page editorial documents. Locally run, no cloud, no subscriptions. The best open-source alternative to Gamma.app, Beautiful.ai, Canva Slides, and Keynote — for developers, solo creators, and agencies who want beautiful documents from code.

## Core Value

**Any content → stunning document in seconds, locally, with infinite style flexibility.** Claude Code generates content + design dynamically; the CLI renders pixel-perfect PDFs. No template limitations — the system generates styles on-the-fly from 100+ design patterns.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Bun-based CLI that converts HTML templates → PDF via headless Chrome/Playwright
- [ ] Template engine with variable substitution (title, content sections, metadata)
- [ ] 4+ built-in style presets (Editorial Warm, Dark Executive, Clean Minimal, Neon Gradient)
- [ ] Dynamic style generation — Claude Code generates custom templates on-the-fly from user descriptions
- [ ] Multiple output formats: PDF (A4, Letter), Slides (16:9), One-Pager (A4 single)
- [ ] Symbol/icon library integration (Unicode, SVG, or embedded icon set)
- [ ] Gradient system with prebuilt palettes + custom gradient support
- [ ] Glassmorphism, glows, decorative orbs as composable design primitives
- [ ] Page-fill intelligence — content fills pages completely, no empty bottom halves
- [ ] Markdown → HTML → PDF pipeline (Markdown input with frontmatter for config)
- [ ] Claude Code skill `/beautifuldocs` that generates content + picks/creates template + renders
- [ ] Style prompt system — user describes desired look, system creates matching CSS
- [ ] Multi-page support with automatic page breaks, headers, footers, page numbers
- [ ] Table styling with multiple visual variants (minimal, striped, dark, glass)
- [ ] Typography system — font pairing presets (Serif+Sans, all-Sans, Mono-accent)
- [ ] Color palette system — 20+ curated palettes + custom palette builder
- [ ] Component library: cards, tags, progress bars, funnel diagrams, quote blocks, metric displays
- [ ] Animation support for HTML output (CSS animations, transitions, page transitions for browser viewing)
- [ ] fal.ai integration — AI-generated hero images, backgrounds, textures, illustrations per page/section
- [ ] OpenRouter connection — use best available model (Qwen, Claude, etc.) for content generation + style prompts
- [ ] Effect libraries: glassmorphism, neumorphism, aurora gradients, mesh gradients, noise textures, grain overlays
- [ ] Icon libraries: Lucide, Phosphor, or embedded SVG sprite — 1000+ icons available in templates
- [ ] Page transitions: slide, fade, morph effects for HTML output (CSS + View Transitions API)
- [ ] Gradient toolkit: linear, radial, conic, mesh gradients with 50+ prebuilt combos
- [ ] Decorative elements: orbs, blobs, geometric shapes, dividers, accent lines as composable CSS classes
- [ ] Background patterns: dots, grids, waves, topography, circuit — subtle texture options
- [ ] Plugin architecture for extending templates and components
- [ ] Batch processing — convert multiple documents at once
- [ ] Watch mode — auto-rebuild on file changes (live preview in browser)
- [ ] GitHub-ready — npm publishable, clean README with before/after examples

### Out of Scope

- Web app / SaaS — this is CLI-first, local-first
- Real-time collaboration — this is a single-user tool
- WYSIWYG editor — code/markdown is the input, not drag-and-drop
- PowerPoint/Keynote import — we generate, not convert
- Video output — PDFs and HTML only

## Context

Built from hands-on experience creating editorial PDFs during a Claude Code session (March 2026). Key learnings:
- Typst produces academic-looking output — not suitable for modern editorial design
- HTML→PDF via headless Chrome gives full CSS power (gradients, glassmorphism, backdrop-filter)
- Serif+Sans mixing creates editorial feel vs pure Sans = "AI dashboard" look
- Pages MUST be fully filled — empty bottom halves look unprofessional
- Warm color palettes (Plum, Coral, Peach, Sage) feel more human than neon Blue/Purple
- Dark+Light page alternation creates visual rhythm in multi-page docs
- `backdrop-filter` doesn't render in headless Chrome — need solid-color fallbacks

## Constraints

- **Runtime**: Bun (fast, modern, all-in-one)
- **PDF Engine**: Headless Chrome via Playwright (full CSS support, reliable rendering)
- **Templates**: Pure HTML/CSS — no React, no build step, just template literals
- **Styling**: CSS only — no Tailwind dependency in templates (self-contained)
- **Size**: CLI binary + templates should be < 10MB total
- **Dependencies**: Minimal — Bun + Playwright + markdown parser
- **Claude Code Skill**: Skill file at `~/.claude/skills/beautifuldocs/SKILL.md`

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| HTML→PDF over Typst | Typst too academic, HTML gives full design freedom | — Pending |
| Bun over Node/Rust | Fast, modern, built-in bundler, easy to ship | — Pending |
| Dynamic style generation | Users shouldn't be limited to prebuilt templates | — Pending |
| No Tailwind in templates | Templates must be self-contained, no build step | — Pending |
| Chrome over WeasyPrint | Full CSS support including gradients, animations | — Pending |

---
*Last updated: 2026-03-25 after initialization*
