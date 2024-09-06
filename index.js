import puppeteer from "puppeteer";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AnonymizeUAPugin from "puppeteer-extra-plugin-anonymize-ua";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";

const randomDelay = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

(async () => {
  puppeteer.use(StealthPlugin());
  puppeteer.use(AnonymizeUAPugin());
  puppeteer.use(RecaptchaPlugin());
  const browser = await puppeteer.launch({
    defaultViewport: null,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-infobars",
      "--disable-web-security",
      "--disable-extensions",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--window-position=0,0",
      "--ignore-certificate-errors",
      "--allow-insecure-localhost",
      "--disable-webgl",
      "--disable-features=IsolateOrigins,site-per-process",
    ],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"
  );

  await page.goto("https://www.google.com/intl/ru/gmail/about/", {
    waitUntil: "domcontentloaded",
  });
  // await page.setViewport({ width: 1280, height: 1024 });

  await new Promise((resolve) => setTimeout(resolve, randomDelay(2000, 4000)));
  await page.mouse.move(0, 0);
  await page.mouse.move(106, 105);
  await page.click('a[data-action="sign in"]');

  await new Promise((resolve) => setTimeout(resolve, randomDelay(2000, 4000)));
  await page.click('input[type="email"]')

  await page.keyboard.press('1')
  await page.keyboard.press('2')
  await page.keyboard.press('3')
  await page.type('input[type="email"]', "", {
    delay: 500,
  });

  await new Promise((resolve) => setTimeout(resolve, randomDelay(3000, 5000)));
  await page.mouse.move(0, 0);
  await page.mouse.move(85, 93);
  await page.click(
    `div[data-primary-action-label="Next"] button[type="button"], div[data-primary-action-label="Далее"] button[type="button"]`
  );

  await new Promise((resolve) => setTimeout(resolve, randomDelay(3000, 5000)));
  // await browser.close();
})();
