const util = require('./util');

module.exports = async (config, data) => {
  const browser = await util.puppeteer(config);

  try {
    const page = await util.newPage(browser);

    await page.goto('https://twitter.com/' + config.username);

    const followerSelector = '.ProfileNav-stat[data-nav=followers] .ProfileNav-value';
    await page.waitForSelector(followerSelector);
    const followers = await page.$eval(
      followerSelector,
      s => parseFloat(s.textContent.replace(/[^0-9.]/g, ''))
    );

    browser.close();

    if (isNaN(followers))
      throw new Error('Followers is not a number.');
      
    data.followers = followers;
  } catch (e) {
    browser.close();
    throw e;
  }
}
