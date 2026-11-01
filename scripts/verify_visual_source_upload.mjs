/** Verify Open, Download and invalid-source protection against a running gallery.
 * Usage: node scripts/verify_visual_source_upload.mjs PLAYWRIGHT_MODULE PAGE_URL
 */
import {pathToFileURL, fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {readFile} from 'node:fs/promises';

const [modulePath, url] = process.argv.slice(2);
if (!modulePath || !url) throw new Error('Expected PLAYWRIGHT_MODULE PAGE_URL');
const {chromium} = await import(pathToFileURL(resolve(modulePath)).href);
const browser = await chromium.launch({headless:true});
try {
    const page = await browser.newPage({viewport:{width:1500, height:900}});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {if (message.type() === 'error') errors.push(message.text());});
    const response = await page.goto(url);
    if (response && !response.ok()) throw new Error(`Page HTTP ${response.status()}`);
    await page.locator('#visual-open').click();
    const input = page.locator('#visual-uploader input[type=file]');
    await input.setInputFiles(fileURLToPath(new URL('../tests/fixtures/visual_source_sample.grmlt', import.meta.url)));
    await page.getByText('Source opened', {exact:true}).waitFor();
    await page.getByText('Imported design', {exact:true}).waitFor();
    const [download] = await Promise.all([page.waitForEvent('download'), page.locator('#visual-download').click()]);
    if (!(await readFile(await download.path(), 'utf8')).includes('Imported design')) throw new Error('Download lost Source content');
    await page.locator('#visual-open').click();
    await input.setInputFiles({name:'bad.grmlt', mimeType:'text/plain', buffer:Buffer.from('invalid')});
    await page.locator('#visual-uploader li').filter({hasText:'bad.grmlt — failed'}).waitFor();
    await page.getByText('Imported design', {exact:true}).waitFor();
    const unexpected = errors.filter(error => !error.includes('400 (Bad Request)'));
    if (unexpected.length) throw new Error(`Browser errors: ${unexpected.join('; ')}`);
    console.log('Opened and downloaded valid Source; invalid Source left the design intact.');
} finally { await browser.close(); }
