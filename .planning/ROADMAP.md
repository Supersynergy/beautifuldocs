# Roadmap: BeautifulDocs Creator

**Created:** 2026-03-25
**Milestone:** v1.0
**Phases:** 5
**Requirements:** 26 mapped

## Phase Overview

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Core Engine | Markdown → PDF pipeline works end-to-end | CORE-01..04 | CLI produces valid PDF from .md file |
| 2 | Visual System & Templates | Beautiful templates with full effect library | TMPL-01..06, VIS-01..07 | 4 templates produce stunning PDFs with icons, gradients, effects |
| 3 | DX & Polish | Watch mode, batch, plugins, transitions | CORE-05..06, VIS-08, DX-04 | Live preview works, plugins load, transitions animate |
| 4 | AI Integration | fal.ai images, OpenRouter content, dynamic styles | AI-01..02, AI-04, TMPL-03 | AI generates images + content + custom styles |
| 5 | Skill & Distribution | Claude Code skill, npm package, README | AI-03, DX-01..03 | /beautifuldocs produces PDF, npm install works |

## Phase Details

### Phase 1: Core Engine
**Goal:** Build the Markdown → HTML → PDF pipeline with Bun CLI
**Requirements:** CORE-01, CORE-02, CORE-03, CORE-04
**Success Criteria:**
1. `beautifuldocs build input.md` produces a valid multi-page PDF
2. Frontmatter parsed correctly (title, template, palette, format)
3. Markdown with tables, code blocks, images renders correctly
4. PDF opens in Preview.app without errors
5. A4 and 16:9 format options work

### Phase 2: Visual System & Templates
**Goal:** Build the template engine, 4 presets, component library, effects, icons, gradients
**Requirements:** TMPL-01..06, VIS-01..07
**Success Criteria:**
1. Editorial Warm template produces magazine-quality PDF
2. Dark Executive template produces pitch-deck quality PDF
3. Clean Minimal template produces Swiss-design quality PDF
4. Neon Gradient template produces modern SaaS-style PDF
5. Components (cards, tags, tables, quotes, metrics) render in all templates
6. Lucide icons render inline in documents
7. Gradient classes apply correctly (50+ prebuilt)
8. Pages fill completely — no half-empty pages

### Phase 3: DX & Polish
**Goal:** Add watch mode, batch processing, plugin system, transitions
**Requirements:** CORE-05, CORE-06, VIS-08, DX-04
**Success Criteria:**
1. Watch mode auto-rebuilds on file save, serves HTML at localhost
2. Batch mode converts directory of .md files to PDFs
3. Plugin directory loads custom templates/components
4. HTML output has CSS page transitions (View Transitions API)

### Phase 4: AI Integration
**Goal:** Connect fal.ai for images, OpenRouter for content, dynamic style generation
**Requirements:** AI-01, AI-02, AI-04, TMPL-03
**Success Criteria:**
1. fal.ai generates hero images/backgrounds on demand (API key in env)
2. OpenRouter generates document content from topic description
3. Style prompt in frontmatter creates matching CSS automatically
4. Generated images integrate seamlessly into templates

### Phase 5: Skill & Distribution
**Goal:** Claude Code skill, npm package, documentation with examples
**Requirements:** AI-03, DX-01, DX-02, DX-03
**Success Criteria:**
1. `/beautifuldocs "topic"` in Claude Code generates complete PDF
2. `npx beautifuldocs init` scaffolds new project
3. README has before/after screenshots, clear install instructions
4. Package published to npm (or ready to publish)

---
*Roadmap created: 2026-03-25*
