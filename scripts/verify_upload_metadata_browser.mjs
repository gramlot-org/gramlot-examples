/** Verify per-file application metadata with the shared uploader in a browser.
 * Usage: node scripts/verify_upload_metadata_browser.mjs PLAYWRIGHT PAGE_URL
 */
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const [entry, url] = process.argv.slice(2);
if (!entry || !url) throw new Error('Expected Playwright and page URL');
const {chromium} = await import(pathToFileURL(resolve(entry)));
const browser = await chromium.launch({headless:true});
try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(url);
    if (response && !response.ok()) throw new Error(`Page HTTP ${response.status()}`);
    await page.waitForFunction(() => globalThis.gramlot?.state === 'started');
    const uploader = page.locator('#upload-demo');
    const title = page.locator('#upload-title input');
    const description = page.locator('#upload-description input');
    assert.equal(await title.isDisabled(), true);
    await uploader.locator('input[type=file]').setInputFiles([
        {name:'first.txt', mimeType:'text/plain', buffer:Buffer.from('one')},
        {name:'second.txt', mimeType:'text/plain', buffer:Buffer.from('two!')}
    ]);
    await uploader.getByRole('button', {name:'Select first.txt'}).click();
    await title.fill('First'); await description.fill('One');
    await uploader.getByRole('button', {name:'Select second.txt'}).click();
    assert.equal(await title.inputValue(), '');
    await title.fill('Second'); await description.fill('Two');
    await uploader.getByRole('button', {name:'Select first.txt'}).click();
    assert.equal(await title.inputValue(), 'First');
    await uploader.getByRole('button', {name:'Upload', exact:true}).click();
    await page.waitForFunction(() => globalThis.gramlot.data.getItem('uploadDemo.queue').getNodes()
        .every(node => node.value.getItem('status') === 'completed'));
    assert.equal(await title.isDisabled(), true);
    await page.getByText('Last completed: second.txt', {exact:true}).waitFor();
    assert.match(await uploader.locator('[aria-label="Upload summary"]').innerText(), /2 completed/);
    const results = await page.evaluate(() => globalThis.gramlot.data.getItem('uploadDemo.queue').getNodes()
        .map(node => node.value.getItem('result')));
    assert.deepEqual(results, [{size:3,fields:{title:'First',description:'One'}}, {size:4,fields:{title:'Second',description:'Two'}}]);
    assert.deepEqual(errors, []);
    console.log('PASS: per-file forms preserve and upload independent metadata.');
} finally { await browser.close(); }
