import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
});

const page = await browser.newPage();
await page.setViewport({ width: 1400, height: 900 });
await page.goto('http://localhost:8080/index.html', { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 3000));

// Click "Run Simulation" on P vs I
await page.click('#pvi-run');
await new Promise(r => setTimeout(r, 500));

// Scroll to the P vs I canvas
await page.evaluate(() => document.getElementById('cvs-pvi').scrollIntoView({ block: 'center' }));
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: '/workspace/ss_pvi_canvas.png' });
console.log('P vs I canvas saved');

// Scroll to zone state machine
await page.evaluate(() => document.getElementById('zone-bar').scrollIntoView({ block: 'center' }));
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: '/workspace/ss_zone.png' });
console.log('Zone state machine saved');

// Scroll to cumulative indexing
await page.evaluate(() => document.getElementById('cvs-cumulative').scrollIntoView({ block: 'center' }));
await new Promise(r => setTimeout(r, 500));
// Click play on cumulative animation  
await page.click('#cum-run');
await new Promise(r => setTimeout(r, 2000));
await page.screenshot({ path: '/workspace/ss_cumulative.png' });
console.log('Cumulative indexing saved');

// Scroll to sticky rate
await page.evaluate(() => document.getElementById('cvs-sticky').scrollIntoView({ block: 'center' }));
await new Promise(r => setTimeout(r, 500));
await page.click('#sticky-run');
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: '/workspace/ss_sticky.png' });
console.log('Sticky rate saved');

// Scroll to cost curve
await page.evaluate(() => document.getElementById('cvs-cost').scrollIntoView({ block: 'center' }));
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: '/workspace/ss_cost.png' });
console.log('Cost curve saved');

// Scroll to comparison table
await page.evaluate(() => document.getElementById('compare').scrollIntoView({ block: 'center' }));
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: '/workspace/ss_compare.png' });
console.log('Comparison table saved');

// Scroll to risks / oscillation
await page.evaluate(() => document.getElementById('cvs-oscillation').scrollIntoView({ block: 'center' }));
await new Promise(r => setTimeout(r, 500));
await page.click('#osc-run');
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: '/workspace/ss_oscillation.png' });
console.log('Oscillation saved');

// Scroll to conclusion
await page.evaluate(() => document.getElementById('conclusion').scrollIntoView());
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: '/workspace/ss_conclusion.png' });
console.log('Conclusion saved');

// Check for JS errors
const jsErrors = await page.evaluate(() => {
  // Check if canvases have content
  const canvases = document.querySelectorAll('canvas');
  const results = [];
  canvases.forEach(c => {
    const ctx = c.getContext('2d');
    const data = ctx.getImageData(0, 0, 1, 1).data;
    results.push({ id: c.id, hasContent: data[3] > 0, width: c.width, height: c.height });
  });
  return results;
});
console.log('Canvas check:', JSON.stringify(jsErrors, null, 2));

await browser.close();
console.log('Done!');
