// SVG charts, drawn by hand from the data: no chart library, no
// network. Each builder returns an SVG string with a <title> for
// accessibility and a table fallback note in the page around it.

const TEAL = '#0f766e';
const TEAL_LIGHT = '#5eead4';
const AMBER = '#d97706';
const INK = '#12303f';
const GRID = '#d8ddd8';
const LABEL = '#5a6b66';

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
}

function niceMax(max) {
  const p = 10 ** Math.floor(Math.log10(max));
  const n = max / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}

function formatValue(v) {
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

// Vertical bars for a year series: {2021: 4.1, ...}
export function barChart(series, opts = {}) {
  const years = Object.keys(series).map(Number).sort((a, b) => a - b);
  const values = years.map((y) => series[y]);
  const max = niceMax(Math.max(...values) * 1.08);
  const w = opts.width ?? 640;
  const h = opts.height ?? 300;
  const padL = 52;
  const padB = 30;
  const padT = 26;
  const plotW = w - padL - 16;
  const plotH = h - padT - padB;
  const slot = plotW / years.length;
  const barW = Math.min(56, slot * 0.58);
  const gridlines = [0, 0.5, 1].map((f) => {
    const v = max * f;
    const y = padT + plotH - (v / max) * plotH;
    return `<line x1="${padL}" y1="${y}" x2="${w - 16}" y2="${y}" stroke="${GRID}" stroke-width="1"/><text x="${padL - 8}" y="${y + 4}" text-anchor="end" font-size="12" fill="${LABEL}">${formatValue(v)}</text>`;
  }).join('');
  const bars = years.map((y, i) => {
    const v = series[y];
    const bh = (v / max) * plotH;
    const x = padL + i * slot + (slot - barW) / 2;
    const by = padT + plotH - bh;
    return `<rect x="${x.toFixed(1)}" y="${by.toFixed(1)}" width="${barW}" height="${bh.toFixed(1)}" rx="3" fill="${i === years.length - 1 ? AMBER : TEAL}"><title>${y}: ${formatValue(v)}</title></rect><text x="${(x + barW / 2).toFixed(1)}" y="${(by - 6).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="600" fill="${INK}">${formatValue(v)}</text><text x="${(x + barW / 2).toFixed(1)}" y="${h - 10}" text-anchor="middle" font-size="12" fill="${LABEL}">${y}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Bar chart, ${years[0]} to ${years[years.length - 1]}" class="chart">${gridlines}${bars}<line x1="${padL}" y1="${padT + plotH}" x2="${w - 16}" y2="${padT + plotH}" stroke="${INK}" stroke-width="1"/></svg>`;
}

// Line chart for a year series: {2021: 100, ...}
export function lineChart(series, opts = {}) {
  const years = Object.keys(series).map(Number).sort((a, b) => a - b);
  const values = years.map((y) => series[y]);
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo || 1;
  const min = lo - span * 0.15;
  const max = hi + span * 0.15;
  const w = opts.width ?? 640;
  const h = opts.height ?? 300;
  const padL = 52;
  const padB = 30;
  const padT = 26;
  const plotW = w - padL - 16;
  const plotH = h - padT - padB;
  const x = (i) => padL + (i / (years.length - 1)) * plotW;
  const y = (v) => padT + plotH - ((v - min) / (max - min)) * plotH;
  const gridlines = [0, 0.5, 1].map((f) => {
    const v = min + (max - min) * f;
    const gy = padT + plotH - f * plotH;
    return `<line x1="${padL}" y1="${gy}" x2="${w - 16}" y2="${gy}" stroke="${GRID}" stroke-width="1"/><text x="${padL - 8}" y="${gy + 4}" text-anchor="end" font-size="12" fill="${LABEL}">${formatValue(v)}</text>`;
  }).join('');
  const points = years.map((yr, i) => `${x(i).toFixed(1)},${y(values[i]).toFixed(1)}`).join(' ');
  const dots = years.map((yr, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(values[i]).toFixed(1)}" r="4.5" fill="#fff" stroke="${TEAL}" stroke-width="2.5"><title>${yr}: ${formatValue(values[i])}</title></circle><text x="${x(i).toFixed(1)}" y="${(y(values[i]) - 10).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="600" fill="${INK}">${formatValue(values[i])}</text><text x="${x(i).toFixed(1)}" y="${h - 10}" text-anchor="middle" font-size="12" fill="${LABEL}">${yr}</text>`).join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Line chart, ${years[0]} to ${years[years.length - 1]}" class="chart">${gridlines}<polyline points="${points}" fill="none" stroke="${TEAL}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>${dots}<line x1="${padL}" y1="${padT + plotH}" x2="${w - 16}" y2="${padT + plotH}" stroke="${INK}" stroke-width="1"/></svg>`;
}

// Horizontal share bars for labelled parts: [{label, share}]
export function shareBars(rows, opts = {}) {
  const w = opts.width ?? 640;
  const rowH = 34;
  const h = rows.length * rowH + 8;
  const max = Math.max(...rows.map((r) => r.share));
  const labelW = opts.labelWidth ?? 210;
  const barX = labelW + 10;
  const barMax = w - barX - 56;
  const bars = rows.map((r, i) => {
    const y = 8 + i * rowH;
    const bw = (r.share / max) * barMax;
    return `<text x="0" y="${y + 15}" font-size="13" fill="${INK}">${esc(r.label)}</text><rect x="${barX}" y="${y}" width="${bw.toFixed(1)}" height="18" rx="3" fill="${i === 0 ? AMBER : TEAL}"><title>${esc(r.label)}: ${formatValue(r.share)}%</title></rect><text x="${(barX + bw + 8).toFixed(1)}" y="${y + 15}" font-size="13" font-weight="600" fill="${INK}">${formatValue(r.share)}%</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Shares as percent" class="chart">${bars}</svg>`;
}
