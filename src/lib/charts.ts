// Chart.js integration for data visualization in PDFs
// Server-side rendering to SVG/Canvas

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea';
  data: {
    labels: string[];
    datasets: Array<{
      label?: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string;
      borderWidth?: number;
    }>;
  };
  options?: Record<string, unknown>;
}

// Simple SVG chart renderer (no external dependencies)
export function renderChartToSvg(chartData: ChartData, width = 600, height = 400): string {
  switch (chartData.type) {
    case 'bar':
      return renderBarChart(chartData, width, height);
    case 'line':
      return renderLineChart(chartData, width, height);
    case 'pie':
    case 'doughnut':
      return renderPieChart(chartData, width, height, chartData.type === 'doughnut');
    default:
      return renderBarChart(chartData, width, height);
  }
}

function renderBarChart(chart: ChartData, width: number, height: number): string {
  const { labels, datasets } = chart.data;
  const padding = { top: 40, right: 40, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const maxValue = Math.max(...datasets.flatMap(d => d.data));
  const barGroupWidth = chartWidth / labels.length;
  const barWidth = (barGroupWidth * 0.8) / datasets.length;
  
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  
  let svg = `<svg class="chart bar-chart" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  
  // Background
  svg += `<rect width="${width}" height="${height}" fill="#fafafa"/>`;
  
  // Grid lines
  for (let i = 0; i <= 5; i++) {
    const y = padding.top + (chartHeight * i / 5);
    const value = Math.round(maxValue * (1 - i / 5));
    svg += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#e5e7eb" stroke-width="1"/>`;
    svg += `<text x="${padding.left - 10}" y="${y + 4}" text-anchor="end" font-size="12" fill="#6b7280">${value}</text>`;
  }
  
  // Bars
  datasets.forEach((dataset, datasetIndex) => {
    dataset.data.forEach((value, i) => {
      const x = padding.left + (i * barGroupWidth) + (barGroupWidth * 0.1) + (datasetIndex * barWidth);
      const barHeight = (value / maxValue) * chartHeight;
      const y = padding.top + chartHeight - barHeight;
      const color = dataset.backgroundColor?.[datasetIndex] || colors[datasetIndex % colors.length];
      
      svg += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${color}" rx="2"/>`;
    });
  });
  
  // Labels
  labels.forEach((label, i) => {
    const x = padding.left + (i * barGroupWidth) + (barGroupWidth / 2);
    svg += `<text x="${x}" y="${height - 20}" text-anchor="middle" font-size="12" fill="#374151">${escapeXml(label)}</text>`;
  });
  
  // Title
  if (datasets[0]?.label) {
    svg += `<text x="${width / 2}" y="25" text-anchor="middle" font-size="16" font-weight="600" fill="#111827">${escapeXml(datasets[0].label)}</text>`;
  }
  
  svg += '</svg>';
  return svg;
}

function renderLineChart(chart: ChartData, width: number, height: number): string {
  const { labels, datasets } = chart.data;
  const padding = { top: 40, right: 40, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const allValues = datasets.flatMap(d => d.data);
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues, 0);
  const valueRange = maxValue - minValue;
  
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  
  let svg = `<svg class="chart line-chart" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  svg += `<rect width="${width}" height="${height}" fill="#fafafa"/>`;
  
  // Grid
  for (let i = 0; i <= 5; i++) {
    const y = padding.top + (chartHeight * i / 5);
    svg += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#e5e7eb" stroke-width="1"/>`;
  }
  
  // Lines
  datasets.forEach((dataset, datasetIndex) => {
    const color = dataset.borderColor || colors[datasetIndex % colors.length];
    let path = '';
    
    dataset.data.forEach((value, i) => {
      const x = padding.left + (i / (labels.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;
      path += (i === 0 ? 'M' : 'L') + `${x},${y}`;
    });
    
    svg += `<path d="${path}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
    
    // Points
    dataset.data.forEach((value, i) => {
      const x = padding.left + (i / (labels.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;
      svg += `<circle cx="${x}" cy="${y}" r="5" fill="${color}" stroke="white" stroke-width="2"/>`;
    });
  });
  
  // Labels
  labels.forEach((label, i) => {
    const x = padding.left + (i / (labels.length - 1 || 1)) * chartWidth;
    svg += `<text x="${x}" y="${height - 20}" text-anchor="middle" font-size="12" fill="#374151">${escapeXml(label)}</text>`;
  });
  
  svg += '</svg>';
  return svg;
}

function renderPieChart(chart: ChartData, width: number, height: number, isDoughnut: boolean): string {
  const { labels, datasets } = chart.data;
  const data = datasets[0].data;
  const total = data.reduce((a, b) => a + b, 0);
  
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 40;
  const innerRadius = isDoughnut ? radius * 0.5 : 0;
  
  let svg = `<svg class="chart pie-chart" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  svg += `<rect width="${width}" height="${height}" fill="#fafafa"/>`;
  
  let currentAngle = -Math.PI / 2;
  
  data.forEach((value, i) => {
    const angle = (value / total) * 2 * Math.PI;
    const x1 = centerX + Math.cos(currentAngle) * radius;
    const y1 = centerY + Math.sin(currentAngle) * radius;
    const x2 = centerX + Math.cos(currentAngle + angle) * radius;
    const y2 = centerY + Math.sin(currentAngle + angle) * radius;
    
    const largeArc = angle > Math.PI ? 1 : 0;
    const color = colors[i % colors.length];
    
    if (isDoughnut) {
      const ix1 = centerX + Math.cos(currentAngle) * innerRadius;
      const iy1 = centerY + Math.sin(currentAngle) * innerRadius;
      const ix2 = centerX + Math.cos(currentAngle + angle) * innerRadius;
      const iy2 = centerY + Math.sin(currentAngle + angle) * innerRadius;
      
      const path = `M ${ix1} ${iy1} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1}`;
      svg += `<path d="${path}" fill="${color}" stroke="white" stroke-width="2"/>`;
    } else {
      const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      svg += `<path d="${path}" fill="${color}" stroke="white" stroke-width="2"/>`;
    }
    
    // Legend
    const legendY = 20 + i * 20;
    svg += `<rect x="${width - 120}" y="${legendY}" width="12" height="12" fill="${color}" rx="2"/>`;
    svg += `<text x="${width - 100}" y="${legendY + 10}" font-size="12" fill="#374151">${escapeXml(labels[i])} (${Math.round(value/total*100)}%)</text>`;
    
    currentAngle += angle;
  });
  
  svg += '</svg>';
  return svg;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Parse chart from markdown code block
export function parseChartBlock(content: string): ChartData | null {
  try {
    const lines = content.trim().split('\n');
    const type = lines[0].trim() as ChartData['type'];
    
    // Simple CSV-like format: Label,Value1,Value2
    const dataLines = lines.slice(1).filter(l => l.trim());
    const headers = dataLines[0].split(',').map(h => h.trim());
    const labels = headers.slice(1);
    
    const datasets = dataLines.slice(1).map((line, idx) => {
      const values = line.split(',').map(v => v.trim());
      return {
        label: values[0],
        data: values.slice(1).map(v => parseFloat(v) || 0),
      };
    });
    
    return {
      type,
      data: {
        labels,
        datasets,
      },
    };
  } catch {
    return null;
  }
}

export function getChartStyles(): string {
  return `
    .chart {
      max-width: 100%;
      height: auto;
      margin: 1.5em 0;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    @media print {
      .chart {
        max-width: 100% !important;
        page-break-inside: avoid;
      }
    }
  `;
}
