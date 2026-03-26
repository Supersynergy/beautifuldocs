# Architecture Research Findings Summary

**Research Date:** 2026-03-25 | **Researched By:** Claude Agent | **Status:** Ready for Implementation

---

## Quick Answer

**How should BeautifulDocs CLI be architected?**

A modular Bun-based CLI with:
- **Template engine:** Eta + template literals (4x faster than Handlebars, 2.5KB vs 22KB)
- **Effect system:** CSS-based composable utilities (glassmorphism, gradients, patterns, animations)
- **Plugin architecture:** Hook-based (beforeParse, afterParse, beforeRender, afterRender, cssInject)
- **AI integration:** Server-side FAL.AI proxy (for security + caching)
- **Component library:** Atomic Design (atoms → molecules → organisms → templates)
- **Rendering:** Playwright + Headless Chrome (full CSS support, reliable PDF output)

**Build order:**
1. Core engine (parser → template → renderer)
2. Styling system (reset, typography, layout, theme)
3. AI integration (FAL.AI image generation)
4. Plugin system (extensibility)
5. Polish & distribution (CLI UX, docs, npm)

---

## Key Technical Decisions

### 1. Template Engine: Eta + Template Literals (NOT Handlebars)

**Why:**
- Eta is **7x faster** than Handlebars (proven benchmarks)
- **2.5KB gzipped** (Handlebars = 22KB)
- Template literals for simple built-in templates (zero overhead)
- Eta for complex user-provided templates (escaping, loops, conditionals)

**Trade-off:** No HTML auto-escaping by default with template literals (mitigated by validating user input)

---

### 2. CSS Architecture: Atomic Design + BEM

**Why:**
- Atoms → Molecules → Organisms → Templates → Pages (clear hierarchy)
- Modular, reusable components
- No Tailwind (templates must be self-contained)
- Pure CSS composition (no build step)

**Benefits:**
- Easy to extend with plugins (add new molecules/organisms)
- Predictable class names (.card, .card-header, .btn, .btn-primary)
- Self-documented components

---

### 3. Effect System: Pure CSS (No Dependencies)

**Why:**
- Glassmorphism, gradients, decorative shapes as CSS classes
- Composable: `.effect-glass`, `.gradient-aurora`, `.pattern-dots`
- No JavaScript runtime (faster, smaller)
- Works in headless Chrome (backdrop-filter has fallbacks)

**Key insight:** `backdrop-filter` doesn't render in headless Chrome → use solid-color fallbacks with CSS @supports

---

### 4. AI Integration: Server-Side FAL.AI Proxy (NOT Direct Client API)

**Why:**
- Never expose FAL_KEY to user's file system (security)
- Caching layer (don't regenerate same image twice)
- Fallback handling (solid color placeholder if timeout)
- Rate limiting + retry logic

**How it works:**
```
CLI → HTTP request → Server proxy → FAL.AI API → Image URL → Injected into HTML
```

**Fallback strategy:** If image generation times out (>60s), insert placeholder SVG with solid color

---

### 5. Plugin Architecture: Hook-Based (NOT Configuration-Based)

**Why:**
- Lifecycle hooks (beforeParse, afterParse, beforeRender, afterRender)
- CSS injection hooks (cssInject)
- Component registration hooks (componentRegister)
- No rewrite needed if plugins added later

**Implementation:**
- ES Module dynamic imports (native, no overhead)
- Plugin interface: `{ name, version, hooks: { hookName: async (ctx) => ctx } }`
- Hook emitter: Iterate plugins, call matching hooks, merge results

---

### 6. Renderer: Playwright + Headless Chrome (NOT WeasyPrint or Typst)

**Why:**
- Full CSS support (gradients, animations, glassmorphism with fallbacks)
- Reliable PDF output (used by industry leaders)
- Screenshots + HTML export options (same codebase)

**Constraints:**
- `backdrop-filter` doesn't work (mitigated with solid-color fallbacks)
- 2-5s per page (acceptable for most use cases)
- Requires Chromium (~300MB, pre-installed with Playwright)

---

## Data Flow Summary

```
Input (Markdown + frontmatter)
  ↓
[Parse] Extract title, theme, effects, ai_images
  ↓
[Resolve Template] Load editorial/slides/one-pager template
  ↓
[Generate Styles] Theme palette + effect CSS + component library
  ↓
[Generate Icons] Lucide → inline SVG
  ↓
[Queue AI Images] Extract image prompts, call server proxy
  ↓
[Plugin Hooks] beforeRender, cssInject (modify HTML + CSS)
  ↓
[Render Template] Inject data + styles into template
  ↓
[Optimize Pages] Add page breaks, headers, footers, full-page fill
  ↓
[Playwright → PDF] Headless Chrome prints HTML to PDF
  ↓
Output (PDF / HTML / PNG)
```

---

## Component Structure

```
CLI Entry Point
  ├─ Parser (Markdown → AST)
  ├─ Template Engine (select + render)
  ├─ Style Generator (theme + effects + components)
  ├─ Icon System (resolve + inline)
  ├─ AI Integration (FAL.AI image queue)
  ├─ Plugin System (load + emit hooks)
  └─ Renderer (Playwright → PDF)
```

---

## File Organization

**Core:**
- `src/cli.ts` — CLI entry point
- `src/core/parser/` — Markdown parsing
- `src/core/template-engine/` — Template resolution + rendering
- `src/core/style-generator/` — CSS generation
- `src/core/icon-system/` — Icon resolution
- `src/core/ai-integration/` — FAL.AI server proxy
- `src/core/renderer/` — Playwright wrapper
- `src/core/plugin-system/` — Plugin loader + hooks

**Built-in Assets:**
- `src/templates/` — Editorial, slides, one-pager templates
- `src/effects/` — Glassmorphism, gradients, patterns
- `src/themes/` — warm-plum, dark-executive, clean-minimal, neon-gradient

**Tests & Docs:**
- `tests/` — Unit + E2E tests
- `docs/` — Template guide, plugin guide, API reference
- `examples/` — Sample markdown files, custom plugins

---

## Build Order & Timeline

| Phase | Focus | Duration | Deliverable |
|-------|-------|----------|-------------|
| **Phase 1** | Core engine | 1-2 weeks | `beautifdocs build input.md → output.pdf` |
| **Phase 2** | Styling system | 1-2 weeks | Themes + effects + component library |
| **Phase 3** | AI integration | 3-5 days | FAL.AI image generation working |
| **Phase 4** | Plugin system | 3-5 days | Hook architecture + ES module loading |
| **Phase 5** | Polish & release | 1 week | CLI UX, docs, npm publish, binary build |

**Total:** ~4-5 weeks for production-ready v1.0

---

## Dependencies (Minimal)

```
Production:
  - markdown-it (Markdown parser)
  - gray-matter (Frontmatter extraction)
  - eta (Template engine, fallback)
  - playwright (Headless Chrome)
  - @fal-ai/client (Image generation API)

Dev:
  - typescript
  - vitest
  - @types/node
```

**Total bundled size:** ~80KB (with tree-shaking), Playwright pre-installed separately

---

## Gotchas & Workarounds

| Problem | Solution |
|---------|----------|
| `backdrop-filter` not rendering in headless Chrome | Use `@supports` CSS with solid color fallback |
| Empty page bottoms look unprofessional | Implement page-fill logic (expand margins/padding) |
| FAL.AI image generation slow (15-30s) | Async queuing, caching, solid color fallback on timeout |
| Plugin isolation / security | Don't allow shell execution, validate input, sandboxing for future |
| CSS purging removing dynamic classes | Whitelist component class names, don't purge if plugins active |
| Template literals can't escape HTML | Validate user input, use Eta for untrusted templates |

---

## Performance Targets

| Operation | Time | Notes |
|-----------|------|-------|
| Parse markdown | <100ms | markdown-it is fast |
| Generate styles | <50ms | Just string concatenation |
| Render template | <200ms | Template literal or Eta compiled |
| Generate AI image | 15-30s | Async, cacheable |
| Render to PDF (per page) | 2-5s | Playwright overhead |
| **Full 10-page doc (cached)** | <5s | Parallel image generation |
| **Full 10-page doc (new images)** | ~40-60s | Dominated by FAL.AI |

---

## Next Steps

1. **Setup Bun project**
   - Create `bunfig.toml`, `tsconfig.json`
   - Install dependencies
   - Set up test runner (Vitest)

2. **Implement Phase 1 (Core Engine)**
   - Markdown parser (markdown-it)
   - Frontmatter extraction (gray-matter)
   - Simple template literal renderer
   - Playwright PDF rendering
   - E2E test: `example.md` → `output.pdf`

3. **Validate core pipeline**
   - Test with sample Markdown files
   - Compare PDF output quality
   - Benchmark performance

4. **Continue with Phase 2 (Styling)**
   - Build CSS component library (atomic design)
   - Implement theme system
   - Add effect utilities

5. **Later: AI + Plugins**
   - Integrate FAL.AI server proxy
   - Build plugin loader
   - Write comprehensive docs

---

**Architecture Document:** `/Users/master/Projekte/pulsepress/.planning/research/ARCHITECTURE.md`

Full details available in ARCHITECTURE.md (13 sections, comprehensive)
