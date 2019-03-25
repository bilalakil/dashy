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

    await page.goto('https://developer.cloud.unity3d.com');

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

    await page.waitForSelector('.project-list-group .layout-row');
    const project = await page.$x(`//a[contains(text(), '${config.project}')]`);
    await project[0].click();

    await page.waitForSelector('.analytics');
    const analytics = await page.$eval(
      '.analytics a',
      a => a.click()
    )

    await page.waitForSelector('.unity-menu-list .layout-row');
    const segments = await page.evaluate(() =>
      Array.from(document.querySelectorAll('button'))
        .filter(_ => _.textContent.indexOf('Segments') !== -1)[0]
        .click()
    )

    const userSelector = '.table-main .table-is-a-row:first-child .numeric-data';
    await page.waitForSelector(userSelector);
    const allCurrentUsers = await page.$eval(
      userSelector,
      s => parseInt(s.textContent.trim())
    );

    browser.close();

    data.allCurrentUsers = allCurrentUsers;
  } catch (e) {
    browser.close();
    throw e;
  }
}
