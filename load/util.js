const puppeteer = require('puppeteer');

const preparePuppeteer = async () =>
  await puppeteer.launch({ args: ['--no-sandbox'] });

const newPage = async (browser) =>
{
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (request.resourceType() === 'image') request.abort();
    else request.continue();
  });

  return page;
}

module.exports = {
  puppeteer: preparePuppeteer,
  newPage
};
