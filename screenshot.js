require("dotenv/config");
const puppeteer = require("puppeteer");

// node screenshot.js url filename delay(in sec)

const URL = process.argv[2];
const FILE_NAME = process.argv[3];
const PATH = `${process.env.SCREENSHOT_PATH}/${FILE_NAME}.png`;

// no args entered
if (!URL || !FILE_NAME) {
  let missedArgs = !URL ? "Url " : "";
  missedArgs += !FILE_NAME ? "File_Name" : "";
  console.log(`Missing arguments: ${missedArgs} (Delay)`);
  process.exit(1);
}

// timeout
const DELAY = process.argv[4] ? process.argv[4] * 1000 : 10000;

// check if all images on website have loaded
const imagesHaveLoaded = () => {
  return Array.from(document.images).every((i) => i.complete);
};

// delay used to wait for images to load
const timeout = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  console.log("1/5 Visiting URL");
  await page.goto(URL, {
    waitUntil: "domcontentloaded",
    timeout: 0,
  });

  console.log(`2/5 Loading images for ${DELAY / 1000} seconds`);
  await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight);
  });
  await timeout(DELAY);
  await page.waitForFunction(imagesHaveLoaded, { timeout: 0 });

  // get scroll width and height of the rendered page and set viewport
  console.log("3/5 Getting View port");
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
  await page.setViewport({ width: bodyWidth, height: bodyHeight });

  console.log("4/5 Taking screenshot");
  await page.screenshot({ path: PATH, fullPage: true });

  console.log("5/5 Done");
  await browser.close();
  process.exit(1);
})();
