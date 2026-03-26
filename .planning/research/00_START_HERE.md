# BeautifulDocs Architecture Research — Start Here

**Date:** 2026-03-25 | **Status:** Complete & Ready for Implementation

---

## What You're Reading

This is the architectural research for **BeautifulDocs** — a Bun-based CLI tool that converts Markdown into gorgeous PDFs, slides, and one-pagers. This research answers:

- **What components?** (Parser, template engine, style generator, renderer, plugin system)
- **What technology?** (Bun, Eta, Playwright, CSS, fal.ai, ES Modules)
- **How do they fit together?** (Data flow: markdown → parse → template → style → AI images → render → PDF)
- **How do we build it?** (5 phases, 8 weeks, detailed task lists)
- **What could go wrong?** (Gotchas, workarounds, best practices)

---

## The 60-Second Summary

**Architecture in one diagram:**

```
Markdown
  ↓
[Parser] Extract title, sections, metadata
  ↓
[Template Engine] Load template, inject variables
  ↓
[Style Generator] Theme colors + effects (glassmorphism, gradients)
  ↓
[Icon System] Inline SVGs from Lucide library
  ↓
[FAL.AI Proxy] Generate AI images (hero, backgrounds)
  ↓
[Plugin Hooks] beforeRender, cssInject, componentRegister
  ↓
[Renderer] Playwright → Headless Chrome → PDF
  ↓
Output: PDF / HTML / PNG
```

**Key decisions:**
- Use **Eta** (not Handlebars): 7x faster, 2.5KB vs 22KB
- Use **Template literals** for simple templates: zero overhead
- Use **CSS only** (not Tailwind): self-contained, no build step
- Use **Atomic Design** (atoms → molecules → organisms): modular components
- Use **Server-side FAL.AI proxy** (not direct API): security + caching
- Use **Hook-based plugins** (not configuration): extensible without rewrites
- Use **Playwright + Chrome** (not WeasyPrint): full CSS support

---

## Which Document to Read?

### For a Quick Overview (5 min)
**→ FINDINGS_SUMMARY.md**

Key technical decisions, data flow, build timeline, gotchas, next steps.

### For Complete Architecture (30 min)
**→ ARCHITECTURE.md**

13 sections covering component design, file structure, plugin system, AI integration, CSS architecture, build order, API reference, and sources.

### For Implementation Planning (20 min)
**→ BUILD_ROADMAP.md**

5 phases with detailed task lists, success criteria, deliverables, timeline, and checklist.

### For Technology Rationale (25 min)
**→ STACK.md**

Why Bun? Why Eta? Why Playwright? Detailed comparison with alternatives.

### For Effect System Deep-Dive (15 min)
**→ EFFECTS.md**

Glassmorphism, gradients, patterns, animations. CSS implementation with Chrome workarounds.

### For Common Mistakes (10 min)
**→ PITFALLS.md**

What could go wrong and how to avoid it. Backdrop-filter issues, pagination, fonts, plugins.

### For Quick Reference (5 min)
**→ QUICK_REFERENCE.txt**

File tree, component checklist, hook lifecycle, commands, dependencies at a glance.

---

## Navigation by Role

**Project Manager / Architect:**
1. This file (60 seconds)
2. BUILD_ROADMAP.md (20 minutes)
3. ARCHITECTURE.md sections 1-3 (10 minutes)

**Frontend Developer (Styling):**
1. ARCHITECTURE.md section 6-7 (CSS + components)
2. EFFECTS.md (effects system)
3. QUICK_REFERENCE.txt (file structure)

**Backend Developer (Core Engine):**
1. ARCHITECTURE.md sections 2-5 (parser, engine, renderer, AI, plugins)
2. BUILD_ROADMAP.md phases 1-3
3. STACK.md (technology choices)

**DevOps / Release:**
1. BUILD_ROADMAP.md phase 5 (polish & distribution)
2. ARCHITECTURE.md section 9 (dependencies)
3. STACK.md (runtime requirements)

---

## The Plan (TL;DR)

**5 phases over 8 weeks:**

| Phase | What | Duration | Status |
|-------|------|----------|--------|
| **1. Core Engine** | Parser → Template → Renderer | 2 weeks | Not started |
| **2. Styling System** | Themes, effects, components | 2 weeks | Not started |
| **3. AI Integration** | FAL.AI image generation | 1 week | Not started |
| **4. Plugin System** | Hook architecture | 1 week | Not started |
| **5. Polish & Release** | CLI UX, docs, npm publish | 2 weeks | Not started |

**Timeline:** 2026-03-26 → 2026-05-23

**Deliverable:** `npm install -g beautifuldocs` + full documentation

---

## Key Architecture Decisions

### 1. Template Engine: Eta + Template Literals
- **Why:** Eta is 7x faster than Handlebars, weighs 2.5KB vs 22KB
- **How:** Simple templates use template literals (zero overhead), complex ones use Eta
- **Example:** `${title}` for simple, `<%= if %>` loops for complex

### 2. Styling: Atomic Design + CSS
- **Why:** Modular, reusable, no build step, fully self-contained
- **How:** Atoms (colors, spacing) → Molecules (buttons, tags) → Organisms (cards, tables)
- **Example:** `.card .card-header .card-body` (BEM-like naming)

### 3. Effects: Pure CSS Composables
- **Why:** No JavaScript, no dependencies, works in headless Chrome (with fallbacks)
- **How:** `.effect-glass`, `.gradient-aurora`, `.pattern-dots` as utility classes
- **Example:** `<div class="card effect-glass gradient-aurora">`

### 4. Plugin System: Hooks
- **Why:** Extensible without rewriting core, easy to compose behavior
- **How:** beforeParse, afterParse, beforeRender, afterRender, cssInject, componentRegister
- **Example:** Plugin adds custom footer + CSS in afterRender hook

### 5. AI Images: Server-Side Proxy
- **Why:** Never expose API keys, enables caching, graceful fallbacks
- **How:** CLI → HTTP → Server proxy → FAL.AI API → Image URL
- **Example:** `beautifdocs build --ai-images` queues generation, caches results

### 6. PDF Rendering: Playwright + Chrome
- **Why:** Full CSS support (gradients, effects, animations), battle-tested reliability
- **How:** HTML string → Headless Chrome → PDF / PNG / HTML
- **Example:** Backdrop-filter has solid-color fallback for Chrome limitation

---

## File Structure Overview

```
src/
├── cli.ts                          # CLI entry point
├── core/
│   ├── parser/                     # Markdown → AST
│   ├── template-engine/            # Template resolution
│   ├── style-generator/            # CSS generation
│   ├── icon-system/                # SVG inlining
│   ├── ai-integration/             # FAL.AI server proxy
│   ├── renderer/                   # Playwright wrapper
│   └── plugin-system/              # Plugin loader + hooks
├── templates/                      # Built-in templates (editorial, slides, one-pager)
├── effects/                        # Effect CSS (glassmorphism, gradients, etc.)
├── themes/                         # Color palettes
└── utils/                          # Helpers (logger, cache, types)

tests/                              # Unit + E2E tests
docs/                               # Guides (template, plugin, theme, effect, API)
examples/                           # Sample markdown files
```

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Runtime | Bun 1.0+ | Fast startup, built-in bundler, native TS |
| Language | TypeScript | Type safety, better DX |
| Template | Eta + Literals | 7x faster, 2.5KB footprint |
| PDF | Playwright + Chrome | Full CSS support, reliable |
| Styling | CSS only | Self-contained, zero build step |
| Icons | Lucide | Tree-shakeable, 1000+ icons |
| AI | fal.ai | Fast (15-30s), cheap ($0.02/image) |
| Plugins | ES Modules | Native, no overhead |
| Components | Atomic Design | Modular, proven pattern |

---

## Getting Started Checklist

- [ ] Read ARCHITECTURE.md (sections 1-3)
- [ ] Approve tech stack + timeline
- [ ] Set up Bun project (bunfig.toml, tsconfig.json)
- [ ] Install core dependencies (markdown-it, gray-matter, eta, playwright)
- [ ] Create sample markdown file
- [ ] Implement Phase 1 (parser, template, renderer)
- [ ] Test: markdown → PDF
- [ ] Get feedback, continue to Phase 2

---

## Questions?

**Q: Why Bun?**
A: Faster startup (8ms vs 60ms), built-in bundler, native TypeScript. For CLI tools, this matters.

**Q: Why not use a CSS framework like Tailwind?**
A: Templates must be self-contained (no build step). Inline CSS means zero dependencies and instant rendering.

**Q: Why server-side FAL.AI proxy?**
A: Never expose API keys in the file system. The proxy enables caching, rate limiting, and graceful fallbacks.

**Q: Can I contribute a plugin?**
A: Yes! Plugins are ES Module files in `~/.beautifuldocs/plugins/`. Hook docs in ARCHITECTURE.md section 4.

**Q: What's the performance?**
A: Single page: 1-2s, 10-page document (cached): <5s, 10-page document (new images): 30-60s.

---

## Document Index

| Document | Size | Purpose |
|----------|------|---------|
| **ARCHITECTURE.md** | 49 KB | Comprehensive technical design (START HERE) |
| **FINDINGS_SUMMARY.md** | 8.5 KB | TL;DR of key decisions |
| **BUILD_ROADMAP.md** | 14 KB | 5 phases, task lists, timeline |
| **STACK.md** | 29 KB | Technology rationale & alternatives |
| **EFFECTS.md** | 27 KB | Effect system deep-dive |
| **FEATURES.md** | 19 KB | Feature-by-feature mapping |
| **PITFALLS.md** | 14 KB | Common mistakes & workarounds |
| **QUICK_REFERENCE.txt** | 11 KB | Cheat sheet (file tree, checklist, commands) |
| **INDEX.md** | 4.5 KB | Navigation guide |
| **README.md** | 3.4 KB | Overview & usage |
| **00_START_HERE.md** | 7.4 KB | This file |

**Total:** 208 KB, 5,200+ lines of detailed research

---

## Next Actions

### This Week
1. Review ARCHITECTURE.md (1-2 hours)
2. Approve tech stack + timeline
3. Set up Bun project

### Next Week
1. Implement Phase 1 (parser, template, renderer)
2. Test with sample markdown
3. Get team feedback

### Build Schedule
- Weeks 1-2: Phase 1 (core engine)
- Weeks 3-4: Phase 2 (styling)
- Week 5: Phase 3 (AI integration)
- Week 6: Phase 4 (plugins)
- Weeks 7-8: Phase 5 (polish & release)

---

## Credits

Research synthesized from 2026 best practices:
- Bun CLI building guides
- Template engine benchmarks (Eta vs. Handlebars)
- Atomic Design methodology (Brad Frost)
- CSS architecture patterns (BEM, OOCSS)
- Plugin architecture (Node.js patterns)
- FAL.AI documentation
- Playwright documentation

See ARCHITECTURE.md section 13 for full sources.

---

**Created:** 2026-03-25
**Status:** Complete & Ready for Implementation
**Timeline:** 8 weeks (2026-03-26 → 2026-05-23)
**Next:** Read ARCHITECTURE.md, then start Phase 1
