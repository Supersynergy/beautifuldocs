# Common Pitfalls in PDF/Document Generation

Research compiled from industry best practices and real-world implementations (March 2026).

---

## 1. CSS Features That DON'T Work in Headless Chrome PDF Mode

### Unsupported or Partially Supported Features

**`backdrop-filter`** — THE CRITICAL ONE FOR PULSEPRESS
- **Status**: Not rendered in headless Chrome PDF output (works fine in browser)
- **Symptom**: Glassmorphism effects disappear when exporting to PDF
- **Workaround**: Provide solid-color fallbacks via `@supports` or nested fallback styles
  ```css
  .glass-effect {
    background-color: rgba(255, 255, 255, 0.9); /* Fallback */
    backdrop-filter: blur(10px);
  }
  /* Alternative: use box-shadow for depth instead */
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
  ```
- **Prevention**: Always design with solid backgrounds in mind; backdrop-filter is HTML-only enhancement

**Flexbox & Grid** — Partially supported
- Modern layout works in most cases, but edge cases fail (especially with wrapping)
- **Symptom**: Items break unexpectedly at page boundaries
- **Prevention**: Test complex layouts with actual PDF rendering, not just browser preview

**Media Queries** — Ignored
- `@media screen` vs `@media print` — headless Chrome ignores media query context
- **Prevention**: Don't rely on different styles per media type; use single set that works for PDF

**Animations & Transitions** — Not captured
- CSS animations and transitions don't render (PDF is static)
- **Prevention**: Only use for HTML output; PDFs should use static visual design

**`@page` CSS Rules** — Silently ignored
- Headless Chrome will NOT fetch resources referenced in `@page` rules
- **Symptom**: Custom page backgrounds, watermarks from `@page` don't appear
- **Prevention**: Apply page styles to body/page wrapper instead

**Nested `backdrop-filter`** — Broken
- If parent has backdrop-filter, children cannot have it in Chromium
- **Symptom**: Glassmorphic cards inside other glass containers fail
- **Prevention**: Avoid nesting glassmorphism effects; use solid layering instead

---

## 2. Page Break Issues and Solutions

### Common Breaking Problems

**Tables breaking awkwardly**
- Large tables split mid-row or mid-cell
- **Symptom**: Header rows don't repeat, content overlaps on next page
- **Solution**: Apply CSS page-break rules
  ```css
  table {
    page-break-inside: avoid;
  }
  thead {
    display: table-header-group;
  }
  tfoot {
    display: table-footer-group;
  }
  tr {
    page-break-inside: avoid;
  }
  ```

**Images causing unexpected breaks**
- Large images without explicit height break pages poorly
- **Symptom**: Image pushes to next page, leaving empty space above
- **Solution**: Always set explicit dimensions
  ```css
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
  /* Wrap in container with explicit height if critical */
  .image-container {
    max-height: 300px;
    overflow: hidden;
  }
  ```

**Orphans and widows** (text lines isolated on new page)
- Single lines at page breaks look unprofessional
- **Solution**: Use `orphans` and `widows` (browser support varies)
  ```css
  p {
    orphans: 3;
    widows: 3;
  }
  ```

**Headers/footers overlapping content**
- If table headers repeat, they don't leave space, causing overlap
- **Solution**: Add padding to replicated headers
  ```css
  thead {
    display: table-header-group;
  }
  thead th {
    padding: 10px;
  }
  ```

**Rounding and dimension inconsistencies**
- Headless Chrome may add 1-2mm to page dimensions unexpectedly
- **Prevention**: Test PDF output at actual page size; add buffer margin (5-10mm)
  ```js
  // In Playwright
  await page.pdf({
    width: '210mm',   // A4
    height: '297mm',
    margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' }
  });
  ```

### Page Break Best Practices

| Problem | CSS Solution |
|---------|--------------|
| Element breaks unexpectedly | `page-break-inside: avoid;` or `break-inside: avoid;` |
| Force page break before | `page-break-before: always;` or `break-before: page;` |
| Force page break after | `page-break-after: always;` or `break-after: page;` |
| Allow image to break | `page-break-inside: auto;` (default) |
| Minimum lines together | `orphans: 4; widows: 4;` |

---

## 3. Font Rendering Problems

### Missing or Broken Fonts

**System fonts not available in headless Chrome**
- Custom system fonts may not be installed in Docker/CI environments
- **Symptom**: PDF shows fallback font (often sans-serif or serif default)
- **Solution**: Use web fonts (Google Fonts, self-hosted)
  ```css
  @font-face {
    font-family: 'Custom Font';
    src: url('data:font/woff2;base64,...') format('woff2');
  }
  /* Or Google Fonts via import */
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
  ```

**Font weight/style not available**
- Not all weights provided (e.g., only regular, not bold/italic)
- **Symptom**: Bold text renders as regular, italic renders as roman
- **Prevention**: Import all needed weights upfront
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');
  ```

**Emoji and special characters rendering inconsistently**
- Some fonts don't include emoji or international characters
- **Solution**: Use fallback stack with emoji font
  ```css
  body {
    font-family: 'Playfair Display', 'Noto Color Emoji', serif;
  }
  ```

**Font size appearing different in PDF vs browser**
- DPI/scaling differences between browser and PDF rendering
- **Prevention**: Use `pt` or absolute units for print; test actual PDF output
  ```css
  @media print {
    body { font-size: 12pt; }
    h1 { font-size: 28pt; }
  }
  ```

---

## 4. Image Loading and Timing Issues

### Asynchronous Content Problems

**Images not loaded before PDF generation**
- JavaScript fetches images asynchronously; PDF engine captures DOM before images load
- **Symptom**: Missing images, broken image icons in PDF
- **Solution**: Wait for images before generating PDF
  ```js
  await page.goto(url, { waitUntil: 'networkidle' });
  // Or explicit wait
  await page.waitForLoadState('networkidle');
  // For specific images
  await Promise.all(
    page.locator('img').all().map(img => img.screenshot())
  );
  ```

**Lazy-loaded images not captured**
- Intersection Observer / lazy-loading scripts run after PDF generation
- **Symptom**: Below-the-fold images missing
- **Solution**: Disable lazy loading or force load
  ```html
  <img src="..." loading="eager" />
  ```
  ```js
  // Force scroll through entire page to trigger lazy loaders
  await page.evaluate(() => {
    document.body.scrollIntoView();
    return new Promise(resolve => setTimeout(resolve, 1000));
  });
  ```

**External image URLs timing out**
- Network request to CDN or external server takes too long
- **Solution**: Set timeout and provide fallback
  ```js
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  ```

**Base64 vs URL images**
- Large base64-encoded images in HTML can cause rendering delays
- **Prevention**: Use URLs for large images; keep base64 for tiny icons
  ```html
  <!-- Good: URL -->
  <img src="https://cdn.example.com/image.jpg" />
  <!-- Avoid for large files: base64 -->
  <img src="data:image/jpeg;base64,/9j/4AAQSkZJRg..." />
  ```

### Content Loading Best Practices

| Scenario | Solution |
|----------|----------|
| Images not rendering | `waitUntil: 'networkidle'` + explicit image load check |
| Lazy-loaded images missing | Force page scroll before PDF or disable lazy loading |
| External images timing out | Increase timeout, use local fallbacks |
| Animated GIFs or videos | Only first frame captured; use static image instead |
| JavaScript-rendered content | Increase waitUntil timeout; wait for specific selector |

---

## 5. Performance Pitfalls with Large Documents

### Memory and Size Issues

**Large document causing crashes**
- Playwright has string length limits (~512MB PDF size limit)
- **Symptom**: "Cannot create a string longer than 0x1fffffe8 characters" error
- **Solution**: Split large documents into multiple PDFs or reduce image quality
  ```js
  // Reduce image quality
  await page.pdf({
    format: 'A4',
    // Add compression via browser print settings
    preferCSSPageSize: true
  });
  ```

**Memory exhaustion with many images**
- Each image loaded into memory before PDF creation
- **Prevention**: Optimize images before rendering
  ```js
  // Use sharp or similar to compress before embedding
  // Or load images progressively
  ```

**Slow rendering with complex CSS**
- Gradients, shadows, glassmorphism effects slow down rendering
- **Prevention**: Limit visual complexity; test performance
  ```css
  /* Avoid excessive shadows and filters */
  box-shadow: 0 4px 12px rgba(0,0,0,0.15); /* OK */
  box-shadow: 0 0 10px, 0 0 20px, 0 0 30px; /* TOO MANY */
  ```

**Too many pages = slow final output**
- 100+ page documents can take minutes to render
- **Prevention**: Monitor rendering time; consider async generation
  ```js
  console.time('pdf-generation');
  const pdf = await page.pdf({ ... });
  console.timeEnd('pdf-generation');
  ```

### Performance Prevention

| Pitfall | Prevention |
|---------|------------|
| Memory overload | Limit document to <100 pages; compress images |
| Rendering slowness | Reduce visual effects; test performance |
| Timeout during generation | Increase timeout; use async queue for batch jobs |
| Large output file | Compress images; reduce color depth |
| Chromium updates breaking output | Pin Chrome/Playwright version in package.json |

---

## 6. Specific Headless Chrome Limitations

**Graphical mode vs headless mode produce different output**
- `--print-to-pdf` flag differs from DevTools Protocol
- **Issue**: PDF from headless mode may look different than printed from GUI
- **Prevention**: Always test headless output; don't assume it matches browser print preview

**Colors adjusted for printing by default**
- Headless Chrome desaturates colors for "print efficiency"
- **Solution**: Force exact colors
  ```css
  * {
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }
  ```

**Header/footer templates have limitations**
- Scripts inside header/footer templates are NOT evaluated
- Page styles are NOT visible inside templates
- **Prevention**: Use simple HTML markup in headers/footers only; no CSS/JS
  ```js
  await page.pdf({
    headerTemplate: '<div style="font-size:10px;">Page</div>',
    footerTemplate: '<div style="text-align:right;font-size:10px;"><span class="pageNumber"></span></div>',
    displayHeaderFooter: true
  });
  ```

**Only Chromium supports PDF in Playwright**
- Firefox and WebKit don't have PDF output
- **Prevention**: Don't switch browsers for PDF; stick with Chromium

---

## 7. Prevention Strategies Summary

### For PULSEPRESS Specifically

1. **Glassmorphism Fallback**
   - Always provide solid background color when using `backdrop-filter`
   - Test PDF output explicitly before shipping
   - Document that glassmorphism is "HTML-only enhancement"

2. **Font Safety**
   - Use Google Fonts or self-hosted webfonts only
   - Import all weights upfront (regular, bold, italic, bold-italic)
   - Test with different font stacks

3. **Page Break Intelligence**
   - Apply `page-break-inside: avoid` to critical sections
   - Use `break-inside: avoid` (modern syntax) as primary, page-break-* as fallback
   - Never rely on specific page layout; assume content will reflow

4. **Image Handling**
   - Always set explicit width/height on images
   - Use `waitUntil: 'networkidle'` before PDF generation
   - Compress images before embedding; avoid large base64

5. **Testing Protocol**
   - Test every template with actual PDF rendering, not just browser
   - Use `debug` mode in Playwright to screenshot pages before PDF
   - Pin Playwright version in package.json to avoid output drift

6. **Performance Monitoring**
   - Add timing logs to identify slow renders
   - Monitor memory usage for large documents
   - Set reasonable timeouts (30-60 seconds) for document generation

7. **Error Handling**
   - Wrap PDF generation in try-catch with fallback to HTML preview
   - Log full error stack for debugging CI/production issues
   - Provide user feedback if PDF generation fails

### Testing Checklist

- [ ] Glassmorphism renders correctly (with solid fallback visible in PDF, not browser)
- [ ] Tables don't break mid-row
- [ ] Images load completely before PDF generation
- [ ] Page breaks occur at logical points (section headers, not mid-paragraph)
- [ ] All fonts render correctly (no missing bold/italic variants)
- [ ] Colors are not desaturated (check -webkit-print-color-adjust)
- [ ] Document renders in <30s for typical 20-page doc
- [ ] Works in CI without system font dependencies
- [ ] Header/footer templates don't include script tags
- [ ] Large documents (<100 pages) complete without memory errors

---

## References

- [Common Issues in HTML-to-PDF Printing](https://www.customjs.space/blog/html-to-pdf-issues/)
- [HTML to PDF Libraries Compared (2026)](https://www.nutrient.io/blog/html-to-pdf-in-javascript/)
- [MDN: Printing CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Printing)
- [Headless Chrome PDF Rendering Issues](https://www.api2pdf.com/resolved-pdf-is-rendering-blank-or-only-partially-with-headless-chrome/)
- [Chrome vs Headless Chrome PDF Differences](https://andre.arko.net/2025/05/25/chrome-headless-print-to-pdf/)
- [Playwright PDF Generation Guide](https://www.checklyhq.com/docs/learn/playwright/generating-pdfs/)
- [BrowserStack: Playwright PDF Guide](https://www.browserstack.com/guide/playwright-pdf-html-generation)
- [Backdrop Filter Issues in Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=497522)
- [Nested Backdrop-Filter Bug](https://havn.blog/2024/03/14/chromium-and-nested.html)
- [Medium: PDF Generation with Puppeteer/Playwright](https://medium.com/@rag0g/generating-pdfs-invoices-manuals-and-more-from-web-pages-using-puppeteer-playwright-27f0543999f0)
- [Creating PDFs from HTML + CSS in JavaScript](https://joyfill.io/blog/creating-pdfs-from-html-css-in-javascript-what-actually-works)

---

*Last updated: 2026-03-25 after initial research*
