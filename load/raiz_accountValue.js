const util = require('./util');

module.exports = async (config, data) => {
  const browser = await util.puppeteer();

  try {
    const page = await util.newPage(browser);

    await page.goto('https://app.raizinvest.com.au/dashboard/account');

    await page.type(
      '.spec-login-email-input', 
      config.username
    );
    await page.type(
      '.spec-login-password-input',
      config.password
    );
    await page.$eval(
      '.spec-login-button',
      btn => btn.click()
    );

    const valueSelector = '.graph-header-center-value';
    await page.waitForSelector(valueSelector);
    const accountValue = await page.$eval(
      valueSelector,
      s => parseFloat(s.textContent.replace(/[^0-9.]/g, ''))
    );

    browser.close();

    if (isNaN(accountValue))
      throw new Error('Account value is not a number.');
      
    data.accountValue = accountValue;
  } catch (e) {
    browser.close();
    throw e;
  }
}
