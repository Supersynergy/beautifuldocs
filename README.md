# BeautifulDocs

**Beautiful PDFs, slides & documents from Markdown.** CLI-first, AI-powered, stunning design.

The local, open-source alternative to Gamma.app, Beautiful.ai, and Canva Slides.

```bash
# Install
bun add beautifuldocs

# Generate a stunning PDF
beautifuldocs build my-report.md --template editorial-warm

# Live preview in browser
beautifuldocs watch my-report.md

# AI-powered: describe what you want
beautifuldocs create "quarterly business report" --style "dark executive, gradient accents"
```

## Why BeautifulDocs?

| | Gamma.app | Beautiful.ai | Canva | **BeautifulDocs** |
|---|-----------|-------------|-------|-------------------|
| **Local/Offline** | No | No | No | **Yes** |
| **Free** | Limited | $12/mo | $13/mo | **Free forever** |
| **CLI/Code** | No | No | No | **Yes** |
| **Custom CSS** | No | No | Limited | **Full control** |
| **AI Images** | Yes | Yes | Yes | **Yes (fal.ai)** |
| **Open Source** | No | No | No | **Yes (MIT)** |

## Templates

### Editorial Warm
Serif + Sans mix, warm colors (Plum, Coral, Peach, Sage). Magazine-quality editorial feel.

### Dark Executive
Deep backgrounds, gradient accents, glowing elements. Perfect for pitch decks.

### Clean Minimal
Swiss design, lots of whitespace, precise typography. Professional and understated.

### Neon Gradient
Modern SaaS aesthetic, bold gradients on dark. Eye-catching and contemporary.

### Custom (AI-Generated)
Describe any style in natural language. BeautifulDocs creates matching CSS on-the-fly.

## Features

- **Markdown input** with frontmatter configuration
- **4+ built-in templates** with 20+ color palettes
- **Component library**: cards, tags, metrics, funnels, quotes, tables
- **Visual effects**: glassmorphism, gradients, aurora, grain, patterns
- **1,600+ icons** via Lucide SVG
- **AI image generation** via fal.ai (optional)
- **AI content generation** via OpenRouter (optional)
- **Dynamic style generation** — describe a look, get matching CSS
- **Watch mode** with live browser preview
- **Batch processing** for multiple files
- **Plugin system** for custom templates and components
- **Page-fill intelligence** — no half-empty pages
- **Multiple formats**: A4, Letter, 16:9 slides, one-pagers

## Quick Start

### From Markdown

```markdown
---
title: My Report
template: editorial-warm
palette: plum-coral
format: a4
---

# Introduction

Your content here. Tables, images, code blocks — all rendered beautifully.

## Key Metrics

| Metric | Value |
|--------|-------|
| Revenue | $32B |
| Growth | +40% |
```

```bash
beautifuldocs build report.md
# → report.pdf (stunning editorial PDF)
```

### From CLI (AI-Powered)

```bash
# Generate content + design from a topic
beautifuldocs create "7-day tantra challenge for couples" \
  --template dark-executive \
  --pages 8 \
  --images  # generates hero images via fal.ai

# Dynamic style
beautifuldocs build report.md \
  --style "warm magazine feel, serif headings, coral accents, subtle grain"
```

### Claude Code Integration

```bash
# In Claude Code:
/beautifuldocs "quarterly revenue report with charts"
# → generates content, picks template, renders PDF
```

## Configuration

### Environment Variables (optional)

```bash
# For AI image generation
export FAL_KEY=your-fal-ai-key

# For AI content generation
export OPENROUTER_API_KEY=your-key
```

### Frontmatter Options

```yaml
---
title: Document Title
template: editorial-warm | dark-executive | clean-minimal | neon-gradient
palette: plum-coral | ocean-deep | forest-sage | sunset-gold | custom
format: a4 | letter | 16:9 | one-pager
font: serif-sans | all-sans | mono-accent
icons: true  # enable Lucide icons
effects: glassmorphism | aurora | grain | none
style: "natural language style description"  # AI generates CSS
---
```

## Tech Stack

- **Runtime**: Bun
- **PDF Engine**: Playwright (headless Chromium)
- **Markdown**: marked
- **Templates**: HTML/CSS (no build step)
- **Icons**: Lucide SVG
- **AI Images**: fal.ai Flux (optional)
- **AI Content**: OpenRouter (optional)

## License

MIT

---

*Built with obsessive attention to design quality. Because your documents deserve to look as good as your ideas.*
