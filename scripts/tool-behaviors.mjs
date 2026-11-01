/** Local interactions shared by ordinary Python/JS gallery qualification.
 * Binary transfer and saved-document previews have separate host integration tests.
 */
import assert from 'node:assert/strict';

async function queueAndRemove(page, selector, path) {
    const queue = page.locator(selector);
    await queue.locator('input[type=file]').setInputFiles({name:'example.txt', mimeType:'text/plain', buffer:Buffer.from('Example attachment')});
    await page.waitForFunction(path => gramlot.data.getItem(path)?.getNodes().length === 1, path);
    await queue.getByRole('button', {name:'Select example.txt'}).click();
    assert.match(await queue.locator('li').innerText(), /example.txt/);
    await queue.getByRole('button', {name:'Remove', exact:true}).click();
    await page.waitForFunction(path => gramlot.data.getItem(path).getNodes().length === 0, path);
}

export const toolBehaviors = {
    upload_queue: page => queueAndRemove(page, '#upload-demo', 'uploadDemo.queue'),
    attachment_manager: page => queueAndRemove(page, '#attachment-manager gramlot-uploader', 'attachmentsDemo.queue'),
    async editable_image(page) {
        const widget = page.locator('#local-image');
        const png = await page.evaluate(() => {
            const canvas = document.createElement('canvas'); canvas.width=32; canvas.height=32;
            const ctx=canvas.getContext('2d'); ctx.fillStyle='#3388aa'; ctx.fillRect(0,0,32,32);
            return canvas.toDataURL('image/png').split(',')[1];
        });
        await widget.locator('input[type=file]').setInputFiles({name:'sample.png', mimeType:'image/png', buffer:Buffer.from(png,'base64')});
        await page.getByRole('dialog', {name:'Edit image'}).getByRole('button', {name:'Confirm', exact:true}).click();
        await page.waitForFunction(() => gramlot.data.getItem('imageDemo.localImage')?.startsWith('data:image/'));
        await widget.getByRole('button', {name:'Clear', exact:true}).click();
        await page.waitForFunction(() => !gramlot.data.getItem('imageDemo.localImage'));
    },
    async visual_source(page) {
        const source = page.locator('#visual-source-tree');
        await source.waitFor();
        await page.getByRole('button', {name:'Catalogue', exact:true}).click();
        await page.getByRole('searchbox', {name:'Search widgets', exact:true}).fill('tabContainer');
        await page.locator('#visual-widget-tree [data-path$=".tabContainer"] > .row').dragTo(source.locator('[data-path="pageRoot"] > .row'));
        await source.locator('[data-path="pageRoot.tabContainer_0"][aria-selected="true"]').waitFor();
        assert.equal(await page.getByRole('heading', {name:'Required parameters', exact:true}).count(), 0);
    }
};
