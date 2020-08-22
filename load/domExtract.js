const util = require('./util');

module.exports = async (config, data) => {
  const browser = await util.puppeteer(config);

  if (config.sessionStorage) {
    browser.on('targetchanged', async (target) => {
      const page = await target.page();
      const client = await page.target().createCDPSession();

      for (const key in config.sessionStorage) {
        const val = config.sessionStorage[key];
        await client.send(
          'Runtime.evaluate',
          { expression: `sessionStorage.setItem('${key}', "${val}")` }
        );
      }
    });
  }

  try {
    const page = await util.newPage(browser);

    await page.goto(config.url);

    let val;
    let i = 0;
    while (val === undefined && i != 30) {
      await new Promise(r => setTimeout(r, 1000));

      for (const frame of page.frames()) {
        const el = await frame.$(config.selector);
        if (el === null) continue;

        val = await frame.evaluate(el => el.textContent, el);
        break;
      }

      ++i;
    }

    if (val === undefined)
      throw new Error('Timed out without matching query selector');

    browser.close();

    data.strVal = val.trim();

    const numVal = Number.parseFloat(data.strVal.replace(/[$,]/g, ''), 10);
    if (!Number.isNaN(numVal)) data.numVal = numVal;
  } catch (e) {
    browser.close();
    throw e;
  }
}
