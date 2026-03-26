import { chromium, type Browser, type Page } from 'playwright';
import type { PDFOptions } from './types.js';

export async function generatePdf(
  html: string,
  options: PDFOptions
): Promise<string> {
  const { format, outputPath, printBackground = true } = options;
  
  let browser: Browser | null = null;
  
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Set content and wait for fonts to load
    await page.setContent(html, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait a bit for any web fonts to load
    await page.waitForTimeout(500);
    
    // Configure PDF options based on format
    const pdfOptions: Parameters<Page['pdf']>[0] = {
      path: outputPath,
      printBackground,
      preferCSSPageSize: true,
    };
    
    if (format === '16:9') {
      pdfOptions.width = '1920px';
      pdfOptions.height = '1080px';
      pdfOptions.margin = { top: '0', right: '0', bottom: '0', left: '0' };
    } else if (format === 'a4') {
      pdfOptions.format = 'A4';
      pdfOptions.margin = { 
        top: '20mm', 
        right: '20mm', 
        bottom: '20mm', 
        left: '20mm' 
      };
    } else if (format === 'letter') {
      pdfOptions.format = 'Letter';
      pdfOptions.margin = { 
        top: '20mm', 
        right: '20mm', 
        bottom: '20mm', 
        left: '20mm' 
      };
    }
    
    await page.pdf(pdfOptions);
    
    return outputPath;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export async function generateHtmlPreview(
  html: string,
  outputPath: string
): Promise<string> {
  const { writeFileSync } = await import('fs');
  writeFileSync(outputPath, html);
  return outputPath;
}
