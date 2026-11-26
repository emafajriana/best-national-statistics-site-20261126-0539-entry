# Meridia National Statistics

[![Make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/emafajriana/best-national-statistics-site-20261126-0539-entry/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/emafajriana/best-national-statistics-site-20261126-0539-entry/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

A national statistics site for the Republic of Meridia, built for the
[make.fun bounty "Make the best national statistics site"](https://make.fun/bounty/best-national-statistics-site-20261126-0539).
It runs entirely from its own static files, offline, on a desktop and
on a phone: no network request, no build step, no framework.

## What it is

The Meridia National Statistics Office, publishing the country's
figures with a source and a year beside every number:

- **Home** — headline figures for 2025 (population 8.42 million, GDP
  Th 412.6 billion, unemployment 5.4%, inflation 2.7%), a GDP growth
  chart, the latest releases, and a search across every indicator.
- **Population** — population trend, age structure, life expectancy,
  and people by province.
- **Economy** — real GDP growth (bars or line, your choice), GDP by
  sector, and trade in goods and services.
- **Labour** — unemployment, employment by sector, median wage.
- **Prices** — inflation, the consumer price index, and inflation by
  category.
- **Regions** — all nine provinces compared, with a sortable table.
- **Sources & methods** — where each figure comes from, definitions,
  and the release calendar.

Every control works: the year picker (2021–2025) re-figures each
page, the chart toggle switches bars and lines, the search filters
the indicator index, and the regions table sorts on any column.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 (add `--port <n>` for another port).

## Hand it in

`main.ts` (Node 22, standard library only) copies `app/` and
`screenshots/` to `/output` and writes `/output/dossier.json` with
the vendored make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Layout

- `app/index.html` — the site shell: header, navigation, footer.
- `app/style.css` — the design: ink navy, teal and amber on paper.
- `app/data.js` — every published figure, with its source.
- `app/charts.js` — hand-drawn SVG bar, line and share charts.
- `app/views.js` — one template per page.
- `app/main.js` — hash router and the controls.
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged.
- `screenshots/` — four real renders of the site's own code.

## License

MIT — see [LICENSE](LICENSE).
