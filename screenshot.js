require("dotenv/config");
const puppeteer = require("puppeteer");
const cmd = require("node-cmd");

/**
 * node screenshot.js URL FILENAME -delay -o -l
 * -delay is in seconds. default is 10s. Ex: -4 to wait for 4 seconds
 * -o to open the folder after taking screenshot
 * -l to lauch browser during process
 */
const OPEN_SCREENSHOT_FOLDER_COMMAND = "-o";
const LAUNCH_BROWSER_COMMAND = "-l";
const DEFAULT_DELAY = 10000; // 10 seconds

const URL = process.argv[2];
const FILE_NAME = process.argv[3];
const SCREENSHOT_FOLDER_PATH = process.env.SCREENSHOT_PATH;
const PATH = `${SCREENSHOT_FOLDER_PATH}/${FILE_NAME}.png`;

const shouldLaunchBrowser = !process.argv.includes(LAUNCH_BROWSER_COMMAND);

// launch file explorer by opening screenshots folder
const openScreenshotFolder = () => {
  cmd.runSync(`start ${SCREENSHOT_FOLDER_PATH}`);
  console.log("Opened screenshot folder");
  process.exit(1);
};

// open screenshots folder: node screenshot.js o
if (process.argv.length === 3 && URL === OPEN_SCREENSHOT_FOLDER_COMMAND) {
  openScreenshotFolder();
}

// no args or mismatched args entered
const invalidUrl = !URL || URL.startsWith("-");
const invalidFileName = !FILE_NAME || FILE_NAME.startsWith("-");

if (invalidUrl || invalidFileName) {
  let missedArgs = invalidUrl ? "Url " : "";
  missedArgs += invalidFileName ? "FileName" : "";
  console.log(`Missing arguments: ${missedArgs} (-delay) (${OPEN_SCREENSHOT_FOLDER_COMMAND}) (${LAUNCH_BROWSER_COMMAND})`);
  process.exit(1);
}

// delay used to wait for images to load
// if there's a delay arg, convert to seconds! else, delay = default
let delay = DEFAULT_DELAY;
process.argv.forEach((arg) => {
  if (arg.startsWith("-") && arg !== OPEN_SCREENSHOT_FOLDER_COMMAND && arg !== LAUNCH_BROWSER_COMMAND) {
    arg = Number(arg.slice(1, arg.length)); // string to number

    // if not a letter => is a number
    if (!Number.isNaN(arg)) {
      delay = arg * 1000;
    }
  }
});

// check if all images on website have loaded
const imagesHaveLoaded = () => {
  return Array.from(document.images).every((i) => i.complete);
};

// delay/timout function
const timeout = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

(async () => {
  const browser = await puppeteer.launch({
    headless: shouldLaunchBrowser,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  // go to website if url is valid
  console.log("1/5 Visiting URL");
  try {
    await page.goto(URL, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });
  } catch (err) {
    console.log("Invalid URL");
    process.exit(1);
  }

  // wait for images to render
  console.log(`2/5 Waiting ${delay / 1000} seconds to load images`);
  await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight);
  });
  await timeout(delay);
  await page.waitForFunction(imagesHaveLoaded, { timeout: 0 });

  // get scroll width and height of the rendered page and set viewport
  console.log("3/5 Setting View port");
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
  await page.setViewport({ width: bodyWidth, height: bodyHeight });

  console.log("4/5 Taking screenshot");
  await page.screenshot({ path: PATH, fullPage: true });

  console.log("5/5 Done");
  await browser.close();
  process.argv.includes(OPEN_SCREENSHOT_FOLDER_COMMAND) ? openScreenshotFolder() : process.exit(1);
})();
