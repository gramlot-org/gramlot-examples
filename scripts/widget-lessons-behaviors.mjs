import assert from 'node:assert/strict';

export const widgetLessonsBehaviors = {
    async 'transform-pane'(page) {
        const stage = page.locator('#transform-stage');
        await stage.scrollIntoViewIfNeeded();
        const bounds = await stage.boundingBox();
        assert.ok(bounds, 'Transform stage is visible');
        const x = Math.round(bounds.x + bounds.width / 2);
        const y = Math.round(bounds.y + bounds.height / 2);
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x + 40, y + 30, {steps: 5});
        await page.mouse.up();

        const readPose = () => page.evaluate(() =>
            ['x', 'y', 'rotate', 'zoom'].map(name => gramlot.data.getItem('transformDemo.pose.' + name))
        );
        const report = page.locator('#transform-last-gesture');
        assert.deepEqual(await readPose(), [40, 30, 0, 1]);
        assert.match(await report.textContent(), /^Last gesture:/);
        const lastGesture = await report.textContent();

        for (const [label, value] of [['Angle (°)', '30'], ['Zoom', '2']]) {
            const field = page.getByRole('textbox', {name: label, exact: true});
            await field.press('ControlOrMeta+a');
            await field.pressSequentially(value);
            await field.press('Tab');
        }
        assert.deepEqual(await readPose(), [40, 30, 30, 2]);
        assert.equal(await page.locator('#transform-card').evaluate(card => card.style.transform),
            'translate(40px, 30px) rotate(30deg) scale(2)');
        assert.equal(await report.textContent(), lastGesture);

        const note = page.getByRole('textbox', {name: 'Card note', exact: true});
        await note.fill('Keep this note');
        await page.getByRole('button', {name: 'Reset pose', exact: true}).click();
        assert.deepEqual(await readPose(), [0, 0, 0, 1]);
        assert.equal(await note.inputValue(), 'Keep this note');
        assert.equal(await report.textContent(), lastGesture);
    },

    async 'tree-row-actions'(page, text) {
        const tree = page.locator('#row-actions-tree');
        const caption = name => tree.getByText(name, {exact: true});
        const inspect = page.locator('#inspect-row');
        await caption('Notes').click();
        await caption('Checklist').hover();
        await inspect.getByRole('button', {name: 'Inspect checklist'}).click();
        assert.equal(await text('#acted-row-path'), 'checklist');
        assert.equal(await text('#selected-row-path'), 'notes');

        // Some browsers keep focus on the clicked button, which retains its row context.
        await tree.locator('[role="treeitem"][data-path="archive"]').focus();
        await caption('Archive').hover();
        await inspect.waitFor({state: 'hidden'});
        await page.locator('#row-more').getByRole('button', {name: 'Open menu'}).click();
        await page.getByText('Record row path', {exact: true}).click();
        assert.equal(await text('#acted-row-path'), 'archive');
        assert.equal(await text('#selected-row-path'), 'notes');
    },
};
