# BeautifulDocs Build Roadmap

**Status:** Planning Phase | **Target:** v1.0 Production | **Runtime:** Bun 1.0+

---

## Phase 1: Core Engine (Weeks 1-2)

### Goal
Get markdown → PDF working with basic template system and no dependencies on styling.

### Tasks

**Parser** (src/core/parser/)
- [ ] Integrate `markdown-it` for parsing
- [ ] Extract frontmatter with `gray-matter`
- [ ] Build Document AST: { title, sections, metadata }
- [ ] Validate required fields (title, format)
- [ ] Test: parse example.md → Document object

**Template Engine** (src/core/template-engine/)
- [ ] Create template interface: `{ render(data) → Promise<string> }`
- [ ] Implement template literal renderer (simple case)
- [ ] Implement Eta compiler (complex case, fallback)
- [ ] Add template loader (built-in templates from disk)
- [ ] Test: render template with sample data

**Minimal Template** (src/templates/editorial/basic.ts)
- [ ] Create simple HTML template (just title + content)
- [ ] Inline basic CSS (reset.css equivalent)
- [ ] No theme system yet, no effects

**Renderer** (src/core/renderer/)
- [ ] Wrap Playwright API
- [ ] HTML string → PDF via headless Chrome
- [ ] HTML string → PNG (screenshot)
- [ ] HTML string → HTML file (save to disk)
- [ ] Add page size options (A4, Letter)
- [ ] Test: render HTML → PDF

**CLI Entry** (src/cli.ts)
- [ ] Parse command line args (input, output, format)
- [ ] Wire up: parse → template → render
- [ ] Basic error handling
- [ ] Success/error messages
- [ ] Test: `beautifdocs build example.md --output out.pdf`

**Test Suite**
- [ ] Unit: parser, template engine, renderer
- [ ] E2E: markdown → PDF (compare file exists + size)

### Deliverable
```bash
beautifdocs build input.md --output output.pdf
# Creates: output.pdf (basic, no styling yet)
```

### Success Criteria
- [ ] 5-page test document → PDF (2-3 MB)
- [ ] No crashes on edge cases
- [ ] Build time < 10s (excluding Playwright startup)
- [ ] CLI shows clear progress/errors

---

## Phase 2: Styling System (Weeks 3-4)

### Goal
Build CSS component library, theme system, and effect utilities.

### Tasks

**CSS Architecture** (src/core/style-generator/)
- [ ] Create reset.css (normalize, box-sizing, margins)
- [ ] Create typography.css (font stacks, sizes, line-heights)
- [ ] Create layout.css (grid, flex, spacing utilities)
- [ ] CSS variable system for theme colors
- [ ] Test: CSS loads without errors

**Component Library** (src/templates/components/)
- [ ] **Atoms:** colors.css, spacing.css, typography.css, borders.css
- [ ] **Molecules:** button.css, tag.css, badge.css, input.css, icon.css
- [ ] **Organisms:** card.css, header.css, footer.css, table.css, form.css
  - card: .card, .card-header, .card-body, .card-footer
  - table: .table, .table-header, .table-row, .table-cell
  - quote-block: .quote-block, .quote-text, .quote-attribution
  - metric: .metric, .metric-value, .metric-label
  - funnel: .funnel, .funnel-stage
  - divider: .divider, .divider-text
- [ ] Document class naming convention (BEM-like)
- [ ] Test: render all components (component.html demo)

**Theme System** (src/themes/)
- [ ] Implement theme interface: `{ name, colors: { primary, secondary, accent, text }, css: string }`
- [ ] Create 4 built-in themes:
  - `warm-plum` (Plum #8B5A8C, Coral #D4A574, Peach #E8C8B8)
  - `dark-executive` (Navy #1a2847, Gold #d4af37)
  - `clean-minimal` (Neutral grays, single accent)
  - `neon-gradient` (Neon colors)
- [ ] Theme loader (select by name)
- [ ] CSS variable injection for colors
- [ ] Test: render same document in all 4 themes

**Effect System** (src/effects/)
- [ ] Glassmorphism: `.effect-glass`, `.effect-glass-light`
- [ ] Gradients: `.gradient-aurora`, `.gradient-mesh`, `.gradient-linear`
- [ ] Decorative: `.orb`, `.blob`, `.geometric`
- [ ] Patterns: `.pattern-dots`, `.pattern-waves`, `.pattern-grid`
- [ ] Animations: aurora, mesh, floating (CSS @keyframes)
- [ ] CSS @supports fallbacks (no backdrop-filter in headless Chrome)
- [ ] Test: each effect renders without errors

**Icon System** (src/core/icon-system/)
- [ ] Integrate Lucide SVG library (tree-shakeable)
- [ ] Icon resolver: name → SVG data
- [ ] SVG inline as data-uri or `<svg>` tag
- [ ] Icon colorization via CSS variables
- [ ] Fallback to Unicode symbols
- [ ] Test: render icons in various sizes/colors

**Template Updates**
- [ ] Update editorial template with theme injection
- [ ] Update editorial template with effect support
- [ ] Add frontmatter options: theme, effects (array)
- [ ] Multi-page support: detect page breaks
- [ ] Header/footer injection
- [ ] Page numbers

**CLI Updates**
- [ ] Add `--theme warm-plum` option
- [ ] Add `--effects glassmorphism,aurora` option
- [ ] Add `--format editorial|slides|one-pager`
- [ ] List command: `beautifdocs list themes`
- [ ] List command: `beautifdocs list effects`
- [ ] List command: `beautifdocs list templates`

### Deliverable
```bash
beautifdocs build input.md --theme warm-plum --effects glassmorphism,aurora
# Creates: output.pdf with theme + effects applied
```

### Success Criteria
- [ ] All 4 themes render without errors
- [ ] 5-page document with glassmorphism + aurora effects
- [ ] Page numbers + headers working
- [ ] Icons inline correctly (colored, sized)
- [ ] No CSS errors in browser console
- [ ] Visual test: compare PDF screenshots across themes

---

## Phase 3: AI Integration (Weeks 4-5)

### Goal
Integrate FAL.AI image generation for hero images and section backgrounds.

### Tasks

**FAL.AI Server Proxy** (src/core/ai-integration/)
- [ ] Create Bun HTTP server (port 3001)
- [ ] Endpoint: `POST /api/generate-image { prompt, model }`
- [ ] Call fal.ai API: `fal.subscribe("fal-ai/flux/dev", { input: { prompt } })`
- [ ] Polling loop with timeout (60s max)
- [ ] Caching layer: `~/.beautifuldocs/cache/images/`
  - [ ] Hash prompt + model → cache key (SHA256)
  - [ ] Store: { prompt, model, url, timestamp }
- [ ] Fallback: return placeholder SVG on timeout
- [ ] Test: generate image, verify cache

**Image Queue System** (src/core/ai-integration/)
- [ ] Extract image prompts from markdown: `[AIImage: {prompt: "..."}]`
- [ ] Build queue: `{ section_id, prompt, model }`
- [ ] Parallel requests (up to 3 concurrent)
- [ ] Progress indicator (X of Y images generated)
- [ ] Test: queue 10 images, generate in parallel

**CLI Integration**
- [ ] Add `--ai-images` flag
- [ ] Add `--ai-model fal-ai/flux/dev` option
- [ ] Extract FAL_KEY from environment
- [ ] Start/stop server automatically
- [ ] Display generation progress
- [ ] Inject image URLs into HTML

**Markdown Support**
- [ ] Parse `[AIImage: {prompt: "...", model: "fal-ai/flux/dev"}]`
- [ ] Convert to HTML: `<img src="..." alt="generated">`
- [ ] Apply CSS: aspect-ratio, object-fit, shadows
- [ ] Fallback image if generation fails

**Template Updates**
- [ ] Add hero image section support
- [ ] Add section background images
- [ ] Image sizing: full-width, half-width, contained
- [ ] Image styling: shadows, borders, overlays

### Deliverable
```bash
beautifdocs build input.md --ai-images --ai-model fal-ai/flux/dev
# Generates hero images from markdown, injects into PDF
```

### Success Criteria
- [ ] Image generation completes (15-30s per image)
- [ ] Images cached correctly
- [ ] Cache hits reuse local files (instant)
- [ ] Placeholder SVG appears on timeout
- [ ] Images render in PDF (not just HTML)
- [ ] Cost tracking: log images generated + cost

---

## Phase 4: Plugin System (Week 5-6)

### Goal
Enable extensibility via hook-based plugin architecture.

### Tasks

**Plugin Architecture** (src/core/plugin-system/)
- [ ] Define plugin interface: `{ name, version, hooks }`
- [ ] Hook types: beforeParse, afterParse, beforeRender, afterRender, cssInject, componentRegister
- [ ] Hook registry: store all hook functions
- [ ] Hook emitter: call all plugins for each hook
- [ ] Plugin loader: dynamic ES module imports from `~/.beautifuldocs/plugins/`
- [ ] Test: load mock plugin, emit hooks, verify order

**Plugin Loader** (src/core/plugin-system/loader.ts)
- [ ] List plugins in directory
- [ ] Load with `import()`
- [ ] Validate plugin structure
- [ ] Error handling (skip invalid plugins with warning)
- [ ] Display loaded plugins on startup
- [ ] Test: load 3 test plugins

**Hook Integration**
- [ ] Hook: `beforeParse` (modify raw markdown)
- [ ] Hook: `afterParse` (modify Document object)
- [ ] Hook: `beforeRender` (modify HTML before rendering)
- [ ] Hook: `afterRender` (modify rendered HTML)
- [ ] Hook: `cssInject` (inject custom CSS)
- [ ] Hook: `componentRegister` (register custom components)
- [ ] Test: plugin modifies document, CSS, HTML at each hook

**Example Plugin**
- [ ] Create `analytics-footer.ts` example
- [ ] Plugin adds footer with page numbers
- [ ] Plugin injects custom CSS
- [ ] Documented in `docs/PLUGIN_GUIDE.md`

**CLI Integration**
- [ ] Load plugins from `~/.beautifuldocs/plugins/`
- [ ] List plugins: `beautifdocs list plugins`
- [ ] Display plugin info on startup (name, version, active hooks)

### Deliverable
```bash
# User creates ~/.beautifuldocs/plugins/my-plugin.ts
beautifdocs build input.md
# Loads my-plugin.ts automatically, runs hooks
```

### Success Criteria
- [ ] Plugin system loads without errors
- [ ] Multiple plugins can coexist
- [ ] Hook execution order is correct
- [ ] Plugin can modify HTML and CSS
- [ ] Error in one plugin doesn't crash system
- [ ] Example plugin (analytics footer) works

---

## Phase 5: Advanced Features & Polish (Weeks 6-7)

### Goal
Complete feature set, CLI polish, documentation, and npm publication.

### Tasks

**Advanced Templates**
- [ ] Slides: 16:9 template (title + content slides)
- [ ] Slides: 4:3 template (alternative aspect ratio)
- [ ] One-pager: single A4 layout
- [ ] Custom templates: user can provide HTML file
- [ ] Template validation: required variables

**Page Optimization** (src/core/renderer/page-optimizer.ts)
- [ ] Multi-page detection (content height > page height)
- [ ] Insert `<div class="page-break">` automatically
- [ ] Alternate page backgrounds (light ↔ dark) for visual rhythm
- [ ] Full-page fill: expand margins/padding if content < page
- [ ] Compress line-height/margins if content > page
- [ ] Keep content together (avoid orphans/widows)
- [ ] Test: 20-page document auto-pagination

**Batch Processing** (src/cli.ts)
- [ ] `beautifdocs build *.md` → convert multiple files
- [ ] Parallel processing (up to 4 concurrent)
- [ ] Progress bar (X of Y files)
- [ ] Summary: total time, total size, errors

**Watch Mode** (src/cli.ts)
- [ ] `beautifdocs watch . --output output/`
- [ ] Rebuild on file change
- [ ] Live preview in browser (optional)
- [ ] Clear build artifacts on exit

**CLI Polish**
- [ ] Colored output (success = green, error = red)
- [ ] Progress indicators (spinner, percentage)
- [ ] Clear help text: `beautifdocs --help`
- [ ] Version command: `beautifdocs --version`
- [ ] Config file support (`.beautifdocs.json`)
- [ ] Environment variables (.env file)

**Documentation**
- [ ] README.md (overview, install, quick start, features)
- [ ] docs/TEMPLATE_GUIDE.md (how to write templates)
- [ ] docs/PLUGIN_GUIDE.md (how to write plugins)
- [ ] docs/THEME_GUIDE.md (how to create themes)
- [ ] docs/EFFECT_GUIDE.md (available effects + usage)
- [ ] docs/API.md (programmatic API)
- [ ] docs/EXAMPLES.md (before/after samples)

**Testing** (tests/)
- [ ] Unit tests: parser, template engine, renderer
- [ ] Integration tests: full pipeline
- [ ] E2E tests: CLI commands
- [ ] Visual regression: compare PDF screenshots
- [ ] Performance: benchmark build times

**Distribution**
- [ ] Bun bundler config: compile to single executable
- [ ] npm package.json setup
- [ ] GitHub Actions CI/CD (test on push)
- [ ] Release workflow: version bump, changelog, npm publish
- [ ] GitHub releases (download binary)

**Optional: Docker**
- [ ] Dockerfile (if needed for deployment)
- [ ] docker-compose.yml (with FAL.AI proxy)

### Deliverable
```bash
npm install -g @beautifuldocs/cli
beautifdocs --help
beautifdocs build examples/*.md --watch --output docs/
# Production-ready CLI with full documentation
```

### Success Criteria
- [ ] npm package published and installable
- [ ] CLI commands work as documented
- [ ] All tests passing (>80% coverage)
- [ ] Documentation complete and clear
- [ ] GitHub releases available (binary download)
- [ ] Positive user feedback (early beta)

---

## v1.0 Release Checklist

- [ ] All 5 phases complete
- [ ] >80% test coverage
- [ ] All documentation finished
- [ ] npm package published
- [ ] GitHub releases available
- [ ] No critical bugs
- [ ] Performance targets met
- [ ] 10+ example documents
- [ ] Quick start guide working
- [ ] Community feedback incorporated (if any)

---

## Timeline Summary

| Phase | Duration | Start | End | Status |
|-------|----------|-------|-----|--------|
| Phase 1 (Core) | 2 weeks | 2026-03-26 | 2026-04-09 | Not started |
| Phase 2 (Styling) | 2 weeks | 2026-04-10 | 2026-04-23 | Not started |
| Phase 3 (AI) | 1 week | 2026-04-24 | 2026-05-01 | Not started |
| Phase 4 (Plugins) | 1 week | 2026-05-02 | 2026-05-09 | Not started |
| Phase 5 (Polish) | 2 weeks | 2026-05-10 | 2026-05-23 | Not started |
| **Total** | **8 weeks** | **2026-03-26** | **2026-05-23** | **Ready to start** |

---

## Dependencies Installed (Per Phase)

**Phase 1:**
```json
{
  "markdown-it": "^14.0.0",
  "gray-matter": "^4.1.0",
  "eta": "^2.0.1",
  "playwright": "^1.48.0"
}
```

**Phase 3:**
```json
{
  "@fal-ai/client": "^1.0.0"
}
```

**Phase 5:**
```json
{
  "commander": "^12.0.0",
  "chalk": "^5.0.0"
}
```

**Dev:**
```json
{
  "typescript": "^5.3.0",
  "vitest": "^1.0.0",
  "@types/node": "^20.0.0",
  "bun": ">=1.0.0"
}
```

---

## Key Success Metrics

1. **Build Time:** <5s for 10-page document (cached)
2. **PDF Size:** <5MB for typical document
3. **CLI Size:** <100KB (bundled)
4. **Test Coverage:** >80%
5. **User Satisfaction:** Easy to use, good docs
6. **Performance:** Render 100 documents/day on single machine

---

**Last Updated:** 2026-03-25
**Author:** Architecture Research
**Status:** Ready for Phase 1 implementation
