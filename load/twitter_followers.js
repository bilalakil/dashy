const puppeteer = require('puppeteer');

module.exports = async (config, data) => {
  const browser = await puppeteer.launch();

  try {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (request.resourceType() === 'image') request.abort();
      else request.continue();
    });

    await page.goto('https://twitter.com/' + config.username);

    const followerSelector = '.ProfileNav-stat[data-nav=followers] .ProfileNav-value';
    await page.waitForSelector(followerSelector);
    const followers = await page.$eval(
      followerSelector,
      s => parseFloat(s.textContent.replace(/[^0-9.]/g, ''))
    );

    browser.close();

    if (isNaN(followers))
      throw new Error("Followers is not a number.");
      
    data.followers = followers;
  } catch (e) {
    browser.close();
    throw e;
  }
}
