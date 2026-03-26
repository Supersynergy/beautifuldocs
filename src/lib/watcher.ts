// Watch mode for live preview

import { watch } from 'fs';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { parseMarkdown } from './parser.js';
import { generateHtml } from './template.js';
import { generateHtmlPreview } from './pdf.js';

export async function startWatchMode(
  inputFile: string,
  options: { format?: string; template?: string; port?: number }
): Promise<void> {
  const inputPath = resolve(inputFile);
  const outputDir = dirname(inputPath);
  const port = options.port || 3456;
  
  console.log(`👀 Watching ${inputFile} for changes...`);
  console.log(`🌐 Preview: http://localhost:${port}`);
  console.log(` Press Ctrl+C to stop\n`);
  
  // Build function
  const rebuild = async () => {
    try {
      const content = readFileSync(inputPath, 'utf-8');
      const doc = parseMarkdown(content);
      const format = (doc.frontmatter.format || options.format || 'a4') as 'a4' | '16:9';
      const template = (doc.frontmatter.template || options.template || 'editorial') as string;
      
      const html = generateHtml(doc, { format, template });
      
      // Start dev server with the HTML
      const server = Bun.serve({
        port,
        fetch() {
          return new Response(html, {
            headers: { 'Content-Type': 'text/html' },
          });
        },
      });
      
      console.log(`✅ Rebuilt at ${new Date().toLocaleTimeString()}`);
      return server;
    } catch (error) {
      console.error('❌ Build error:', error);
      return null;
    }
  };
  
  // Initial build
  let server = await rebuild();
  
  // Watch for changes
  const watcher = watch(inputPath, async (event) => {
    if (event === 'change') {
      console.log(`📝 File changed, rebuilding...`);
      if (server) {
        server.stop();
      }
      server = await rebuild();
    }
  });
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n👋 Stopping watch mode...');
    watcher.close();
    if (server) {
      server.stop();
    }
    process.exit(0);
  });
  
  // Keep alive
  await new Promise(() => {});
}
