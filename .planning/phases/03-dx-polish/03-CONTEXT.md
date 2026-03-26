# Phase 3: DX & Polish - Context

**Status:** Ready for planning

<domain>
Build developer experience features: watch mode for live preview, batch processing for multiple files, and 16:9 slide format support with page breaks.
</domain>

<decisions>
- Watch mode: Use `bun --watch` pattern with file watcher
- Batch: Process glob patterns like `docs/*.md`
- Slides: Use 1920x1080 with slide delimiters (---)
</decisions>

<specifics>
From ROADMAP:
1. Watch mode auto-rebuilds on file save, serves HTML at localhost
2. Batch mode converts directory of .md files to PDFs
3. Plugin directory loads custom templates/components
</specifics>
