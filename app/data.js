// The published figures of the Meridia National Statistics Office.
// Every number on the site comes from here, and every page names the
// source and the year beside the figure. The country is fictional;
// the figures are the Office's own illustrative series, kept
// consistent across pages (province populations sum to the national
// total; sector shares sum to 100).

export const YEARS = [2021, 2022, 2023, 2024, 2025];
export const LATEST_YEAR = 2025;
export const SOURCE = 'Meridia National Statistics Office';

export const COUNTRY = {
  name: 'Republic of Meridia',
  capital: 'Port Vell',
  currency: 'meridian thaler (Th)',
  population2025: 8.42, // million
};

// Annual series, 2021-2025. Each series carries its unit and the
// publication that released it, so a page can cite both.
export const SERIES = {
  population: {
    label: 'Population',
    unit: 'million people',
    values: { 2021: 8.21, 2022: 8.27, 2023: 8.33, 2024: 8.38, 2025: 8.42 },
    source: 'Population Estimates, annual release',
  },
  gdp: {
    label: 'Gross domestic product',
    unit: 'billion Th',
    values: { 2021: 348.9, 2022: 372.4, 2023: 389.1, 2024: 403.7, 2025: 412.6 },
    source: 'National Accounts, annual release',
  },
  gdpGrowth: {
    label: 'Real GDP growth',
    unit: '% per year',
    values: { 2021: 4.1, 2022: 3.2, 2023: 2.4, 2024: 2.9, 2025: 3.1 },
    source: 'National Accounts, annual release',
  },
  gdpPerCapita: {
    label: 'GDP per capita',
    unit: 'Th per person',
    values: { 2021: 42490, 2022: 45030, 2023: 46710, 2024: 48170, 2025: 48980 },
    source: 'National Accounts, annual release',
  },
  unemployment: {
    label: 'Unemployment rate',
    unit: '% of labour force',
    values: { 2021: 7.8, 2022: 6.9, 2023: 6.1, 2024: 5.7, 2025: 5.4 },
    source: 'Labour Force Survey, annual release',
  },
  employment: {
    label: 'People in work',
    unit: 'million people',
    values: { 2021: 3.86, 2022: 3.98, 2023: 4.07, 2024: 4.14, 2025: 4.21 },
    source: 'Labour Force Survey, annual release',
  },
  medianWage: {
    label: 'Median monthly wage',
    unit: 'Th per month',
    values: { 2021: 3180, 2022: 3360, 2023: 3540, 2024: 3690, 2025: 3840 },
    source: 'Earnings Survey, annual release',
  },
  cpi: {
    label: 'Consumer price index',
    unit: 'index, 2021 = 100',
    values: { 2021: 100.0, 2022: 106.8, 2023: 112.4, 2024: 116.2, 2025: 119.3 },
    source: 'Consumer Prices, monthly release',
  },
  inflation: {
    label: 'Inflation (CPI, annual change)',
    unit: '% per year',
    values: { 2021: 2.1, 2022: 6.8, 2023: 5.2, 2024: 3.4, 2025: 2.7 },
    source: 'Consumer Prices, monthly release',
  },
  exports: {
    label: 'Exports of goods and services',
    unit: 'billion Th',
    values: { 2021: 141.2, 2022: 152.6, 2023: 158.9, 2024: 163.5, 2025: 168.4 },
    source: 'International Trade, annual release',
  },
  imports: {
    label: 'Imports of goods and services',
    unit: 'billion Th',
    values: { 2021: 138.7, 2022: 149.8, 2023: 154.2, 2024: 157.1, 2025: 159.2 },
    source: 'International Trade, annual release',
  },
  lifeExpectancy: {
    label: 'Life expectancy at birth',
    unit: 'years',
    values: { 2021: 78.6, 2022: 78.8, 2023: 79.0, 2024: 79.2, 2025: 79.4 },
    source: 'Vital Statistics, annual release',
  },
  medianAge: {
    label: 'Median age',
    unit: 'years',
    values: { 2021: 40.1, 2022: 40.4, 2023: 40.7, 2024: 41.0, 2025: 41.2 },
    source: 'Population Estimates, annual release',
  },
};

// Age structure, 2025 (shares of population, %).
export const AGE_STRUCTURE = [
  { group: '0–14 years', share: 16.2 },
  { group: '15–24 years', share: 11.4 },
  { group: '25–54 years', share: 40.6 },
  { group: '55–64 years', share: 12.8 },
  { group: '65 years and over', share: 19.0 },
];

// GDP by sector, 2025 (% of gross value added).
export const GDP_BY_SECTOR = [
  { sector: 'Services', share: 68.4 },
  { sector: 'Manufacturing', share: 18.6 },
  { sector: 'Construction', share: 5.5 },
  { sector: 'Agriculture, forestry and fishing', share: 4.2 },
  { sector: 'Mining and energy', share: 3.3 },
];

// Employment by sector, 2025 (% of people in work).
export const EMPLOYMENT_BY_SECTOR = [
  { sector: 'Services', share: 71.2 },
  { sector: 'Industry and construction', share: 22.4 },
  { sector: 'Agriculture, forestry and fishing', share: 6.4 },
];

// CPI inflation by category, 2025 (% per year).
export const CPI_BY_CATEGORY = [
  { category: 'Food and non-alcoholic drinks', change: 3.1 },
  { category: 'Housing, water and energy', change: 2.4 },
  { category: 'Transport', change: 1.8 },
  { category: 'Health', change: 2.9 },
  { category: 'Education', change: 2.2 },
  { category: 'Recreation and culture', change: 3.4 },
  { category: 'Restaurants and hotels', change: 3.8 },
  { category: 'Clothing and footwear', change: 1.5 },
];

// The nine provinces. Populations sum to the 2025 national total
// (8.42 million). GDP per capita and unemployment are 2025.
export const PROVINCES = [
  { name: 'Port Vell', population: 1.92, gdpPerCapita: 61200, unemployment: 4.6, capital: 'Port Vell' },
  { name: 'Aldgate', population: 1.24, gdpPerCapita: 53400, unemployment: 5.1, capital: 'Aldgate City' },
  { name: 'Northreach', population: 0.98, gdpPerCapita: 44800, unemployment: 6.2, capital: 'Dunmere' },
  { name: 'Kestrel Coast', population: 0.87, gdpPerCapita: 47200, unemployment: 5.8, capital: 'Kestrel' },
  { name: 'Isles of Tarn', population: 0.86, gdpPerCapita: 41900, unemployment: 6.9, capital: 'Tarnmouth' },
  { name: 'Highmoor', population: 0.74, gdpPerCapita: 43600, unemployment: 5.9, capital: 'Highmoor Town' },
  { name: 'Riverlands', population: 0.68, gdpPerCapita: 45700, unemployment: 5.2, capital: 'Riverton' },
  { name: 'Eastvale', population: 0.61, gdpPerCapita: 46300, unemployment: 5.5, capital: 'Eastvale' },
  { name: 'Stonefield', population: 0.52, gdpPerCapita: 39800, unemployment: 7.4, capital: 'Stonefield' },
];

// The indicator index: every headline figure, searchable from Home.
export const INDICATORS = [
  { slug: 'population', label: 'Population', section: 'Population', series: 'population' },
  { slug: 'gdp', label: 'Gross domestic product', section: 'Economy', series: 'gdp' },
  { slug: 'gdp-growth', label: 'Real GDP growth', section: 'Economy', series: 'gdpGrowth' },
  { slug: 'gdp-per-capita', label: 'GDP per capita', section: 'Economy', series: 'gdpPerCapita' },
  { slug: 'unemployment', label: 'Unemployment rate', section: 'Labour', series: 'unemployment' },
  { slug: 'employment', label: 'People in work', section: 'Labour', series: 'employment' },
  { slug: 'median-wage', label: 'Median monthly wage', section: 'Labour', series: 'medianWage' },
  { slug: 'cpi', label: 'Consumer price index', section: 'Prices', series: 'cpi' },
  { slug: 'inflation', label: 'Inflation', section: 'Prices', series: 'inflation' },
  { slug: 'exports', label: 'Exports', section: 'Economy', series: 'exports' },
  { slug: 'imports', label: 'Imports', section: 'Economy', series: 'imports' },
  { slug: 'life-expectancy', label: 'Life expectancy at birth', section: 'Population', series: 'lifeExpectancy' },
  { slug: 'median-age', label: 'Median age', section: 'Population', series: 'medianAge' },
];

// Latest releases and the release calendar.
export const RELEASES = [
  { date: '12 Nov 2026', title: 'Consumer Prices, October 2026', note: 'CPI rose 0.2% on the month; annual inflation 2.6%.' },
  { date: '5 Nov 2026', title: 'Labour Force Survey, Q3 2026', note: 'Unemployment 5.3%; 4.24 million people in work.' },
  { date: '29 Oct 2026', title: 'National Accounts, Q3 2026', note: 'Real GDP grew 0.8% on the quarter; 3.0% on the year.' },
  { date: '15 Oct 2026', title: 'Population Estimates, mid-2026', note: 'Population 8.45 million; median age 41.3 years.' },
  { date: '2 Oct 2026', title: 'International Trade, August 2026', note: 'Exports Th 14.1bn; imports Th 13.4bn.' },
];

export const CALENDAR = [
  { date: '10 Dec 2026', title: 'Consumer Prices, November 2026' },
  { date: '17 Dec 2026', title: 'Labour Force Survey, Q4 2026 (provisional)' },
  { date: '21 Jan 2027', title: 'National Accounts, Q4 2026' },
  { date: '4 Feb 2027', title: 'Population Estimates, end-2026' },
  { date: '11 Feb 2027', title: 'International Trade, December 2026' },
];

export function tradeBalance(year) {
  return +(SERIES.exports.values[year] - SERIES.imports.values[year]).toFixed(1);
}

export function changeSince(seriesKey, fromYear, toYear) {
  const s = SERIES[seriesKey].values;
  return +(((s[toYear] - s[fromYear]) / s[fromYear]) * 100).toFixed(1);
}
