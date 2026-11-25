import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const [playwrightEntry, base = 'http://127.0.0.1:8905'] = process.argv.slice(2);
if (!playwrightEntry) throw new Error('Usage: verify_system_monitor_browser.mjs PLAYWRIGHT_ENTRY [GALLERY_URL]');
const {chromium} = await import(pathToFileURL(resolve(playwrightEntry)));
const browser = await chromium.launch();
try {
    const page = await browser.newPage({viewport: {width: 1500, height: 900}});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base);
    await page.getByPlaceholder('Search examples').fill('System monitor');
    await page.locator('#gallery-navigation-tree .leaf').getByText('System monitor', {exact: true}).click();

    const preview = page.locator('#preview-system-monitor-01');
    const frame = page.frameLocator('#frame-system-monitor-01');
    await frame.locator('#monitor-samples').waitFor();
    const monitor = await (await page.locator('#frame-system-monitor-01').elementHandle()).contentFrame();
    await monitor.waitForFunction(() => ['cores', 'memory_usage', 'processes', 'network_history'].every(
        key => window.gramlot.data.getItem('monitor.metrics.' + key)?.length > 0));
    await frame.locator('#monitor-cores').locator('svg:visible, canvas:visible').first().waitFor();

    await frame.getByTitle('Stop sampling').click();
    await frame.getByTitle('Play sampling').waitFor();
    await monitor.waitForFunction(() => window.gramlot.data.getItem('monitor.control.running') === false);
    // Allow any sample already in flight to arrive, then wait for a full sampling round.
    await page.waitForTimeout(300);
    const sampleCount = () => monitor.evaluate(() => window.gramlot.data.getItem('monitor.metrics.samples'));
    const stopped = await sampleCount();
    await page.waitForTimeout(1200);
    assert.equal(await sampleCount(), stopped);
    await frame.getByTitle('Play sampling').click();
    await monitor.waitForFunction(previous => window.gramlot.data.getItem('monitor.metrics.samples') > previous, stopped);

    for (const title of ['CPU history', 'Disk activity', 'Disk capacity', 'Interfaces', 'Memory history', 'Process memory']) {
        await frame.getByText('Add panel', {exact: true}).click();
        await frame.getByRole('button', {name: title, exact: true}).click();
        await frame.getByRole('heading', {name: title, exact: true}).waitFor();
    }
    await monitor.waitForFunction(() => {
        const metrics = window.gramlot.data.getItem('monitor.metrics');
        return ['cpu_history', 'interfaces', 'memory_history', 'process_memory'].every(key => metrics.getItem(key)?.length)
            && (metrics.getItem('disk_history')?.length || metrics.getItem('disk_status'));
    });
    assert.equal(await monitor.evaluate(() => window.gramlot.data.getItem('monitor.error')), '');
    await preview.getByRole('tab', {name: 'Explanation', exact: true}).click();
    await page.locator('#readme-system-monitor-01').getByRole('heading', {name: 'System monitor', exact: true}).waitFor();
    await preview.getByRole('tab', {name: 'Code', exact: true}).click();
    const editor = page.locator('#code-system-monitor-01');
    await editor.waitFor();
    assert.match(await editor.evaluate(element => element.parameters.value), /class PsutilHandler:/);
    assert.deepEqual(errors, []);
    console.log('PASS System monitor: live readings, chart, Stop/Play, ten panels, explanation and source');
} finally {
    await browser.close();
}
