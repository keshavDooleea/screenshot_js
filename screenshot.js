require("dotenv/config");
const puppeteer = require("puppeteer");

const LINK = "https://www.bestbuy.ca/en-ca/search?search=dog+toys";
const FILE_NAME = "tesssst";
const PATH = `${process.env.PATH}/${FILE_NAME}.png`;

const imagesHaveLoaded = () => {
  return Array.from(document.images).every((i) => i.complete);
};

async function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true, // Set to false while development
    defaultViewport: null,
  });

  const page = await browser.newPage();

  console.log("1/5 Visiting URL");
  await page.goto(LINK, {
    waitUntil: "domcontentloaded",
    timeout: 0,
  });

  console.log("2/5 Loading images");
  await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight);
  });
  await timeout(10000);
  await page.waitForFunction(imagesHaveLoaded, { timeout: 0 });

  // Get scroll width and height of the rendered page and set viewport
  console.log("3/5 Getting View port");
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
  await page.setViewport({ width: bodyWidth, height: bodyHeight });

  console.log("4/5 Taking screenshot");
  await page.screenshot({ path: PATH, fullPage: true });

  console.log("5/5 Done");
  await browser.close();
})();
