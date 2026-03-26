#!/usr/bin/env bun

import { Command } from 'commander';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname, basename, extname } from 'path';
import { parseMarkdown } from './lib/parser.js';
import { generateHtml } from './lib/template.js';
import { generatePdf, generateHtmlPreview } from './lib/pdf.js';
import { startWatchMode } from './lib/watcher.js';
import { glob } from 'glob';
import type { PDFOptions } from './lib/types.js';

const program = new Command();

program
  .name('beautifuldocs')
  .description('Beautiful PDFs, slides & documents from Markdown')
  .version('0.1.0');

program
  .command('build')
  .description('Build PDF from Markdown file')
  .argument('<file>', 'Markdown file to convert')
  .option('-o, --output <path>', 'Output file path')
  .option('-f, --format <format>', 'Output format (a4, 16:9, letter)', 'a4')
  .option('-t, --template <name>', 'Template to use', 'editorial')
  .option('--html', 'Generate HTML preview only (no PDF)')
  .action(async (file: string, options) => {
    try {
      const inputPath = resolve(file);
      
      // Check if file exists
      if (!existsSync(inputPath)) {
        console.error(`❌ Error: File not found: ${file}`);
        process.exit(1);
      }
      
      // Read and parse markdown
      console.log(`📖 Reading ${file}...`);
      const content = readFileSync(inputPath, 'utf-8');
      const doc = parseMarkdown(content);
      
      // Determine format and template from frontmatter or options
      const format = doc.frontmatter.format || options.format || 'a4';
      const template = doc.frontmatter.template || options.template || 'editorial';
      
      // Generate output path
      let outputPath: string;
      if (options.output) {
        outputPath = resolve(options.output);
      } else {
        const dir = dirname(inputPath);
        const name = basename(inputPath, extname(inputPath));
        outputPath = resolve(dir, `${name}.pdf`);
      }
      
      // Ensure output directory exists
      const outputDir = dirname(outputPath);
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }
      
      // Generate HTML
      console.log(`🎨 Generating HTML (${template} template)...`);
      const html = generateHtml(doc, { format, template });
      
      if (options.html) {
        // Generate HTML preview only
        const htmlPath = outputPath.replace(/\.pdf$/, '.html');
        await generateHtmlPreview(html, htmlPath);
        console.log(`✅ HTML preview generated: ${htmlPath}`);
      } else {
        // Generate PDF
        console.log(`📄 Generating PDF (${format} format)...`);
        const pdfOptions: PDFOptions = {
          format: format as 'a4' | '16:9' | 'letter',
          outputPath,
          printBackground: true,
        };
        
        await generatePdf(html, pdfOptions);
        console.log(`✅ PDF generated: ${outputPath}`);
      }
      
    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('init')
  .description('Initialize a new BeautifulDocs project')
  .argument('[dir]', 'Directory to initialize', '.')
  .action((dir: string) => {
    const targetDir = resolve(dir);
    
    // Create directory if it doesn't exist
    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true });
    }
    
    // Create sample markdown file
    const sampleContent = `---
title: My First Document
template: editorial
format: a4
---

# Welcome to BeautifulDocs

This is your first document. Edit this file and run:

\`\`\`bash
beautifuldocs build document.md
\`\`\`

## Features

- Beautiful templates
- Multiple formats (A4, 16:9 slides)
- Custom color palettes
- Code syntax highlighting

## Next Steps

1. Edit this file with your content
2. Try different templates: \\\`editorial\\\`, \\\`dark\\\`, \\\`minimal\\\`, \\\`neon\\\`
3. Experiment with formats: \\\`a4\\\`, \\\`16:9\\\`
`;
    
    const samplePath = resolve(targetDir, 'document.md');
    if (!existsSync(samplePath)) {
      const { writeFileSync } = require('fs');
      writeFileSync(samplePath, sampleContent);
      console.log(`✅ Created ${samplePath}`);
    }
    
    console.log(`\n🎉 BeautifulDocs project initialized in ${targetDir}`);
    console.log('\nNext steps:');
    console.log(`  cd ${dir === '.' ? '.' : dir}`);
    console.log('  beautifuldocs build document.md');
  });

program
  .command('watch')
  .description('Watch file for changes and serve live preview')
  .argument('<file>', 'Markdown file to watch')
  .option('-f, --format <format>', 'Output format', 'a4')
  .option('-t, --template <name>', 'Template to use', 'editorial')
  .option('-p, --port <number>', 'Port for preview server', '3456')
  .action(async (file: string, options) => {
    await startWatchMode(file, {
      format: options.format,
      template: options.template,
      port: parseInt(options.port),
    });
  });

program
  .command('batch')
  .description('Build multiple PDFs from glob pattern')
  .argument('<pattern>', 'Glob pattern for markdown files (e.g., "docs/*.md")')
  .option('-o, --output <dir>', 'Output directory', './output')
  .option('-f, --format <format>', 'Output format', 'a4')
  .option('-t, --template <name>', 'Template to use', 'editorial')
  .action(async (pattern: string, options) => {
    try {
      const files = await glob(pattern);
      
      if (files.length === 0) {
        console.log(`No files found matching: ${pattern}`);
        return;
      }
      
      console.log(`Found ${files.length} files to process...\n`);
      
      for (const file of files) {
        console.log(`Processing: ${file}`);
        const content = readFileSync(file, 'utf-8');
        const doc = parseMarkdown(content);
        const format = (doc.frontmatter.format || options.format) as 'a4' | '16:9';
        const template = (doc.frontmatter.template || options.template) as string;
        
        const outputPath = resolve(options.output, `${basename(file, extname(file))}.pdf`);
        
        if (!existsSync(options.output)) {
          mkdirSync(options.output, { recursive: true });
        }
        
        const html = generateHtml(doc, { format, template });
        await generatePdf(html, {
          format,
          outputPath,
          printBackground: true,
        });
        
        console.log(`  ✅ ${outputPath}\n`);
      }
      
      console.log(`Batch complete! Processed ${files.length} files.`);
    } catch (error) {
      console.error('❌ Error:', error);
      process.exit(1);
    }
  });

program.parse();
