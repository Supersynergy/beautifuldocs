# Phase 1: Core Engine - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the foundational Markdown → HTML → PDF pipeline with Bun CLI. This is pure infrastructure: CLI interface, file parsing, HTML generation, and PDF rendering via Playwright.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Use best practices from research:
- Bun for runtime and package management
- Playwright for PDF generation (Chrome headless)
- Eta or native template literals for templating
- Gray-matter for frontmatter parsing
- Marked or remark for Markdown parsing

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- None yet — this is the foundation

### Established Patterns
- Bun project structure from package.json
- TypeScript throughout

### Integration Points
- CLI entry point at src/cli.ts
- PDF output to ./output/ directory

</code_context>

<specifics>
## Specific Requirements

From ROADMAP.md:
1. `beautifuldocs build input.md` produces a valid multi-page PDF
2. Frontmatter parsed correctly (title, template, palette, format)
3. Markdown with tables, code blocks, images renders correctly
4. PDF opens in Preview.app without errors
5. A4 and 16:9 format options work

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope
</deferred>
