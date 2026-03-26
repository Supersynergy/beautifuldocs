// CSS Effects Library: gradients, glassmorphism, glows

export function getEffectStyles(): string {
  return `
    /* ==========================================
       GRADIENTS
       ========================================== */
    
    /* Text gradients */
    .gradient-text {
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .gradient-purple-cyan {
      background-image: linear-gradient(135deg, #a855f7 0%, #06b6d4 100%);
    }
    
    .gradient-orange-pink {
      background-image: linear-gradient(135deg, #f97316 0%, #ec4899 100%);
    }
    
    .gradient-blue-purple {
      background-image: linear-gradient(135deg, #3b82f6 0%, #a855f7 100%);
    }
    
    .gradient-amber-red {
      background-image: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
    }
    
    .gradient-emerald-cyan {
      background-image: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
    }
    
    .gradient-rose-orange {
      background-image: linear-gradient(135deg, #f43f5e 0%, #f97316 100%);
    }
    
    /* Background gradients */
    .bg-gradient-purple {
      background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
    }
    
    .bg-gradient-cyan {
      background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
    }
    
    .bg-gradient-warm {
      background: linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ef4444 100%);
    }
    
    .bg-gradient-cool {
      background: linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%);
    }
    
    .bg-gradient-dark {
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
    }
    
    /* Aurora effect (static for PDF) */
    .aurora {
      background: 
        radial-gradient(ellipse at 20% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
        radial-gradient(ellipse at 50% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 60%);
    }
    
    /* Mesh gradient */
    .mesh-gradient {
      background: 
        radial-gradient(at 40% 20%, hsla(270,60%,60%,1) 0px, transparent 50%),
        radial-gradient(at 80% 0%, hsla(190,80%,60%,1) 0px, transparent 50%),
        radial-gradient(at 0% 50%, hsla(340,80%,70%,1) 0px, transparent 50%),
        radial-gradient(at 80% 50%, hsla(260,70%,60%,1) 0px, transparent 50%),
        radial-gradient(at 0% 100%, hsla(290,60%,60%,1) 0px, transparent 50%),
        hsla(240,20%,10%,1);
    }
    
    /* ==========================================
       GLASSMORPHISM
       ========================================== */
    
    .glass {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
    }
    
    .glass-dark {
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
    }
    
    .glass-light {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 12px;
    }
    
    /* ==========================================
       GLOWS
       ========================================== */
    
    .glow-purple {
      box-shadow: 0 0 40px rgba(168, 85, 247, 0.3);
    }
    
    .glow-cyan {
      box-shadow: 0 0 40px rgba(6, 182, 212, 0.3);
    }
    
    .glow-amber {
      box-shadow: 0 0 40px rgba(245, 158, 11, 0.3);
    }
    
    .glow-pink {
      box-shadow: 0 0 40px rgba(236, 72, 153, 0.3);
    }
    
    .glow-subtle {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    /* Text glow (for dark themes) */
    .text-glow {
      text-shadow: 0 0 20px currentColor;
    }
    
    /* ==========================================
       PATTERNS (CSS-only)
       ========================================== */
    
    .pattern-dots {
      background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
      background-size: 20px 20px;
      opacity: 0.1;
    }
    
    .pattern-grid {
      background-image: 
        linear-gradient(to right, currentColor 1px, transparent 1px),
        linear-gradient(to bottom, currentColor 1px, transparent 1px);
      background-size: 40px 40px;
      opacity: 0.05;
    }
    
    .pattern-lines {
      background-image: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        currentColor 10px,
        currentColor 11px
      );
      opacity: 0.03;
    }
    
    /* ==========================================
       DECORATIVE ELEMENTS
       ========================================== */
    
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      opacity: 0.5;
      pointer-events: none;
    }
    
    .divider-gradient {
      height: 2px;
      background: linear-gradient(90deg, transparent 0%, var(--color-primary) 50%, transparent 100%);
      margin: 2em 0;
      border: none;
    }
    
    .divider-dashed {
      border: none;
      border-top: 2px dashed var(--color-border);
      margin: 2em 0;
    }
    
    /* Accent line */
    .accent-line {
      width: 60px;
      height: 4px;
      background: var(--color-primary);
      border-radius: 2px;
      margin: 1em 0;
    }
    
    .accent-line-center {
      margin-left: auto;
      margin-right: auto;
    }
    
    /* Floating shapes */
    .shape-blob {
      border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    }
  `;
}
