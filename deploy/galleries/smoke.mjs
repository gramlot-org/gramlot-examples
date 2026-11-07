import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser = await chromium.launch({headless: true});
try {
  for (const site of process.argv.slice(2)) {
    let page;
    const errors = [];
    const offline = site.startsWith('file:');
    // A hosted site serves the gallery under /gallery/; the offline argument is the gallery folder.
    const base = offline ? site : `${site}/gallery`;
    let routes = {};
    const visit = async key => {
      // Independent examples must release their embedded offline bundles between checks.
      // Keep interaction assertions on the current page until the next visit.
      if (page) await page.close();
      page = await browser.newPage();
      page.on('pageerror', error => errors.push(error.message));
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
    if (!offline) {
      // The tab page at / holds one iframe per gallery; the chart gallery links back to /gallery/.
      page = await browser.newPage();
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${site}/`);
      await page.waitForFunction(() => window.gramlot?.state === 'started');
      assert.deepEqual(await page.locator('iframe').evaluateAll(frames => frames.map(frame => frame.getAttribute('src'))),
        ['/gallery/', '/chart_gallery/']);
      for (const name of ['/gallery/', '/chart_gallery/']) {
        const state = await page.waitForFunction(name => {
          const value = document.querySelector(`iframe[src="${name}"]`)?.contentWindow?.gramlot?.state;
          return ['started', 'failed', 'disposed'].includes(value) && value;
        }, name, {timeout: 60000});
        assert.equal(await state.jsonValue(), 'started', `${site}/ iframe ${name}`);
      }
      await page.close();
      page = await browser.newPage();
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${site}/chart_gallery/`);
      await page.waitForFunction(() => ['started', 'failed'].includes(window.gramlot?.state));
      assert.equal(await page.evaluate(() => gramlot.state), 'started', `${site}/chart_gallery/`);
      const families = await page.evaluate(() => gramlot.data.getItem('galleryIndex.navigation').getNodes().map(node => node.label));
      assert.ok(families.includes('charts-simple'), families.join());
      await page.goto(`${site}/chart_gallery/pages/00-index`);
      await page.waitForFunction(() => window.gramlot?.state === 'started');
      assert.equal(await page.locator('a[href="/gallery/"]').count(), 1);
      assert.deepEqual(errors, []);
      console.log(`PASS ${site}/: tab page with both galleries; chart gallery starts and links back`);
      await page.close();
    }
  }
} finally {await browser.close();}
