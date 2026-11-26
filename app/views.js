// HTML for each page, built from the data. Every value is escaped
// before it goes into the page, and every figure is followed by its
// source and year. Pages are hash routes; main.js picks the view and
// wires the controls (year picker, chart toggle, search, sorting).

import {
  AGE_STRUCTURE,
  CALENDAR,
  CPI_BY_CATEGORY,
  EMPLOYMENT_BY_SECTOR,
  GDP_BY_SECTOR,
  INDICATORS,
  LATEST_YEAR,
  PROVINCES,
  RELEASES,
  SERIES,
  SOURCE,
  YEARS,
  changeSince,
  tradeBalance,
} from './data.js';
import { barChart, lineChart, shareBars } from './charts.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const fmt = (n) => Number(n).toLocaleString('en-GB');
const fmt1 = (n) => Number(n).toLocaleString('en-GB', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function cite(seriesKey, year) {
  return `<p class="cite">Source: ${esc(SOURCE)} — ${esc(SERIES[seriesKey].source)}, ${year}.</p>`;
}

function yearPicker(year) {
  const opts = YEARS.map((y) => `<option value="${y}"${y === year ? ' selected' : ''}>${y}</option>`).join('');
  return `<label class="year-picker">Show figures for <select class="year-select" aria-label="Year">${opts}</select></label>`;
}

function chartToggle(kind) {
  return `<div class="chart-toggle" role="group" aria-label="Chart type">
    <button type="button" data-chart="bar" aria-pressed="${kind === 'bar'}">Bars</button>
    <button type="button" data-chart="line" aria-pressed="${kind === 'line'}">Line</button>
  </div>`;
}

function kpiCard(indicator, year) {
  const s = SERIES[indicator.series];
  const v = s.values[year];
  const shown = indicator.series === 'population' || indicator.series === 'employment'
    ? `${fmt1(v)} ${s.unit.replace(/^million people$/, 'million')}`
    : indicator.series === 'gdp'
      ? `Th ${fmt1(v)}bn`
      : indicator.series === 'gdpPerCapita' || indicator.series === 'medianWage'
        ? `Th ${fmt(v)}`
        : `${fmt1(v)}${s.unit.startsWith('%') ? '%' : ''}`;
  return `<a class="kpi" href="#/indicator/${indicator.slug}">
    <span class="kpi-label">${esc(indicator.label)}</span>
    <span class="kpi-value">${shown}</span>
    <span class="kpi-meta">${esc(s.unit)} &middot; ${year}</span>
  </a>`;
}

function sectionCards() {
  const sections = [
    { href: '#/population', title: 'Population', text: 'How many of us there are, how old we are, and where we live — 8.42 million people in nine provinces.' },
    { href: '#/economy', title: 'Economy', text: 'GDP, growth and trade: Th 412.6 billion of output in 2025, growing 3.1% in real terms.' },
    { href: '#/labour', title: 'Labour', text: 'Who works, what they earn: 4.21 million in work, unemployment 5.4%, median wage Th 3,840 a month.' },
    { href: '#/prices', title: 'Prices', text: 'What things cost: inflation 2.7% in 2025, with food, housing and transport broken out.' },
    { href: '#/regions', title: 'Regions', text: 'Compare the nine provinces on population, output per person and unemployment.' },
  ];
  return sections.map((s) => `<a class="section-card" href="${s.href}"><span class="section-card-title">${esc(s.title)}</span><span>${esc(s.text)}</span></a>`).join('');
}

export function home(state) {
  const year = state.year;
  const cards = ['population', 'gdp', 'gdpGrowth', 'unemployment', 'inflation', 'lifeExpectancy']
    .map((key) => kpiCard(INDICATORS.find((i) => i.series === key), year)).join('');
  const growth = SERIES.gdpGrowth.values;
  const releases = RELEASES.map((r) => `<li><span class="release-date">${esc(r.date)}</span><strong>${esc(r.title)}</strong><span>${esc(r.note)}</span></li>`).join('');
  const q = (state.query ?? '').trim().toLowerCase();
  const matches = q
    ? INDICATORS.filter((i) => `${i.label} ${i.section}`.toLowerCase().includes(q))
    : INDICATORS;
  const results = matches.map((i) => {
    const s = SERIES[i.series];
    return `<li><a href="#/indicator/${i.slug}">${esc(i.label)}</a><span>${esc(i.section)}</span><span>${fmt1(s.values[LATEST_YEAR])} ${esc(s.unit)} (${LATEST_YEAR})</span></li>`;
  }).join('') || '<li class="empty">No indicator matches that search. Try “wage”, “trade” or “age”.</li>';
  return `
<section class="hero">
  <p class="eyebrow">Official statistics &middot; Updated 12 November 2026</p>
  <h1>Meridia in numbers</h1>
  <p class="lede">The Republic of Meridia, measured: <strong>8.42 million people</strong>, an economy of <strong>Th 412.6 billion</strong>, and <strong>5.4% unemployment</strong> in ${LATEST_YEAR}. Every figure below names its source and year.</p>
  ${yearPicker(year)}
</section>
<section aria-label="Headline figures">
  <div class="kpi-grid">${cards}</div>
  <p class="cite">Source: ${esc(SOURCE)} — Population Estimates, National Accounts, Labour Force Survey and Consumer Prices, ${year}.</p>
</section>
<section class="split">
  <div>
    <h2>Real GDP growth, 2021–${LATEST_YEAR}</h2>
    ${lineChart(growth)}
    <p class="cite">Source: ${esc(SOURCE)} — National Accounts. Growth in real terms, % per year.</p>
  </div>
  <div>
    <h2>Latest releases</h2>
    <ul class="releases">${releases}</ul>
    <p><a href="#/methods">See the release calendar &rarr;</a></p>
  </div>
</section>
<section>
  <h2>Find an indicator</h2>
  <p><input id="indicator-search" class="search" type="search" placeholder="Search indicators — try “wage” or “trade”" value="${esc(state.query ?? '')}" aria-label="Search indicators"></p>
  <ul class="indicator-list">${results}</ul>
</section>
<section>
  <h2>Explore by section</h2>
  <div class="section-grid">${sectionCards()}</div>
</section>`;
}

export function population(state) {
  const year = state.year;
  const rows = PROVINCES.map((p) => `<tr><td><a href="#/regions">${esc(p.name)}</a></td><td class="num">${fmt1(p.population)}</td><td class="num">${fmt1((p.population / 8.42) * 100)}%</td></tr>`).join('');
  return `
<p class="crumb"><a href="#/">&larr; Home</a></p>
<h1>Population</h1>
<p class="lede">Meridia had <strong>${fmt1(SERIES.population.values[year])} million people</strong> in ${year}, up ${changeSince('population', 2021, year)}% since 2021. The median age was ${fmt1(SERIES.medianAge.values[year])} years.</p>
${yearPicker(year)}
<section class="split">
  <div>
    <h2>Population, 2021–${LATEST_YEAR}</h2>
    ${lineChart(SERIES.population.values)}
    ${cite('population', LATEST_YEAR)}
  </div>
  <div>
    <h2>Age structure, ${LATEST_YEAR}</h2>
    ${shareBars(AGE_STRUCTURE.map((a) => ({ label: a.group, share: a.share })))}
    <p class="cite">Source: ${esc(SOURCE)} — Population Estimates, ${LATEST_YEAR}. Shares of total population.</p>
  </div>
</section>
<section>
  <h2>Life expectancy at birth</h2>
  ${barChart(SERIES.lifeExpectancy.values)}
  ${cite('lifeExpectancy', LATEST_YEAR)}
</section>
<section>
  <h2>People by province, ${LATEST_YEAR}</h2>
  <table class="data-table">
    <thead><tr><th>Province</th><th class="num">Population (million)</th><th class="num">Share of Meridia</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <p><a href="#/regions">Compare all nine provinces &rarr;</a></p>
  ${cite('population', LATEST_YEAR)}
</section>`;
}

export function economy(state) {
  const year = state.year;
  const chart = state.chartType === 'line' ? lineChart(SERIES.gdpGrowth.values) : barChart(SERIES.gdpGrowth.values);
  return `
<p class="crumb"><a href="#/">&larr; Home</a></p>
<h1>Economy</h1>
<p class="lede">Meridia produced <strong>Th ${fmt(SERIES.gdp.values[year])} billion</strong> in ${year} — <strong>Th ${fmt(SERIES.gdpPerCapita.values[year])}</strong> per person — growing <strong>${fmt1(SERIES.gdpGrowth.values[year])}%</strong> in real terms.</p>
${yearPicker(year)}
<section class="split">
  <div>
    <h2>Real GDP growth, 2021–${LATEST_YEAR}</h2>
    ${chartToggle(state.chartType)}
    ${chart}
    ${cite('gdpGrowth', LATEST_YEAR)}
  </div>
  <div>
    <h2>GDP by sector, ${LATEST_YEAR}</h2>
    ${shareBars(GDP_BY_SECTOR.map((s) => ({ label: s.sector, share: s.share })))}
    <p class="cite">Source: ${esc(SOURCE)} — National Accounts, ${LATEST_YEAR}. Shares of gross value added.</p>
  </div>
</section>
<section>
  <h2>Trade in goods and services</h2>
  <p>Exports <strong>Th ${fmt1(SERIES.exports.values[year])} billion</strong>; imports <strong>Th ${fmt1(SERIES.imports.values[year])} billion</strong>; a surplus of <strong>Th ${fmt1(tradeBalance(year))} billion</strong> in ${year}.</p>
  ${barChart(SERIES.exports.values)}
  <p class="cite">Source: ${esc(SOURCE)} — International Trade, ${LATEST_YEAR}. Exports, billion Th.</p>
</section>`;
}

export function labour(state) {
  const year = state.year;
  return `
<p class="crumb"><a href="#/">&larr; Home</a></p>
<h1>Labour</h1>
<p class="lede"><strong>${fmt1(SERIES.employment.values[year])} million people</strong> were in work in ${year}. Unemployment was <strong>${fmt1(SERIES.unemployment.values[year])}%</strong> and the median monthly wage <strong>Th ${fmt(SERIES.medianWage.values[year])}</strong>.</p>
${yearPicker(year)}
<section class="split">
  <div>
    <h2>Unemployment rate, 2021–${LATEST_YEAR}</h2>
    ${lineChart(SERIES.unemployment.values)}
    ${cite('unemployment', LATEST_YEAR)}
  </div>
  <div>
    <h2>Employment by sector, ${LATEST_YEAR}</h2>
    ${shareBars(EMPLOYMENT_BY_SECTOR.map((s) => ({ label: s.sector, share: s.share })))}
    <p class="cite">Source: ${esc(SOURCE)} — Labour Force Survey, ${LATEST_YEAR}. Shares of people in work.</p>
  </div>
</section>
<section>
  <h2>Median monthly wage</h2>
  ${barChart(SERIES.medianWage.values)}
  ${cite('medianWage', LATEST_YEAR)}
</section>`;
}

export function prices(state) {
  const year = state.year;
  const chart = state.chartType === 'line' ? lineChart(SERIES.inflation.values) : barChart(SERIES.inflation.values);
  const cats = CPI_BY_CATEGORY.map((c) => `<tr><td>${esc(c.category)}</td><td class="num">${fmt1(c.change)}%</td></tr>`).join('');
  return `
<p class="crumb"><a href="#/">&larr; Home</a></p>
<h1>Prices</h1>
<p class="lede">Consumer prices rose <strong>${fmt1(SERIES.inflation.values[year])}%</strong> in ${year}. The consumer price index stood at <strong>${fmt1(SERIES.cpi.values[year])}</strong> (2021 = 100).</p>
${yearPicker(year)}
<section class="split">
  <div>
    <h2>Inflation, 2021–${LATEST_YEAR}</h2>
    ${chartToggle(state.chartType)}
    ${chart}
    ${cite('inflation', LATEST_YEAR)}
  </div>
  <div>
    <h2>Inflation by category, ${LATEST_YEAR}</h2>
    <table class="data-table">
      <thead><tr><th>Category</th><th class="num">Annual change</th></tr></thead>
      <tbody>${cats}</tbody>
    </table>
    <p class="cite">Source: ${esc(SOURCE)} — Consumer Prices, ${LATEST_YEAR}.</p>
  </div>
</section>
<section>
  <h2>Consumer price index</h2>
  ${lineChart(SERIES.cpi.values)}
  ${cite('cpi', LATEST_YEAR)}
</section>`;
}

export function regions(state) {
  const key = state.sortKey ?? 'population';
  const dir = state.sortDir ?? -1;
  const rows = [...PROVINCES].sort((a, b) => (a[key] - b[key]) * dir);
  const arrow = (k) => (state.sortKey === k ? (dir === 1 ? ' ↑' : ' ↓') : '');
  const th = (k, label) => `<th><button type="button" class="sort-btn" data-sort="${k}">${label}${arrow(k)}</button></th>`;
  const body = rows.map((p) => `<tr><td>${esc(p.name)}</td><td>${esc(p.capital)}</td><td class="num">${fmt1(p.population)}</td><td class="num">Th ${fmt(p.gdpPerCapita)}</td><td class="num">${fmt1(p.unemployment)}%</td></tr>`).join('');
  return `
<p class="crumb"><a href="#/">&larr; Home</a></p>
<h1>Regions</h1>
<p class="lede">Nine provinces, from Port Vell (1.92 million people) to Stonefield (0.52 million). Tap a column heading to sort the table.</p>
<section>
  <h2>Population by province, ${LATEST_YEAR}</h2>
  ${shareBars(PROVINCES.map((p) => ({ label: p.name, share: p.population })), { labelWidth: 130 })}
  <p class="cite">Source: ${esc(SOURCE)} — Population Estimates, ${LATEST_YEAR}. Millions of people.</p>
</section>
<section>
  <h2>All provinces, ${LATEST_YEAR}</h2>
  <div class="table-scroll">
  <table class="data-table">
    <thead><tr><th>Province</th><th>Capital</th>${th('population', 'Population (m)')}${th('gdpPerCapita', 'GDP per capita')}${th('unemployment', 'Unemployment')}</tr></thead>
    <tbody>${body}</tbody>
  </table>
  </div>
  <p class="cite">Source: ${esc(SOURCE)} — Population Estimates, National Accounts and Labour Force Survey, ${LATEST_YEAR}.</p>
</section>`;
}

export function methods() {
  const cal = CALENDAR.map((c) => `<li><span class="release-date">${esc(c.date)}</span><strong>${esc(c.title)}</strong></li>`).join('');
  return `
<p class="crumb"><a href="#/">&larr; Home</a></p>
<h1>Sources &amp; methods</h1>
<p class="lede">How the Office counts Meridia — and when the next figures arrive.</p>
<section>
  <h2>Where the figures come from</h2>
  <ul class="plain-list">
    <li><strong>Population Estimates</strong> — the census of 2021, updated each year with births, deaths and migration records.</li>
    <li><strong>National Accounts</strong> — GDP from business surveys, tax records and government accounts, in current and constant prices.</li>
    <li><strong>Labour Force Survey</strong> — a quarterly survey of 12,000 households; unemployment follows the international standard (without work, available to start, and looking).</li>
    <li><strong>Consumer Prices</strong> — prices of a fixed basket of 620 goods and services, collected monthly in 40 towns.</li>
    <li><strong>International Trade</strong> — customs records for goods, plus surveys for services.</li>
    <li><strong>Vital Statistics</strong> — every birth and death registered with the Office.</li>
  </ul>
</section>
<section>
  <h2>Definitions</h2>
  <ul class="plain-list">
    <li><strong>Real GDP growth</strong> — the change in GDP after removing price changes, so it measures volume, not prices.</li>
    <li><strong>Median wage</strong> — the wage of the worker in the middle: half earn more, half earn less.</li>
    <li><strong>Inflation</strong> — the annual change in the consumer price index, 2021 = 100.</li>
    <li><strong>Trade balance</strong> — exports minus imports of goods and services.</li>
  </ul>
</section>
<section>
  <h2>Release calendar</h2>
  <ul class="releases">${cal}</ul>
  <p>Figures are revised when better data arrives; each release notes what changed and why.</p>
</section>
<section>
  <h2>About the Office</h2>
  <p>The Meridia National Statistics Office is the Republic&rsquo;s independent producer of official statistics. It collects no figure from another origin for this site: every number here is published by the Office itself, and the site runs entirely from its own files.</p>
</section>`;
}

export function indicator(slug, state) {
  const ind = INDICATORS.find((i) => i.slug === slug);
  if (!ind) return missing();
  const s = SERIES[ind.series];
  const sectionHref = { Population: '#/population', Economy: '#/economy', Labour: '#/labour', Prices: '#/prices' }[ind.section] ?? '#/';
  const rows = YEARS.map((y) => `<tr><td>${y}</td><td class="num">${fmt1(s.values[y])}</td></tr>`).join('');
  const chart = ind.series === 'cpi' || ind.series === 'inflation' || ind.series === 'unemployment'
    ? lineChart(s.values) : barChart(s.values);
  return `
<p class="crumb"><a href="#/">&larr; Home</a> &middot; <a href="${sectionHref}">${esc(ind.section)}</a></p>
<h1>${esc(ind.label)}</h1>
<p class="lede">Latest value: <strong>${fmt1(s.values[LATEST_YEAR])} ${esc(s.unit)}</strong> (${LATEST_YEAR}). Since 2021 the figure has changed ${changeSince(ind.series, 2021, LATEST_YEAR)}%.</p>
<section>
  <h2>${esc(ind.label)}, 2021–${LATEST_YEAR}</h2>
  ${chart}
  ${cite(ind.series, LATEST_YEAR)}
</section>
<section>
  <h2>Figures by year</h2>
  <table class="data-table">
    <thead><tr><th>Year</th><th class="num">${esc(ind.label)} (${esc(s.unit)})</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <p><a href="${sectionHref}">Back to ${esc(ind.section)} &rarr;</a></p>
</section>`;
}

export function missing() {
  return `<h1>Not found</h1>
<p>There is no page at this address. Try the <a href="#/">home page</a>, or one of the sections: <a href="#/population">Population</a>, <a href="#/economy">Economy</a>, <a href="#/labour">Labour</a>, <a href="#/prices">Prices</a>, <a href="#/regions">Regions</a>.</p>`;
}
