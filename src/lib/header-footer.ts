// Header and Footer generation for PDF

export interface HeaderFooterOptions {
  header?: string;
  footer?: string;
  pageNumbers?: boolean;
  totalPages?: boolean;
  logo?: string;
}

export function generateHeaderFooterCss(): string {
  return `
    /* Header/Footer for Paged Media */
    @page {
      @top-center {
        content: var(--header-text, "");
        font-size: 9pt;
        color: var(--color-text-muted);
        border-bottom: 0.5px solid var(--color-border);
        padding-bottom: 5mm;
      }
      
      @bottom-center {
        content: var(--footer-text, "") " " var(--page-text, "");
        font-size: 9pt;
        color: var(--color-text-muted);
        border-top: 0.5px solid var(--color-border);
        padding-top: 5mm;
      }
    }
    
    /* Alternative: Running headers via CSS (better browser support) */
    .running-header {
      position: running(header);
      font-size: 9pt;
      color: var(--color-text-muted);
      text-align: center;
      border-bottom: 0.5px solid var(--color-border);
      padding-bottom: 5mm;
      margin-bottom: 10mm;
    }
    
    .running-footer {
      position: running(footer);
      font-size: 9pt;
      color: var(--color-text-muted);
      text-align: center;
      border-top: 0.5px solid var(--color-border);
      padding-top: 5mm;
      margin-top: 10mm;
    }
    
    @media print {
      .running-header {
        display: block;
      }
      .running-footer {
        display: block;
      }
    }
  `;
}

export function generateHeaderFooterHtml(options: HeaderFooterOptions): string {
  const parts: string[] = [];
  
  if (options.header) {
    parts.push(`<div class="running-header">${escapeHtml(options.header)}</div>`);
  }
  
  if (options.footer || options.pageNumbers) {
    let footerText = '';
    if (options.footer) footerText += escapeHtml(options.footer);
    if (options.pageNumbers) {
      footerText += options.footer ? ' - ' : '';
      footerText += '<span class="pageNumber"></span>';
      if (options.totalPages) {
        footerText += ' / <span class="totalPages"></span>';
      }
    }
    parts.push(`<div class="running-footer">${footerText}</div>`);
  }
  
  return parts.join('\n');
}

export function generateHeaderFooterScript(): string {
  return `
    <script>
      // Add page numbers after PDF generation
      (function() {
        const pages = document.querySelectorAll('.page');
        pages.forEach((page, i) => {
          const pageNum = page.querySelector('.pageNumber');
          const totalNum = page.querySelector('.totalPages');
          if (pageNum) pageNum.textContent = (i + 1);
          if (totalNum) totalNum.textContent = pages.length;
        });
      })();
    </script>
  `;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
