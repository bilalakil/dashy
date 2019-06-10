const util = require('./util');

module.exports = async (config, data) => {
  const browser = await util.puppeteer();

  try {
    const page = await util.newPage(browser);

    await page.goto(`https://analytics.cloud.unity3d.com/projects/${config.projectId}/segments/`);

    await page.type(
      '#conversations_create_session_form_email', 
      config.username
    );
    await page.type(
      '#conversations_create_session_form_password',
      config.password
    );
    await page.$eval(
      '#new_conversations_create_session_form',
      form => form.submit()
    );

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
