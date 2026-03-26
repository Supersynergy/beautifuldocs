---
title: BeautifulDocs Complete Test
template: neon
format: a4
palette: neon-purple
---

# BeautifulDocs Test Document

This document tests **all features** of BeautifulDocs Creator.

## :star: Icons Test

Here are some icons: :home: :user: :mail: :phone: :check: :arrow-right:

Different sizes: :heart-sm: :heart: :heart-lg:

## Component Showcase

### Cards

<div class="card-elevated">
  <h3 class="mt-0">Feature Card</h3>
  <p>This is an elevated card with a title and content. It has subtle shadow and rounded corners.</p>
</div>

<div class="card-filled">
  <h3 class="mt-0">Highlighted Card</h3>
  <p>This card uses the primary color as background with white text.</p>
</div>

### Tags

<span class="tag">Default</span>
<span class="tag tag-primary">Primary</span>
<span class="tag tag-secondary">Secondary</span>
<span class="tag tag-accent">Accent</span>

### Metrics

<div class="columns-3">
  <div class="metric">
    <div class="metric-value">2.4M</div>
    <div class="metric-label">Users</div>
  </div>
  <div class="metric">
    <div class="metric-value">98%</div>
    <div class="metric-label">Satisfaction</div>
  </div>
  <div class="metric">
    <div class="metric-value">$12M</div>
    <div class="metric-label">Revenue</div>
  </div>
</div>

### Progress Bars

<div class="progress-label">
  <span>Project Progress</span>
  <span>75%</span>
</div>
<div class="progress">
  <div class="progress-bar" style="width: 75%"></div>
</div>

<div class="progress-label">
  <span>Secondary Metric</span>
  <span>45%</span>
</div>
<div class="progress">
  <div class="progress-bar-secondary" style="width: 45%"></div>
</div>

### Callouts

<div class="callout callout-info">
  <div class="callout-title">:info: Information</div>
  <p>This is an informational callout with helpful context.</p>
</div>

<div class="callout callout-success">
  <div class="callout-title">:check: Success</div>
  <p>Operation completed successfully!</p>
</div>

## Typography

### Headers

# Heading 1 - Main Title
## Heading 2 - Section
### Heading 3 - Subsection
#### Heading 4 - Detail

### Text Formatting

Regular paragraph with **bold text**, *italic text*, and ~~strikethrough~~.

> "Design is not just what it looks like and feels like. Design is how it works."
> — Steve Jobs

### Lists

**Unordered:**
- First item
- Second item with nested:
  - Nested A
  - Nested B
- Third item

**Ordered:**
1. First step
2. Second step
3. Third step

## Code

Inline code: `console.log("Hello")`

```typescript
// Code block with syntax highlighting
interface Config {
  template: string;
  format: 'a4' | '16:9';
}

function generate(config: Config): string {
  return `Generating ${config.template} in ${config.format}`;
}
```

## Tables

| Feature | Status | Priority |
|---------|--------|----------|
| Markdown parsing | :check: Complete | High |
| PDF generation | :check: Complete | High |
| Templates | :check: Complete | High |
| AI integration | In progress | Medium |

## Effects Demo

<div class="glass-dark" style="padding: 1.5em; margin: 1em 0;">
  <h3 class="mt-0">Glassmorphism Card</h3>
  <p>This card uses the glass-dark effect with backdrop blur.</p>
</div>

<div class="text-center">
  <span class="gradient-text gradient-purple-cyan font-bold" style="font-size: 1.5em;">
    Gradient Text Effect
  </span>
</div>

## Columns Layout

<div class="columns-2">
  <div>
    <h4>Left Column</h4>
    <p>This content appears in the left column. Perfect for comparison layouts or side-by-side content.</p>
  </div>
  <div>
    <h4>Right Column</h4>
    <p>This content appears in the right column. The grid system automatically handles spacing.</p>
  </div>
</div>

---

*Generated with BeautifulDocs Creator*
