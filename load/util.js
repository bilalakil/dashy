const puppeteer = require('puppeteer');

const preparePuppeteer = async (config, launchArgs = {}) =>
{
  const browser = await puppeteer.launch({
    ...launchArgs,
    args: ['--no-sandbox', ...(launchArgs.args || [])],

    ...(process.env.DEBUG ? { headless: false } : {}),
  });

  try {
    if (config.cookies) {
      const page = await browser.newPage();
      await page.setCookie(...config.cookies);
    }

    if (config.localStorage) {
      for (const ss of config.localStorage) {
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', r => {
          r.respond({
            status: 200,
            contentType: 'text/plain',
            body: 'NOT BLANK',
          });
        });
        await page.goto(ss.url);
        await page.evaluate(kvs => {
          for (const key in kvs)
            localStorage.setItem(key, kvs[key]);
        }, ss.kvs);
        await page.close();
      }
    }
  } catch (e) {
    browser.close();
    throw e;
  }

  return browser;
}

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
