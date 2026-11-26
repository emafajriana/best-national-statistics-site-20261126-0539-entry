// Router and controls for the Meridia statistics site. Hash routes:
//
//   #/                     home: headline figures, releases, search
//   #/population           population, age structure, life expectancy
//   #/economy              GDP, growth, sectors, trade
//   #/labour               unemployment, employment, wages
//   #/prices               inflation, CPI, prices by category
//   #/regions              the nine provinces, sortable table
//   #/methods              sources, definitions, release calendar
//   #/indicator/<slug>     one indicator: chart, yearly table, source
//
// State (year, chart type, search query, table sort) lives here and
// every control re-renders the current page from it, so each control
// does what it says. window.__shotReady is false while a page
// renders and true once it is on screen, so a screenshot script
// knows when to capture.

import { LATEST_YEAR, YEARS } from './data.js';
import { economy, home, indicator, labour, methods, missing, population, prices, regions } from './views.js';

const app = document.getElementById('app');
const navLinks = [...document.querySelectorAll('[data-nav]')];

const state = {
  year: LATEST_YEAR,
  chartType: 'bar',
  query: '',
  sortKey: 'population',
  sortDir: -1,
};

const ROUTES = {
  '': home,
  population,
  economy,
  labour,
  prices,
  regions,
  methods,
};

function route() {
  const hash = location.hash.replace(/^#\/?/, '');
  const [page, arg] = hash.split('/');
  if (page === 'indicator') return { view: indicator, arg };
  return { view: ROUTES[page] ?? missing, arg: undefined };
}

function render() {
  window.__shotReady = false;
  const { view, arg } = route();
  app.innerHTML = view === indicator ? indicator(arg, state) : view(state);
  const page = location.hash.replace(/^#\/?/, '').split('/')[0] || 'home';
  for (const link of navLinks) {
    const active = link.dataset.nav === page
      || (page === 'indicator' && link.dataset.nav === 'home');
    link.setAttribute('aria-current', active ? 'page' : 'false');
    link.classList.toggle('active', active);
  }
  wireControls();
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function wireControls() {
  const yearSelect = app.querySelector('.year-select');
  if (yearSelect) {
    yearSelect.addEventListener('change', () => {
      const y = Number(yearSelect.value);
      if (YEARS.includes(y)) {
        state.year = y;
        render();
      }
    });
  }
  for (const btn of app.querySelectorAll('[data-chart]')) {
    btn.addEventListener('click', () => {
      state.chartType = btn.dataset.chart;
      render();
    });
  }
  const search = app.querySelector('#indicator-search');
  if (search) {
    search.addEventListener('input', () => {
      state.query = search.value;
      const pos = search.selectionStart;
      render();
      const again = app.querySelector('#indicator-search');
      if (again) {
        again.focus();
        again.setSelectionRange(pos, pos);
      }
    });
  }
  for (const btn of app.querySelectorAll('[data-sort]')) {
    btn.addEventListener('click', () => {
      const key = btn.dataset.sort;
      if (state.sortKey === key) {
        state.sortDir = -state.sortDir;
      } else {
        state.sortKey = key;
        state.sortDir = -1;
      }
      render();
    });
  }
}

window.addEventListener('hashchange', render);
render();
