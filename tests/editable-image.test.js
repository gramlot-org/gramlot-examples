import test from 'node:test';
import assert from 'node:assert/strict';
import {Page} from '../src/gramlot_examples/pages/07-tools/02-advanced/04-editable_image.js';

test('application target returns a temporary displayable image URL', () => {
    const target = new Page().save_image({});
    target.write(new Uint8Array([99,114,111])); target.write(new Uint8Array([112]));
    assert.deepEqual(target.finish(), {state:'completed',result:'data:image/png;base64,Y3JvcA=='});
    assert.equal(target.status().state,'completed');
});
test('application target cancels without saving', () => {
    const target = new Page().save_image({}); target.write(new Uint8Array([1]));
    assert.deepEqual(target.abort(), {state:'unsaved'});
});
