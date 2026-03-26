// Component CSS Library

export function getComponentStyles(): string {
  return `
    /* ==========================================
       CARDS
       ========================================== */
    
    .card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 12px;
      padding: 1.5em;
      margin: 1em 0;
    }
    
    .card-elevated {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 12px;
      padding: 1.5em;
      margin: 1em 0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    .card-outlined {
      background: transparent;
      border: 2px solid var(--color-border);
      border-radius: 12px;
      padding: 1.5em;
      margin: 1em 0;
    }
    
    .card-filled {
      background: var(--color-primary);
      color: white;
      border-radius: 12px;
      padding: 1.5em;
      margin: 1em 0;
    }
    
    .card-filled h1, .card-filled h2, .card-filled h3,
    .card-filled h4, .card-filled h5, .card-filled h6 {
      color: white;
      margin-top: 0;
    }
    
    /* ==========================================
       TAGS / PILLS
       ========================================== */
    
    .tag {
      display: inline-block;
      padding: 0.25em 0.75em;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 9999px;
      font-size: 0.875em;
      font-weight: 500;
      color: var(--color-text-muted);
      margin: 0.25em;
    }
    
    .tag-primary {
      background: var(--color-primary);
      color: white;
      border-color: var(--color-primary);
    }
    
    .tag-secondary {
      background: var(--color-secondary);
      color: white;
      border-color: var(--color-secondary);
    }
    
    .tag-accent {
      background: var(--color-accent);
      color: white;
      border-color: var(--color-accent);
    }
    
    .tag-outline {
      background: transparent;
      border: 1px solid currentColor;
    }
    
    /* ==========================================
       METRICS
       ========================================== */
    
    .metric {
      text-align: center;
      padding: 1.5em;
    }
    
    .metric-value {
      font-size: 3em;
      font-weight: 700;
      line-height: 1;
      color: var(--color-primary);
      margin-bottom: 0.25em;
    }
    
    .metric-label {
      font-size: 0.875em;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .metric-change {
      font-size: 0.875em;
      margin-top: 0.5em;
    }
    
    .metric-change-positive {
      color: #10b981;
    }
    
    .metric-change-negative {
      color: #ef4444;
    }
    
    /* ==========================================
       PROGRESS BARS
       ========================================== */
    
    .progress {
      width: 100%;
      height: 8px;
      background: var(--color-surface);
      border-radius: 4px;
      overflow: hidden;
      margin: 0.5em 0;
    }
    
    .progress-bar {
      height: 100%;
      background: var(--color-primary);
      border-radius: 4px;
      transition: width 0.3s ease;
    }
    
    .progress-bar-secondary {
      background: var(--color-secondary);
    }
    
    .progress-bar-accent {
      background: var(--color-accent);
    }
    
    .progress-label {
      display: flex;
      justify-content: space-between;
      font-size: 0.875em;
      color: var(--color-text-muted);
      margin-bottom: 0.25em;
    }
    
    /* ==========================================
       CALLOUTS / ALERTS
       ========================================== */
    
    .callout {
      padding: 1em 1.25em;
      border-radius: 8px;
      margin: 1em 0;
      border-left: 4px solid var(--color-primary);
      background: var(--color-surface);
    }
    
    .callout-info {
      border-left-color: #3b82f6;
      background: rgba(59, 130, 246, 0.1);
    }
    
    .callout-success {
      border-left-color: #10b981;
      background: rgba(16, 185, 129, 0.1);
    }
    
    .callout-warning {
      border-left-color: #f59e0b;
      background: rgba(245, 158, 11, 0.1);
    }
    
    .callout-error {
      border-left-color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
    }
    
    .callout-title {
      font-weight: 600;
      margin-bottom: 0.25em;
    }
    
    .callout p:last-child {
      margin-bottom: 0;
    }
    
    /* ==========================================
       COLUMNS / GRID
       ========================================== */
    
    .columns-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5em;
    }
    
    .columns-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 1.5em;
    }
    
    .columns-4 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 1em;
    }
    
    /* ==========================================
       SPACING UTILITIES
       ========================================== */
    
    .mt-0 { margin-top: 0; }
    .mt-1 { margin-top: 0.5em; }
    .mt-2 { margin-top: 1em; }
    .mt-3 { margin-top: 1.5em; }
    .mt-4 { margin-top: 2em; }
    
    .mb-0 { margin-bottom: 0; }
    .mb-1 { margin-bottom: 0.5em; }
    .mb-2 { margin-bottom: 1em; }
    .mb-3 { margin-bottom: 1.5em; }
    .mb-4 { margin-bottom: 2em; }
    
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .text-muted { color: var(--color-text-muted); }
    .text-primary { color: var(--color-primary); }
    .text-accent { color: var(--color-accent); }
    
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .font-mono { font-family: monospace; }
  `;
}
