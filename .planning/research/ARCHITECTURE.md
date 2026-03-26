# BeautifulDocs CLI Architecture Research

**Research Date:** 2026-03-25 | **Status:** Architecture Planning Phase | **Focus:** Template engine, effect system, AI integration, plugin architecture

---

## Executive Summary

BeautifulDocs is a CLI document generator that transforms Markdown/HTML into pixel-perfect PDFs using a modular architecture. This research synthesizes best practices from CLI development (Bun 2026), template engines (Eta vs. Template Literals), CSS component systems (Atomic Design), plugin architecture (Hook-based patterns), and AI integration (fal.ai image generation).

**Key findings:**
- **Template Engine:** Template literals + Eta hybrid for 4x speed and <2.5KB footprint vs. Handlebars
- **Effect System:** CSS-based (glassmorphism, gradients, decorative elements) with composable utility classes
- **Plugin Architecture:** Hook-based (lifecycle + render hooks) with ES Module dynamic imports for extensibility
- **AI Integration:** fal.ai for image generation with server-side proxy pattern for security
- **Build Order:** Core engine → Template system → Renderer → Effects → Plugins → AI integration

---

## 1. Component Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    INPUT LAYER                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Markdown (frontmatter) | HTML | JSON | CLI Config      │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     v
┌─────────────────────────────────────────────────────────────────┐
│                   PARSING & VALIDATION                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Markdown Parser (markdown-it) → AST → Validator          │ │
│  │  Extract frontmatter: title, layout, style, theme, etc.    │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────┬────────────────────────────────────────────┘
                     │
          ┌──────────┼──────────┐
          │          │          │
          v          v          v
    ┌──────────┐ ┌──────────┐ ┌──────────────┐
    │ TEMPLATE │ │ STYLE    │ │ EFFECT       │
    │ ENGINE   │ │ GENERATOR│ │ SYSTEM       │
    └────┬─────┘ └────┬─────┘ └──────┬───────┘
         │            │              │
         └────────────┼──────────────┘
                      │
                      v
    ┌─────────────────────────────────────────┐
    │     TEMPLATE RESOLUTION                 │
    │  ┌───────────────────────────────────┐  │
    │  │ Load template (built-in or user)  │  │
    │  │ Inject parsed data + variables    │  │
    │  │ Apply theme/palette overrides     │  │
    │  └───────────────────────────────────┘  │
    └────────────┬────────────────────────────┘
                 │
                 v
    ┌─────────────────────────────────────┐
    │   ICON & IMAGE SYSTEM               │
    │  ┌─────────────────────────────────┐│
    │  │ - Lucide icons → <svg> inline   ││
    │  │ - Phosphor icon fallbacks       ││
    │  │ - fal.ai image generation queue ││
    │  └─────────────────────────────────┘│
    └────────────┬────────────────────────┘
                 │
                 v
    ┌──────────────────────────────────────────┐
    │     FAL.AI IMAGE GENERATION LAYER        │
    │  ┌──────────────────────────────────────┐│
    │  │ Server-side proxy (security)         ││
    │  │ - Queue generation requests          ││
    │  │ - Poll for completion (with timeout) ││
    │  │ - Inject URLs into HTML/CSS          ││
    │  │ - Fallback: solid colors if timeout  ││
    │  └──────────────────────────────────────┘│
    └────────────┬────────────────────────────┘
                 │
                 v
    ┌──────────────────────────────────────────┐
    │     PLUGIN HOOK SYSTEM                   │
    │  ┌──────────────────────────────────────┐│
    │  │ Pre-render hooks (modify HTML)       ││
    │  │ Post-render hooks (optimize)         ││
    │  │ CSS injection hooks (custom styles)  ││
    │  │ Component hooks (extend library)     ││
    │  └──────────────────────────────────────┘│
    └────────────┬────────────────────────────┘
                 │
                 v
    ┌──────────────────────────────────────────┐
    │     HTML GENERATION                      │
    │  ┌──────────────────────────────────────┐│
    │  │ Render to string                     ││
    │  │ Inject dynamic CSS (theme, effects)  ││
    │  │ Optimize: purge unused CSS           ││
    │  └──────────────────────────────────────┘│
    └────────────┬────────────────────────────┘
                 │
                 v
    ┌──────────────────────────────────────────┐
    │     PDF/OUTPUT RENDERING                 │
    │  ┌──────────────────────────────────────┐│
    │  │ Playwright → Headless Chrome         ││
    │  │ HTML → PDF (print CSS media)         ││
    │  │ HTML → PNG (per-page snapshots)      ││
    │  │ HTML → HTML (with animations)        ││
    │  └──────────────────────────────────────┘│
    └────────────┬────────────────────────────┘
                 │
                 v
    ┌──────────────────────────────────────────┐
    │  OUTPUT FILES                            │
    │  - document.pdf (A4 / Letter)            │
    │  - slides.pdf (16:9 presentation)        │
    │  - document.html (with animations)       │
    │  - assets/ (images, fonts)               │
    └──────────────────────────────────────────┘
```

---

## 2. Data Flow Diagram

### Complete Pipeline: Markdown → PDF

```
INPUT: markdown file with frontmatter
  │
  ├─ title: "Q1 Revenue Report"
  ├─ format: "editorial"  (A4 multi-page)
  ├─ theme: "warm-plum"   (color palette)
  ├─ effects: ["glassmorphism", "aurora-gradient"]
  ├─ ai_images: true      (generate hero images via fal.ai)
  └─ hero_prompt: "abstract data visualization"
  │
  v
[1] PARSE MARKDOWN
  ├─ Extract frontmatter → { title, format, theme, effects, ai_images }
  ├─ Parse body → AST sections: [title, subtitle, toc, content[], footer]
  ├─ Extract metadata: word_count, estimated_pages, has_tables
  └─ Build content graph: sections → subsections → components
  │
  v
[2] RESOLVE TEMPLATE
  ├─ Map format → template file
  │  ├─ "editorial" → templates/editorial/multi-page.html
  │  ├─ "slides" → templates/slides/16-9.html
  │  └─ "one-pager" → templates/one-pager/a4.html
  │
  ├─ Load template as JS function (template literal or Eta compiled)
  └─ Extract template vars: ${title}, ${content}, ${theme_css}, etc.
  │
  v
[3] GENERATE STYLES
  ├─ Load base CSS: typography.css + layout.css + reset.css
  ├─ Load theme palette: warm-plum.css
  │  ├─ primary: #8B5A8C
  │  ├─ secondary: #D4A574
  │  ├─ accent: #E8C8B8
  │  └─ text: #2C1B2F
  │
  ├─ Generate effect CSS (if requested):
  │  ├─ Glassmorphism: backdrop-filter + rgba with opacity
  │  ├─ Aurora gradient: multi-stop linear-gradient + animation
  │  └─ Composable: .effect-glass, .effect-aurora applied to sections
  │
  └─ Build dynamic CSS class list (inlined, no external sheets)
  │
  v
[4] RESOLVE ICONS
  ├─ Scan content for icon references: [icon:lucide/star]
  ├─ Load Lucide SVG library (small tree-shaken bundle)
  ├─ Inline SVGs into template as data-uri or <svg> tags
  │  └─ Colorized via CSS custom properties: --icon-color
  │
  └─ Fallback: Unicode symbols if icon not found
  │
  v
[5] QUEUE FAL.AI IMAGE GENERATION
  ├─ If ai_images: true, extract image prompts from markdown
  │  ├─ [AIImage: {prompt: "abstract data viz", model: "flux/dev"}]
  │  └─ Build queue: [{section: 1, prompt: "..."}, {section: 2, prompt: "..."}, ...]
  │
  ├─ Server-side proxy (Node.js/Bun server)
  │  ├─ POST /api/generate-image { prompt, model }
  │  ├─ Call fal.ai API: fal.subscribe("fal-ai/flux/dev", { input: { prompt } })
  │  ├─ Poll for completion (max 60s timeout)
  │  └─ Return URL or placeholder on timeout
  │
  └─ Inject image URLs into template vars:
     └─ { ai_images: { section_1: "https://cdn.fal.ai/...", section_2: "..." } }
  │
  v
[6] RENDER PLUGINS (PRE-RENDER HOOKS)
  ├─ Load all plugins from ~/.beautifuldocs/plugins/
  ├─ Emit hook: "beforeRender" { html, data, theme, effects }
  ├─ Plugins modify:
  │  ├─ HTML structure (add custom components)
  │  ├─ CSS classes (inject custom utilities)
  │  └─ Data (enrich frontmatter)
  │
  └─ Collect modified HTML + CSS from all plugins
  │
  v
[7] TEMPLATE RENDERING
  ├─ Call template function:
  │  ├─ If Eta: render({ data, theme_css, effects_css, plugin_css })
  │  └─ If Template Literals: ${title} ${content} ${theme_css}
  │
  ├─ Inject all CSS inline:
  │  ├─ <style> reset.css + typography.css + layout.css </style>
  │  ├─ <style> theme_css (warm-plum palette) </style>
  │  ├─ <style> effects_css (glassmorphism, aurora, etc.) </style>
  │  └─ <style> plugin_css (custom plugins) </style>
  │
  ├─ Inject all content:
  │  ├─ <h1>${title}</h1>
  │  ├─ <div class="content">${sections_html}</div>
  │  └─ <footer>${metadata_html}</footer>
  │
  └─ Output: complete HTML string (ready for browser/PDF)
  │
  v
[8] PAGE LAYOUT OPTIMIZATION
  ├─ Measure content height (hypothetical, CSS-based pagination)
  ├─ If multi-page:
  │  ├─ Insert <div class="page-break"> every N sections
  │  ├─ Alternate page bg: light ↔ dark (visual rhythm)
  │  └─ Add header/footer: page number, title, section breadcrumb
  │
  └─ Ensure pages are full (no empty bottoms):
     ├─ Expand whitespace between sections if content < page height
     └─ Compress line-height / margins if content > page height
  │
  v
[9] PLAYWRIGHT → HEADLESS CHROME
  ├─ Launch Playwright instance
  ├─ Navigate to file:/// with HTML
  ├─ Wait for images/fonts to load (timeout: 10s)
  ├─ Emit custom events for plugin completion
  │
  └─ Options:
     ├─ PDF (print media): page.pdf({ format: "a4", printBackground: true })
     ├─ PNG: page.screenshot({ fullPage: true })
     └─ HTML: page.content() (save as .html for web viewing)
  │
  v
[10] OUTPUT
  ├─ PDF: output/document.pdf (optimized, < 5MB for most docs)
  ├─ HTML: output/document.html (with animations, for web sharing)
  ├─ Assets: output/assets/ (fonts, images, extracted SVGs)
  │
  └─ Summary:
     ├─ Pages: N
     ├─ Sections: M
     ├─ Images: K (fal.ai + user-provided)
     └─ Size: X MB
```

---

## 3. File Structure Recommendation

```
pulsepress/
├── src/
│   ├── cli.ts                          # CLI entry point (Bun executable)
│   │   ├─ Command parsing (OCLIF or custom)
│   │   ├─ Config loading
│   │   └─ Output handling
│   │
│   ├── core/
│   │   ├── parser/
│   │   │   ├── markdown.ts             # Markdown → AST parser
│   │   │   ├── frontmatter.ts          # Extract YAML frontmatter
│   │   │   └── types.ts                # { Document, Section, Frontmatter }
│   │   │
│   │   ├── template-engine/
│   │   │   ├── index.ts                # Template resolution logic
│   │   │   ├── template.ts             # Template interface + loader
│   │   │   ├── eta-compiler.ts         # Eta-based compilation (fallback)
│   │   │   └── literals.ts             # Template literal utilities
│   │   │
│   │   ├── style-generator/
│   │   │   ├── index.ts                # Main CSS generation
│   │   │   ├── theme.ts                # Palette loading + merging
│   │   │   ├── effects.ts              # Glassmorphism, gradients, etc.
│   │   │   ├── reset.ts                # Normalize.css equivalent
│   │   │   ├── typography.ts           # Font stack + sizing
│   │   │   └── layout.ts               # Grid, flex, spacing utilities
│   │   │
│   │   ├── icon-system/
│   │   │   ├── index.ts                # Icon resolution
│   │   │   ├── lucide.ts               # Lucide library wrapper
│   │   │   ├── phosphor.ts             # Phosphor fallback
│   │   │   └── inline.ts               # SVG inlining as data-uri
│   │   │
│   │   ├── ai-integration/
│   │   │   ├── index.ts                # FAL.AI coordination
│   │   │   ├── server-proxy.ts         # Server-side API proxy
│   │   │   ├── queue.ts                # Request queue + polling
│   │   │   └── cache.ts                # Cache generated images locally
│   │   │
│   │   ├── renderer/
│   │   │   ├── index.ts                # HTML → PDF/PNG/HTML
│   │   │   ├── playwright.ts           # Playwright wrapper
│   │   │   ├── page-optimizer.ts       # Page layout + pagination
│   │   │   └── css-optimizer.ts        # Purge unused CSS
│   │   │
│   │   └── plugin-system/
│   │       ├── index.ts                # Plugin loader + hook emitter
│   │       ├── hooks.ts                # Hook types + registry
│   │       ├── loader.ts               # Dynamic ES module loader
│   │       └── types.ts                # Plugin interface
│   │
│   ├── templates/                      # Built-in templates
│   │   ├── editorial/
│   │   │   ├── multi-page.ts           # A4 editorial (default)
│   │   │   ├── one-pager.ts            # A4 single-page
│   │   │   └── style.css               # Shared editorial styles
│   │   │
│   │   ├── slides/
│   │   │   ├── 16-9.ts                 # 16:9 presentation
│   │   │   ├── 4-3.ts                  # 4:3 presentation
│   │   │   └── style.css               # Shared slide styles
│   │   │
│   │   ├── one-pager/
│   │   │   ├── a4.ts                   # Single-page A4
│   │   │   ├── letter.ts               # Single-page Letter
│   │   │   └── style.css               # One-pager styles
│   │   │
│   │   ├── components/
│   │   │   ├── card.ts                 # Reusable card component
│   │   │   ├── metric.ts               # Metric/KPI display
│   │   │   ├── quote-block.ts          # Pull quotes
│   │   │   ├── funnel-diagram.ts       # Conversion funnels
│   │   │   ├── table.ts                # Styled tables
│   │   │   ├── progress-bar.ts         # Progress indicators
│   │   │   └── divider.ts              # Section dividers
│   │   │
│   │   └── assets/
│   │       ├── fonts/                  # Embedded font files
│   │       └── icons/                  # Fallback icon sprites (optional)
│   │
│   ├── effects/                        # Effect system
│   │   ├── glassmorphism.css            # Glass + backdrop-filter fallback
│   │   ├── gradients.ts                 # Gradient palette + utilities
│   │   ├── aurora.css                   # Aurora animation
│   │   ├── mesh-gradient.css            # Mesh gradient with CSS masks
│   │   ├── noise.css                    # Noise + grain textures
│   │   ├── decorative.css               # Orbs, blobs, geometric shapes
│   │   ├── patterns.css                 # Dots, grids, waves, topography
│   │   └── index.ts                     # Effect resolver
│   │
│   ├── themes/                         # Color palettes
│   │   ├── warm-plum.ts                # Plum + Coral (warm)
│   │   ├── dark-executive.ts           # Navy + Gold (professional)
│   │   ├── clean-minimal.ts            # Neutral + Single accent
│   │   ├── neon-gradient.ts            # Neon colors
│   │   └── index.ts                    # Theme resolver
│   │
│   └── utils/
│       ├── logger.ts                   # Colored console output
│       ├── env.ts                      # Environment variable handling
│       ├── cache.ts                    # File system cache
│       └── types.ts                    # Shared types
│
├── tests/
│   ├── parser.test.ts
│   ├── template-engine.test.ts
│   ├── style-generator.test.ts
│   ├── icon-system.test.ts
│   ├── ai-integration.test.ts
│   ├── renderer.test.ts
│   ├── plugin-system.test.ts
│   └── e2e.test.ts
│
├── examples/
│   ├── simple-one-pager.md
│   ├── multi-page-report.md
│   ├── presentation-slides.md
│   └── custom-plugin-example/
│       └── my-plugin.ts
│
├── docs/
│   ├── ARCHITECTURE.md                 # This file
│   ├── TEMPLATE_GUIDE.md               # How to write templates
│   ├── PLUGIN_GUIDE.md                 # How to write plugins
│   ├── THEME_GUIDE.md                  # How to create themes
│   ├── EFFECT_GUIDE.md                 # How to use effects
│   └── API.md                          # Public API reference
│
├── bunfig.toml                         # Bun config (bundler, test runner)
├── tsconfig.json                       # TypeScript config
├── package.json                        # Dependencies
└── README.md                           # Project overview
```

---

## 4. Plugin Hook Points & System

### Hook Architecture

The plugin system uses **lifecycle hooks** + **CSS injection points** for maximum extensibility without core rewrites.

```typescript
// src/core/plugin-system/hooks.ts
export type HookName =
  | "beforeParse"              // Modify raw markdown before parsing
  | "afterParse"               // Modify parsed document
  | "beforeTemplate"           // Modify template selection
  | "beforeRender"             // Modify HTML before rendering
  | "afterRender"              // Modify rendered HTML
  | "beforePDF"                // Modify PDF options
  | "afterPDF"                 // Post-process PDF
  | "cssInject"                // Inject custom CSS
  | "componentRegister"        // Register custom components

export interface HookContext {
  document: Document
  theme: Theme
  effects: Effect[]
  html?: string
  css?: string[]
  data: Record<string, any>
}

export interface Plugin {
  name: string
  version: string
  hooks: Partial<Record<HookName, (ctx: HookContext) => Promise<HookContext | void>>>
}
```

### Example Plugin (Custom Analytics Footer)

```typescript
// ~/.beautifuldocs/plugins/analytics-footer.ts
import type { Plugin, HookContext } from "@beautifuldocs/core"

export default {
  name: "analytics-footer",
  version: "1.0.0",
  hooks: {
    beforeRender: async (ctx: HookContext) => {
      // Add custom HTML before render
      const footer = `
        <footer class="analytics-footer">
          <p>Generated with BeautifulDocs | Page: <span class="page-number"></span></p>
        </footer>
      `
      ctx.html = (ctx.html || "") + footer
      return ctx
    },

    cssInject: async (ctx: HookContext) => {
      // Inject custom CSS
      const css = `
        .analytics-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.05);
          font-size: 0.875rem;
          color: #666;
          border-top: 1px solid #ddd;
        }
        .page-number::after { content: attr(data-page); }
      `
      ctx.css = [...(ctx.css || []), css]
      return ctx
    }
  }
} satisfies Plugin
```

### Plugin Registration & Loading

```typescript
// src/core/plugin-system/loader.ts
import { createRequire } from "module"
import { pathToFileURL } from "url"

export async function loadPlugins(pluginDir: string): Promise<Plugin[]> {
  const plugins: Plugin[] = []
  const files = await readdir(pluginDir)

  for (const file of files) {
    if (!file.endsWith(".ts") && !file.endsWith(".js")) continue

    try {
      const path = `${pluginDir}/${file}`
      const module = await import(pathToFileURL(path).href)
      const plugin = module.default as Plugin

      if (!plugin.name || !plugin.hooks) {
        console.warn(`Plugin ${file} missing required fields`)
        continue
      }

      plugins.push(plugin)
      console.log(`✓ Loaded plugin: ${plugin.name} v${plugin.version}`)
    } catch (err) {
      console.error(`✗ Failed to load plugin ${file}: ${err.message}`)
    }
  }

  return plugins
}

export async function emitHook(
  name: HookName,
  ctx: HookContext,
  plugins: Plugin[]
): Promise<HookContext> {
  for (const plugin of plugins) {
    const hook = plugin.hooks[name]
    if (!hook) continue

    try {
      const result = await hook(ctx)
      if (result) ctx = result
    } catch (err) {
      console.error(`Error in plugin ${plugin.name} hook ${name}: ${err.message}`)
    }
  }

  return ctx
}
```

---

## 5. FAL.AI Image Integration Pipeline

### Architecture Pattern: Server-Side Proxy

**Why server-side?** Never expose FAL_KEY on the client. Use a server-side proxy to:
1. Keep secrets safe
2. Handle rate limiting
3. Cache results
4. Provide fallbacks

### Integration Flow

```
User provides:
  ai_images: true
  ai_image_model: "fal-ai/flux/dev"  (or another fal.ai model)

↓ [During rendering]

[1] Extract image prompts from markdown:
    - Section headers with [AIImage] markers
    - Content analysis (extract 1-2 sentence summaries)
    - Build queue: { section_id, prompt, model }

↓

[2] Server-side proxy (Node/Bun HTTP endpoint)
    POST /api/generate-image
    ├─ Input: { prompt: string, model: string }
    ├─ Auth: Bearer token (internal, not exposed to CLI)
    └─ Response: { url: string, cached: boolean } | { error: string }

↓

[3] Inside server endpoint:
    ├─ Check cache: ~/.beautifuldocs/cache/images/
    │  └─ Hash: SHA256(prompt + model) = cache key
    │
    ├─ If found:
    │  └─ Return cached URL immediately
    │
    └─ If not found:
       ├─ Call fal.ai API:
       │  const result = await fal.subscribe("fal-ai/flux/dev", {
       │    input: { prompt: string }
       │  })
       │
       ├─ Poll for completion (timeout: 60s, poll interval: 2s)
       ├─ On success:
       │  ├─ Download image to ~/.beautifuldocs/cache/images/
       │  ├─ Cache metadata: { prompt, model, url, timestamp, size }
       │  └─ Return local path or CDN URL
       │
       └─ On timeout/error:
          └─ Return fallback: solid color or placeholder

↓

[4] Inject URLs into HTML:
    ├─ Replace [AIImage] markers with <img src="...">
    ├─ Apply CSS: object-fit, aspect-ratio, shadows
    └─ Example:
       <div class="ai-hero-image">
         <img src="/assets/generated/abc123.png" alt="data visualization">
       </div>

↓

[5] CSS for image sections:
    .ai-hero-image {
      width: 100%;
      max-width: 600px;
      aspect-ratio: 16/9;
      object-fit: cover;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      margin: 2rem auto;
    }
```

### Server Proxy Implementation (Express/Hono)

```typescript
// src/core/ai-integration/server-proxy.ts
import { serve } from "bun"
import { fal } from "@fal-ai/client"

const cache = new Map<string, { url: string; timestamp: number }>()
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000 // 30 days

async function generateImage(prompt: string, model: string = "fal-ai/flux/dev") {
  const cacheKey = `${model}::${prompt}`

  // Check memory cache
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)!
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      return { url: cached.url, cached: true }
    }
  }

  try {
    // Call fal.ai (server-side, secrets safe)
    const result = await fal.subscribe(model, {
      input: { prompt },
    })

    if (result.error) {
      throw new Error(result.error)
    }

    // Extract image URL from result (varies by model, typically result.images[0].url)
    const imageUrl = result.images?.[0]?.url || result.image?.url
    if (!imageUrl) throw new Error("No image URL in response")

    // Cache result
    cache.set(cacheKey, { url: imageUrl, timestamp: Date.now() })

    return { url: imageUrl, cached: false }
  } catch (err) {
    console.error(`FAL.AI error: ${err.message}`)
    // Return fallback color
    return { url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Crect fill='%23e0e0e0' width='800' height='450'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='0.3em' font-size='18' fill='%23999'%3EImage generation failed%3C/text%3E%3C/svg%3E", cached: false }
  }
}

// Bun HTTP handler
export const handler = serve({
  port: 3001,
  fetch: async (req: Request) => {
    if (req.method === "POST" && req.url.includes("/api/generate-image")) {
      const { prompt, model } = await req.json()

      const result = await generateImage(prompt, model)
      return Response.json(result)
    }

    return new Response("Not found", { status: 404 })
  },
})
```

### CLI Integration

```typescript
// src/cli.ts
async function buildDocument(markdownPath: string, options: BuildOptions) {
  const doc = await parseMarkdown(markdownPath)

  // If ai_images enabled, start server-side proxy
  if (doc.frontmatter.ai_images) {
    const serverProcess = Bun.spawn([
      "bun",
      "src/core/ai-integration/server-proxy.ts",
    ])

    // Wait for server to start
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Queue image generation requests
    const imageQueue = extractImagePrompts(doc)
    for (const { prompt, model } of imageQueue) {
      const result = await fetch("http://localhost:3001/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model }),
      }).then((res) => res.json())

      console.log(
        `Generated image: ${result.cached ? "(cached)" : "(new)"} ${result.url.slice(0, 60)}...`
      )
    }

    // Kill server after images generated
    serverProcess.kill()
  }

  // Continue with rendering...
}
```

---

## 6. Template Engine Comparison & Selection

### Performance & Size Benchmark

| Engine | Speed (ops/sec) | Size (gzipped) | Learning Curve | Best For |
|--------|-----------------|----------------|----------------|----------|
| **Template Literals** | 1000+ | 0 KB | Minimal | Simple templates, raw HTML |
| **Eta** | ~7x faster than Handlebars | <2.5 KB | Low | Most use cases (recommended) |
| **Handlebars** | ~1x baseline | ~22 KB | Low | Complex logic (avoid) |
| **EJS** | ~5x faster than Handlebars | ~8 KB | Low | Legacy support |
| **Tera** | N/A (Rust) | — | Moderate | Rust CLI (not applicable here) |

### Recommendation: **Eta + Template Literals Hybrid**

**Strategy:**
1. **Simple templates** (editorial, slides, one-pager): Use template literals for 0 overhead
2. **Complex templates** (custom user templates): Use Eta for escaping, loops, conditionals
3. **Fallback**: Compile Eta at build time, cache compiled functions

### Implementation

```typescript
// src/core/template-engine/index.ts
import * as Eta from "eta"

export interface TemplateOptions {
  data: Record<string, any>
  cacheKey?: string // For compiled Eta templates
}

export async function renderTemplate(
  template: string,
  options: TemplateOptions
): Promise<string> {
  // If template is a built-in (starts with \`), use template literal
  if (template.includes("${")) {
    return evalTemplate(template, options.data)
  }

  // Otherwise, use Eta for user-provided templates
  const compiled = Eta.compile(template, {
    cache: options.cacheKey ? true : false,
    cacheKey: options.cacheKey,
  })

  return compiled(options.data) as string
}

function evalTemplate(template: string, data: Record<string, any>): string {
  // Safe evaluation of template literals
  // Only interpolate ${...} expressions
  return template.replace(/\$\{([^}]+)\}/g, (_, expr) => {
    try {
      // Create safe context
      const fn = new Function(...Object.keys(data), `return ${expr}`)
      return String(fn(...Object.values(data)))
    } catch {
      return ""
    }
  })
}
```

### Built-in Template Example (Template Literal)

```typescript
// src/templates/editorial/multi-page.ts
import type { Document, Theme } from "../../core"

export function renderEditorialMultiPage(
  doc: Document,
  theme: Theme,
  effects: string[]
): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${doc.frontmatter.title || "Document"}</title>
      <style>
        ${theme.css}
        ${effects.join("\n")}
      </style>
    </head>
    <body>
      <h1>${doc.frontmatter.title}</h1>
      ${doc.sections.map((section) => `
        <section>
          <h2>${section.title}</h2>
          <div class="content">${section.html}</div>
        </section>
      `).join("\n")}
    </body>
    </html>
  `
}
```

---

## 7. CSS Component Library Structure (Atomic Design)

### Atomic Hierarchy

```
ATOMS (smallest, indivisible)
├── Colors (CSS variables: --color-primary, --color-secondary)
├── Typography (font-family, font-size, line-height)
├── Spacing (padding, margin utilities: p-1, m-2, etc.)
├── Borders (border-radius, border-width)
└── Effects (box-shadow, transitions)

MOLECULES (atoms combined)
├── Buttons (atom colors + typography + spacing)
├── Input fields (atom borders + typography + padding)
├── Icons (atom sizing + colors)
├── Tags (atom padding + border-radius + colors)
└── Badges (atom sizing + colors + typography)

ORGANISMS (molecules combined)
├── Cards (button + typography + spacing + background)
├── Headers (logo + nav + spacing + colors)
├── Footers (links + typography + colors)
├── Forms (inputs + buttons + labels)
├── Tables (atoms + typography + colors)
└── Hero sections (background + typography + images)

TEMPLATES (page-level layout)
├── Editorial multi-page (header + content + footer + pagination)
├── Slides (fixed-aspect sections)
├── One-pager (single A4 layout)
└── Pitch deck (title slides + content slides)

PAGES (fully-rendered instances)
├── Q1 Revenue Report (template + data + content)
├── Product Pitch Deck (template + data + content)
└── Lead Magnet (template + data + content)
```

### CSS File Organization

```
src/core/style-generator/
├── reset.css              # Normalize, box-sizing, margins
│   └─ Safe defaults for all browsers
│
├── typography.css         # Font stacks, sizes, weights, line-heights
│   ├─ --font-serif: "Georgia", serif
│   ├─ --font-sans: "Inter", sans-serif
│   ├─ --font-mono: "Fira Code", monospace
│   ├─ Heading styles (h1-h6 with presets)
│   └─ Body text, links, strong, em
│
├── layout.css             # Grid, flex, spacing, positioning
│   ├─ Container (max-width responsive)
│   ├─ Grid utilities (grid-cols-2, grid-cols-3, etc.)
│   ├─ Flex utilities (flex, justify-center, align-items, etc.)
│   ├─ Spacing utilities (p-1, m-2, gap-4, etc.)
│   └─ Position utilities (absolute, relative, fixed)
│
├── theme/
│   ├── warm-plum.css      # Color palette
│   │   ├─ Primary: #8B5A8C
│   │   ├─ Secondary: #D4A574
│   │   ├─ Accent: #E8C8B8
│   │   └─ Text: #2C1B2F
│   │
│   ├── dark-executive.css # Navy + Gold
│   ├── clean-minimal.css  # Neutral + Single accent
│   └── neon-gradient.css  # Neon colors
│
├── atoms/
│   ├── colors.css         # Color utilities (.text-primary, .bg-secondary, etc.)
│   ├── spacing.css        # Padding/margin utilities (.p-1, .m-2, .gap-4)
│   ├── typography.css     # Font utilities (.font-serif, .text-lg, .font-bold)
│   ├── borders.css        # Border utilities (.rounded, .border, .border-lg)
│   └── shadows.css        # Shadow utilities (.shadow-sm, .shadow-lg, .shadow-glow)
│
├── molecules/
│   ├── button.css         # .btn, .btn-primary, .btn-secondary
│   ├── input.css          # .input, .input-focus
│   ├── tag.css            # .tag, .tag-primary
│   ├── badge.css          # .badge, .badge-success
│   └── icon.css           # .icon, .icon-small, .icon-large
│
├── organisms/
│   ├── card.css           # .card, .card-header, .card-body, .card-footer
│   ├── header.css         # .header, .nav, .nav-item
│   ├── footer.css         # .footer, .footer-link
│   ├── form.css           # .form, .form-group, .form-label
│   ├── table.css          # .table, .table-header, .table-row
│   ├── quote-block.css    # .quote-block, .quote-text, .quote-attribution
│   ├── funnel.css         # .funnel, .funnel-stage
│   ├── metric.css         # .metric, .metric-value, .metric-label
│   └── divider.css        # .divider, .divider-text
│
└── effects/
    ├── glassmorphism.css  # .effect-glass, .effect-glass-light
    ├── gradients.css      # .gradient-aurora, .gradient-mesh
    ├── aurora.css         # @keyframes aurora-animation
    ├── mesh-gradient.css  # CSS mask-image for mesh effects
    ├── noise.css          # .noise, .noise-fine, .noise-coarse
    ├── decorative.css     # .orb, .blob, .geometric
    └── patterns.css       # .pattern-dots, .pattern-waves, .pattern-grid
```

### Example: Card Component (Atomic)

```css
/* atoms/colors.css */
.text-primary { color: var(--color-primary); }
.bg-secondary { background-color: var(--color-secondary); }
.border-accent { border-color: var(--color-accent); }

/* atoms/spacing.css */
.p-4 { padding: 1.5rem; }
.m-2 { margin: 0.5rem; }
.gap-2 { gap: 0.5rem; }

/* molecules/card.css */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: var(--color-primary);
  color: white;
  padding: 1.5rem;
  font-weight: bold;
  font-size: 1.25rem;
}

.card-body {
  padding: 1.5rem;
}

.card-footer {
  padding: 1rem 1.5rem;
  background: var(--color-secondary);
  border-top: 1px solid var(--color-accent);
}

/* Usage in HTML */
<div class="card">
  <div class="card-header">Title</div>
  <div class="card-body">Content</div>
  <div class="card-footer">
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

---

## 8. Build Order & Implementation Priority

### Phase 1: Core Engine (Foundation)
**Goal:** Parse markdown, generate basic HTML, render to PDF

1. **Parser** (`src/core/parser/`)
   - Markdown → AST (use `markdown-it`)
   - Frontmatter extraction (YAML)
   - Content structure validation

2. **Template Engine** (`src/core/template-engine/`)
   - Simple template literal renderer
   - Template loading logic
   - Data injection

3. **Renderer** (`src/core/renderer/`)
   - Playwright integration
   - HTML → PDF conversion
   - Basic CSS injection

**Deliverable:** `beautifdocs build example.md --output output.pdf` works for simple documents

---

### Phase 2: Styling System
**Goal:** Theme support, component library, effect system

4. **Style Generator** (`src/core/style-generator/`)
   - Reset.css + typography.css + layout.css
   - Theme palette loading
   - CSS variable injection

5. **CSS Component Library** (`src/templates/components/`)
   - Atoms (colors, spacing, typography)
   - Molecules (buttons, inputs, tags)
   - Organisms (cards, headers, footers, tables)

6. **Effect System** (`src/effects/`)
   - Glassmorphism CSS
   - Gradient utilities
   - Decorative shapes, patterns, animations

7. **Icon System** (`src/core/icon-system/`)
   - Lucide SVG library integration
   - SVG inlining as data-uri
   - Icon color customization

**Deliverable:** `beautifuldocs build example.md --theme warm-plum --effects glassmorphism,aurora`

---

### Phase 3: AI Integration
**Goal:** FAL.AI image generation, dynamic content

8. **FAL.AI Server Proxy** (`src/core/ai-integration/`)
   - Server-side image generation
   - Caching layer
   - Fallback handling

9. **Image Resolution in Markdown**
   - Parse `[AIImage: {prompt: "..."}]` markers
   - Queue generation requests
   - Inject URLs into HTML

**Deliverable:** `beautifuldocs build example.md --ai-images` generates hero images automatically

---

### Phase 4: Plugin System & Advanced Features
**Goal:** Extensibility, advanced templates, batch processing

10. **Plugin System** (`src/core/plugin-system/`)
    - Hook architecture
    - Plugin loader (dynamic ES modules)
    - Hook emitter

11. **Advanced Templates** (`src/templates/`)
    - Slides (16:9, 4:3)
    - One-pager
    - Custom user templates via plugins

12. **Page Optimization**
    - Multi-page pagination
    - Page break logic
    - Header/footer injection
    - Full-page fill logic

13. **Batch Processing** (`src/cli.ts`)
    - Watch mode (auto-rebuild)
    - Multiple document conversion
    - Batch image generation

**Deliverable:** `beautifuldocs build *.md --watch` + custom plugins working

---

### Phase 5: Polish & Distribution
**Goal:** CLI UX, documentation, npm publication

14. **CLI Polish** (`src/cli.ts`)
    - Progress indicators
    - Color output
    - Error handling
    - Help text

15. **Documentation**
    - Template creation guide
    - Plugin development guide
    - Theme guide
    - Effect guide
    - API reference

16. **Testing**
    - Unit tests (parser, template engine, style generator)
    - E2E tests (full pipeline)
    - Visual regression tests (PDF output)

17. **Distribution**
    - npm publish
    - GitHub releases
    - Docker image (optional)
    - Bun bundler setup (compile to binary)

**Deliverable:** `npm install -g beautifuldocs` + full documentation

---

## 9. Dependencies Reference

### Core Dependencies

```json
{
  "dependencies": {
    "markdown-it": "^14.0.0",        // Markdown parser
    "gray-matter": "^4.1.0",          // Frontmatter extraction
    "eta": "^2.0.1",                  // Template engine (2.5KB)
    "playwright": "^1.48.0",          // Headless Chrome control
    "@fal-ai/client": "^1.0.0",       // FAL.AI image generation
    "commander": "^12.0.0",           // CLI argument parsing (optional)
    "chalk": "^5.0.0",                // Colored output
    "lucide-static": "^0.0.1"         // Lucide icons (if bundling)
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "bun": "^1.1.0",
    "@types/node": "^20.0.0",
    "vitest": "^1.0.0"
  },
  "engines": {
    "bun": ">=1.0.0"
  }
}
```

### Size Budget

| Dependency | Size | Purpose |
|------------|------|---------|
| Bun runtime | ~100 MB | Fast JS runtime (not bundled) |
| Playwright | ~200 MB | Headless browser control |
| Eta | 2.5 KB | Template engine |
| markdown-it | ~50 KB | Markdown parser |
| gray-matter | ~10 KB | Frontmatter extraction |
| FAL.AI client | ~20 KB | Image generation API |
| **Total bundled** | **~80 KB** | CLI binary (with tree-shake) |

---

## 10. API Summary

### CLI Interface

```bash
# Basic usage
beautifdocs build input.md --output output.pdf

# With options
beautifdocs build input.md \
  --output output/ \
  --format editorial \
  --theme warm-plum \
  --effects glassmorphism,aurora \
  --ai-images \
  --ai-model fal-ai/flux/dev

# Watch mode
beautifdocs watch . --output output/

# Batch processing
beautifdocs build *.md --output output/

# List available themes/effects
beautifdocs list themes
beautifdocs list effects
beautifdocs list templates
```

### Programmatic API

```typescript
import {
  parseMarkdown,
  renderTemplate,
  generateStyles,
  renderToHTML,
  renderToPDF,
} from "@beautifuldocs/core"

// Full pipeline
const doc = await parseMarkdown("input.md")
const html = await renderTemplate(doc, { theme: "warm-plum" })
const pdf = await renderToHTML(html, { outputPath: "output.pdf" })
```

---

## 11. Recommended Tech Stack Summary

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Runtime** | Bun 1.0+ | Fast startup, built-in bundler, zero config TS |
| **Language** | TypeScript | Type safety, better DX |
| **Template Engine** | Eta + Template Literals | 7x faster than Handlebars, <2.5KB |
| **PDF Rendering** | Playwright + Headless Chrome | Full CSS support, reliable output |
| **Markdown Parser** | markdown-it | Mature, extensible, standard |
| **Styling** | CSS only (no Tailwind) | Self-contained templates, zero build step |
| **Icons** | Lucide (tree-shaked) | Modern, MIT licensed, 1000+ icons |
| **Image Generation** | fal.ai (FLUX.1 dev) | Fast (15-30s), cheap ($0.02/image) |
| **Plugin System** | Dynamic ES Modules | Native, no runtime overhead |
| **CLI Parsing** | Custom (or Commander) | Minimal deps, type-safe with TS |
| **Testing** | Vitest + Playwright | Fast, modern, Bun-native support |

---

## 12. Key Insights & Gotchas

### What Works Well
- **HTML→PDF via Headless Chrome**: Full CSS support, reliable rendering, no style surprises
- **Warm color palettes**: Editorial docs feel more human (vs. neon/pure-tech look)
- **Template literals**: Zero overhead for simple templates, readable inline HTML
- **Eta for user templates**: Drop-in replacement, 7x faster than Handlebars, tiny footprint
- **Server-side FAL.AI proxy**: Keeps secrets safe, enables caching, provides fallbacks
- **Hook-based plugins**: Extensible without forking core, easy to compose behavior

### Common Pitfalls
- **`backdrop-filter` doesn't render in headless Chrome**: Use solid-color fallbacks (implemented in effects.css)
- **Empty page bottoms look unprofessional**: Must implement page-fill logic (margin/padding expansion in renderer)
- **Fonts need to be embedded**: Use base64 data-uri or Bun bundler to include in binary
- **FAL.AI timeouts**: Always provide fallback (solid color or placeholder SVG)
- **Plugin security**: Never allow plugins to execute shell commands without user confirmation
- **CSS purging**: Must be careful to not remove used classes in generated content

### Performance Targets
- Parse markdown: <100ms
- Generate styles: <50ms
- Render template: <200ms
- Generate image (FAL.AI): 15-30s (async, can be cached)
- Render to PDF: 2-5s per page
- **Total for 10-page doc**: ~30-60s (first run with images), <5s (cached)

---

## 13. References & Sources

### Web Search Results (2026)

- [Ts.ED Templating Guide](https://tsed.dev/docs/templating.html) — Framework comparison
- [How to Build CLI Applications with Bun](https://oneuptime.com/blog/post/2026-01-31-bun-cli-applications/view) — Bun best practices
- [Building a TypeScript Library in 2026 with Bun](https://dev.to/arshadyaseen/building-a-typescript-library-in-2026-with-bunup-3bmg) — Modern CLI patterns
- [Building CLI apps with TypeScript in 2026](https://dev.to/hongminhee/building-cli-apps-with-typescript-in-2026-5c9d) — CLI design patterns
- [Performance Comparison: Template Literals vs Handlebars](https://www.codeblocq.com/2016/05/Performance-Comparison-ES6-Template-Literals-vs-HandleBars-in-Node/) — Template engine benchmarks
- [Handlebars vs EJS vs Eta](https://javascript.plainenglish.io/handlebars-eta-ejs-1623a6140e56) — Comprehensive comparison
- [Eta GitHub](https://github.com/eta-dev/eta) — Template engine documentation
- [Atomic Design by Brad Frost](https://atomicdesign.bradfrost.com/) — Component architecture methodology
- [The Difference Between Design Systems, Component Libraries and Atomic Design](https://medium.com/@rain.lieberman/the-difference-between-design-systems-component-libraries-and-atomic-design-9d18c493aa7a) — Design system patterns
- [Plugin Architecture in JavaScript and Node.js](https://www.adaltas.com/en/2020/08/28/node-js-plugin-architecture/) — Plugin design patterns
- [How to Build Plugin Architecture in Node.js](https://oneuptime.com/blog/post/2026-01-26-nodejs-plugin-architecture/view) — Plugin implementation
- [Node.js Plugin Architecture with ES Modules](https://medium.com/codeelevation/node-js-plugin-architecture-build-your-own-plugin-system-with-es-modules-5b9a5df19884) — Modern plugin system
- [OCLIF Plugin System](https://deepwiki.com/oclif/core/3-configuration-and-plugins) — Real-world CLI plugin implementation
- [fal.ai Quickstart](https://docs.fal.ai/model-apis/quickstart) — FAL.AI integration guide
- [Add fal.ai to Next.js](https://docs.fal.ai/model-apis/integrations/nextjs) — Framework integration patterns
- [fal-ai/fal-js GitHub](https://github.com/fal-ai/fal-js) — JavaScript client library
- [FLUX.1 [dev] API](https://fal.ai/models/fal-ai/flux/dev/api) — Image generation model documentation

---

**Next Steps:**
1. Create Phase 1 implementation plan (parser, template engine, renderer)
2. Set up Bun project structure + TypeScript config
3. Implement markdown parser + frontmatter extraction
4. Build simple template literal renderer
5. Integrate Playwright for PDF generation
6. Validate with simple end-to-end test (markdown → PDF)

**Last Updated:** 2026-03-25
