#!/usr/bin/env bun
// BeautifulDocs Claude Code Skill

import { readFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { parseMarkdown } from '../src/lib/parser.js';
import { generateHtml } from '../src/lib/template.js';
import { generatePdf } from '../src/lib/pdf.js';

interface SkillContext {
  topic: string;
  format: 'article' | 'slides' | 'report';
  template: string;
  outputPath?: string;
}

export async function beautifuldocsSkill(
  input: string,
  options: Partial<SkillContext> = {}
): Promise<{ success: boolean; outputPath?: string; message: string }> {
  const context: SkillContext = {
    topic: input,
    format: options.format || 'article',
    template: options.template || 'editorial',
    outputPath: options.outputPath,
  };

  try {
    // Check if input is a file path or topic
    const isFile = input.endsWith('.md') && existsSync(resolve(input));
    
    let markdown: string;
    let docTitle: string;

    if (isFile) {
      // Process existing markdown file
      const content = readFileSync(resolve(input), 'utf-8');
      const doc = parseMarkdown(content);
      markdown = content;
      docTitle = doc.title;
    } else {
      // Generate content via AI (simplified - in real use would call OpenRouter)
      const frontmatter = `---
title: ${input}
template: ${context.template}
format: ${context.format === 'slides' ? '16:9' : 'a4'}
---

`;
      markdown = frontmatter + `# ${input}\n\nGenerated document about ${input}.`;
      docTitle = input;
    }

    const doc = parseMarkdown(markdown);
    const format = (doc.frontmatter.format || context.format) as 'a4' | '16:9';
    const template = (doc.frontmatter.template || context.template) as string;

    const html = generateHtml(doc, { format, template });

    const outputPath = context.outputPath || `./${docTitle.toLowerCase().replace(/\s+/g, '-')}.pdf`;
    const resolvedOutput = resolve(outputPath);
    
    if (!existsSync(dirname(resolvedOutput))) {
      mkdirSync(dirname(resolvedOutput), { recursive: true });
    }

    await generatePdf(html, {
      format,
      outputPath: resolvedOutput,
      printBackground: true,
    });

    return {
      success: true,
      outputPath: resolvedOutput,
      message: `✅ PDF generated: ${resolvedOutput}`,
    };

  } catch (error) {
    return {
      success: false,
      message: `❌ Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

// CLI entry point for skill
if (import.meta.main) {
  const input = process.argv[2];
  const format = (process.argv[3] as 'article' | 'slides' | 'report') || 'article';
  const template = process.argv[4] || 'editorial';

  if (!input) {
    console.log('Usage: beautifuldocs <topic|file.md> [format] [template]');
    console.log('  format: article, slides, report');
    console.log('  template: editorial, dark, minimal, neon');
    process.exit(1);
  }

  beautifuldocsSkill(input, { format, template }).then(result => {
    console.log(result.message);
    process.exit(result.success ? 0 : 1);
  });
}
