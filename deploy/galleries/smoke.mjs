import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser = await chromium.launch({headless: true});
try {
  for (const base of process.argv.slice(2)) {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const offline = base.startsWith('file:');
    let routes = {};
    const visit = async key => {
      const path = key ? routes[key] : '';
      await page.goto(`${base}/${path}${offline ? (key ? '/index.html' : 'index.html') : ''}`);
      await page.waitForFunction(() => ['started', 'failed'].includes(window.gramlot?.state));
      assert.equal(await page.evaluate(() => gramlot.state), 'started', `${base}/${key}`);
    };
    await visit('');
    routes = await page.evaluate(async () => {
      const urls = {};
      async function walk(bag) {
        for (const node of bag.getNodes()) {
          if (node.attr.key && node.attr.url) urls[node.attr.key] = node.attr.url.replace(/\/index\.html$/, '');
          const children = node.resolver ? await node.resolver.refresh() : node.getValue(true);
          if (children instanceof gramlot.data.constructor) await walk(children);
        }
      }
      await walk(gramlot.data.getItem('galleryIndex.navigation'));
      return urls;
    });
    assert.equal(await page.locator('a.gallery-download').count(), 0);
    for (let n=1; n<=25; n++) await visit(`w${String(n).padStart(2,'0')}`);
    await visit('w01');
    await page.locator('#customer input').fill('Grace');
    await page.locator('#customer input').press('Tab');
    assert.equal(await page.locator('#customer-copy input').inputValue(), 'Grace');
    await visit('w25');
    await page.locator('#full-name input').fill('');
    await page.locator('#full-name input').press('Tab');
    assert.equal(await page.evaluate(() => gramlot.data.getItem('profile.full_name')), 'Ada Lovelace');
    assert.equal(await page.locator('#full-name input').getAttribute('aria-invalid'), 'true');
    await page.locator('#remote-name input').fill('newname');
    await page.locator('#remote-name input').press('Tab');
    await page.waitForFunction(() => gramlot.data.getItem('profile.remote_name') === 'NEWNAME');
    assert.deepEqual(errors, []);
    console.log(`PASS ${base}: 25 component pages, binding, validation and footer without download link`);
    await page.close();
  }
} finally {await browser.close();}
