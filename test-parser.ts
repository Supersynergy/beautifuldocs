import { parseMarkdown } from './src/lib/parser.js';
import { readFileSync } from 'fs';

const content = readFileSync('./test.md', 'utf-8');
const result = parseMarkdown(content);

console.log('=== Frontmatter ===');
console.log(result.frontmatter);

console.log('\n=== Title ===');
console.log(result.title);

console.log('\n=== HTML Preview (first 500 chars) ===');
console.log(result.html.slice(0, 500));
