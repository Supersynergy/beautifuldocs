// QR Code generation for URLs in PDFs

export function generateQrCodeSvg(url: string, size: number = 100): string {
  // Simplified QR code representation
  // In production, use a library like qrcode-svg or node-qrcode
  
  const pattern = generateQrPattern(url);
  const cellSize = Math.floor(size / pattern.length);
  const actualSize = cellSize * pattern.length;
  
  let svg = `<svg class="qr-code" width="${actualSize}" height="${actualSize}" viewBox="0 0 ${pattern.length} ${pattern.length}">`;
  svg += `<rect width="${pattern.length}" height="${pattern.length}" fill="white"/>`;
  
  for (let y = 0; y < pattern.length; y++) {
    for (let x = 0; x < pattern.length; x++) {
      if (pattern[y][x]) {
        svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="black"/>`;
      }
    }
  }
  
  svg += '</svg>';
  return svg;
}

// Simple hash-based pattern for demo (not real QR)
function generateQrPattern(url: string): boolean[][] {
  const size = 25;
  const pattern: boolean[][] = [];
  let hash = 0;
  
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) - hash) + url.charCodeAt(i);
    hash = hash & hash;
  }
  
  // Position patterns (corners)
  for (let y = 0; y < size; y++) {
    pattern[y] = [];
    for (let x = 0; x < size; x++) {
      // Corner position patterns
      const isCorner = 
        (x < 7 && y < 7) || // Top-left
        (x > size - 8 && y < 7) || // Top-right
        (x < 7 && y > size - 8); // Bottom-left
      
      if (isCorner) {
        // Position pattern design
        const cx = x < 7 ? x : x - (size - 7);
        const cy = y < 7 ? y : y - (size - 7);
        const dist = Math.max(Math.abs(cx - 3), Math.abs(cy - 3));
        pattern[y][x] = dist === 3 || dist === 1 || (dist === 0 && cx === 3 && cy === 3);
      } else {
        // Data pattern from hash
        const idx = y * size + x;
        pattern[y][x] = ((hash >> (idx % 32)) & 1) === 1;
      }
    }
  }
  
  return pattern;
}

export function processQrCodes(html: string): string {
  // Find URLs and add QR codes next to them
  const urlRegex = /<a[^>]*href="(https?:\/\/[^"]+)"[^>]*>([^<]*)<\/a>/g;
  
  return html.replace(urlRegex, (match, url, text) => {
    // Only add QR for full URLs, not relative links
    if (url.length > 30 || text !== url) {
      return match; // Skip if text is different from URL (hidden links)
    }
    
    const qrSvg = generateQrCodeSvg(url, 60);
    return `
      <span class="qr-link">
        ${match}
        <span class="qr-popup">${qrSvg}</span>
      </span>
    `;
  });
}

export function getQrStyles(): string {
  return `
    .qr-link {
      position: relative;
      display: inline-block;
    }
    
    .qr-popup {
      display: none;
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      padding: 5px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      z-index: 100;
    }
    
    @media print {
      .qr-popup {
        display: inline-block !important;
        position: static;
        transform: none;
        margin-left: 10px;
        box-shadow: none;
        vertical-align: middle;
      }
      
      .qr-code {
        width: 50px !important;
        height: 50px !important;
      }
    }
    
    .qr-code {
      display: inline-block;
      vertical-align: middle;
    }
  `;
}

// Standalone QR code for a URL
export function createQrBlock(url: string, label?: string): string {
  const qrSvg = generateQrCodeSvg(url, 120);
  return `
    <div class="qr-block">
      ${qrSvg}
      ${label ? `<p class="qr-label">${escapeHtml(label)}</p>` : ''}
      <p class="qr-url">${escapeHtml(url)}</p>
    </div>
  `;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
