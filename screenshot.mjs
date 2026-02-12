import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
});

const page = await browser.newPage();
await page.setViewport({ width: 1400, height: 900 });
await page.goto('http://localhost:8080/index.html', { waitUntil: 'networkidle0', timeout: 30000 });

// Wait a bit for KaTeX to render and animations to fire
await new Promise(r => setTimeout(r, 3000));

// Full page screenshot
await page.screenshot({ path: '/workspace/screenshot_full.png', fullPage: true });
console.log('Full page screenshot saved');

// Hero section
await page.screenshot({ path: '/workspace/screenshot_hero.png', clip: { x: 260, y: 0, width: 1140, height: 900 } });
console.log('Hero screenshot saved');

// Scroll to section 2 (P vs I)
await page.evaluate(() => document.getElementById('theory').scrollIntoView());
await new Promise(r => setTimeout(r, 1000));
await page.screenshot({ path: '/workspace/screenshot_pvi.png' });
console.log('P vs I screenshot saved');

// Scroll to section 3 (Math / zones)
await page.evaluate(() => document.getElementById('math').scrollIntoView());
await new Promise(r => setTimeout(r, 1000));
await page.screenshot({ path: '/workspace/screenshot_math.png' });
console.log('Math section screenshot saved');

// Scroll to section 5 (Params / sticky)
await page.evaluate(() => document.getElementById('params').scrollIntoView());
await new Promise(r => setTimeout(r, 1000));
await page.screenshot({ path: '/workspace/screenshot_params.png' });
console.log('Params screenshot saved');

// Scroll to section 6 (Strategy / cost curve)
await page.evaluate(() => document.getElementById('strategy').scrollIntoView());
await new Promise(r => setTimeout(r, 1000));
await page.screenshot({ path: '/workspace/screenshot_strategy.png' });
console.log('Strategy screenshot saved');

// Check for console errors
const errors = [];
page.on('pageerror', err => errors.push(err.message));
if (errors.length > 0) {
  console.log('Console errors:', errors);
} else {
  console.log('No console errors detected during load');
}

await browser.close();
console.log('Done!');
