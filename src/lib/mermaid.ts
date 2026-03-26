// Mermaid diagram support

export function processMermaid(html: string): string {
  // Find mermaid code blocks and convert to SVG placeholders
  // In a real implementation, this would use @mermaid-js/mermaid to render SVG server-side
  // For now, we create a styled container that indicates a diagram
  
  const mermaidRegex = /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g;
  
  return html.replace(mermaidRegex, (match, content) => {
    const diagramCode = content.trim();
    const diagramType = detectDiagramType(diagramCode);
    
    return `
      <div class="mermaid-diagram diagram-${diagramType}">
        <div class="mermaid-header">
          <span class="mermaid-icon">◈</span>
          <span class="mermaid-type">${diagramType.toUpperCase()}</span>
        </div>
        <pre class="mermaid-code">${escapeHtml(diagramCode)}</pre>
        <div class="mermaid-fallback">
          <p><em>Diagram: ${escapeHtml(diagramCode.split('\n')[0])}...</em></p>
        </div>
      </div>
    `;
  });
}

function detectDiagramType(code: string): string {
  const firstLine = code.split('\n')[0].toLowerCase();
  
  if (firstLine.includes('graph') || firstLine.includes('flowchart')) return 'flowchart';
  if (firstLine.includes('sequence')) return 'sequence';
  if (firstLine.includes('class')) return 'class';
  if (firstLine.includes('state')) return 'state';
  if (firstLine.includes('er')) return 'er';
  if (firstLine.includes('journey')) return 'journey';
  if (firstLine.includes('gantt')) return 'gantt';
  if (firstLine.includes('pie')) return 'pie';
  if (firstLine.includes('requirement')) return 'requirement';
  if (firstLine.includes('git')) return 'git';
  if (firstLine.includes('mindmap')) return 'mindmap';
  if (firstLine.includes('timeline')) return 'timeline';
  
  return 'diagram';
}

export function getMermaidStyles(): string {
  return `
    .mermaid-diagram {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 8px;
      margin: 1.5em 0;
      overflow: hidden;
    }
    
    .mermaid-header {
      background: var(--color-primary);
      color: white;
      padding: 0.5em 1em;
      font-size: 0.875em;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5em;
    }
    
    .mermaid-icon {
      font-size: 1.2em;
    }
    
    .mermaid-code {
      display: none; /* Hide source code in PDF */
    }
    
    .mermaid-fallback {
      padding: 1.5em;
      text-align: center;
      color: var(--color-text-muted);
      font-style: italic;
      background: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        rgba(0,0,0,0.02) 10px,
        rgba(0,0,0,0.02) 20px
      );
    }
    
    /* Diagram type colors */
    .diagram-flowchart .mermaid-header { background: #3b82f6; }
    .diagram-sequence .mermaid-header { background: #8b5cf6; }
    .diagram-class .mermaid-header { background: #10b981; }
    .diagram-state .mermaid-header { background: #f59e0b; }
    .diagram-er .mermaid-header { background: #ef4444; }
    .diagram-gantt .mermaid-header { background: #06b6d4; }
  `;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
