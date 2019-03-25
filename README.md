dashy
=====

Uses Puppeteer to fetch and cumulatively store data from the web as configured,
and facilitates the display of said data in a "dashboardy" manner.

This allows me to dashboard arbitrary data automatically,
instead of having to open a bunch of pages, log in, and check them daily.

## Dependencies

- Node.js
- A modern browser (for JavaScript modules)

## Usage

- `npm i`
- Configure data points via `load/config.json` (see `load/config.sample.json`)
- Fetch and append new data to `data.txt` with `npm run load` (see `data.sample.txt`)
- Configure dashboard via `display/config.json` (see `display/config.sample.json`)
- `npm run display` to see dashboard - or just load `display/index.html` via HTTP
- Schedule `npm run load && npm run display` to run automatically for best results
