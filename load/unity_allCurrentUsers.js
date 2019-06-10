const util = require('./util');

module.exports = async (config, data) => {
  const browser = await util.puppeteer(config);

  try {
    const page = await util.newPage(browser);

    await page.goto(`https://analytics.cloud.unity3d.com/projects/${config.projectId}/segments/`);

    const userSelector = '.table-main .table-is-a-row:first-child .numeric-data';
    await page.waitForSelector(userSelector);
    const allCurrentUsers = await page.$eval(
      userSelector,
      s => parseInt(s.textContent.replace(/[^0-9]/g, ''))
    );

    browser.close();

    if (isNaN(allCurrentUsers))
      throw new Error('All current users is not a number.');

    data.allCurrentUsers = allCurrentUsers;
  } catch (e) {
    browser.close();
    throw e;
  }
}
