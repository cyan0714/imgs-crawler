const path = require('path');
const puppeteer = require('puppeteer');
const srcToImg = require('./utils/srcToImg');

(async function () {
  const browser = await puppeteer.launch({
    // slowMo: 500, // show the operation process
    // devtools: true,
  });
  const page = await browser.newPage();
  await page.goto('https://image.baidu.com/');
  console.log('goto https://image.baidu.com/');

  await page.focus('#kw');
  await page.keyboard.sendCharacter('league of legends');
  await page.click('.s_newBtn');
  console.log('search league of legends imgs');

  page.on('load', async () => {
    console.log('page loading done');
    const sources = await page.evaluate(() => {
      const images = document.getElementsByClassName('main_img');

      return [...images].map(img => img.src);
    });

    for (let src of sources) {
      await srcToImg(src, path.resolve(__dirname, 'imgs'))
    }
    await browser.close();
  })

})();