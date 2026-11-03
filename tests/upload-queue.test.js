import test from 'node:test';
import assert from 'node:assert/strict';
import {Page} from '../src/gramlot_examples/pages/01-uploader/02-upload_queue.js';

test('upload queue example validates metadata and never persists bytes', () => {
    const page = new Page();
    assert.throws(() => page.inspect_file({fields:{title:42}}), /text/);
    const target = page.inspect_file({fields:{title:'Report',description:'Example'}});
    assert.equal(target.maxBytes, 1024 * 1024);
    target.write(new Uint8Array([1,2,3]));
    assert.deepEqual(target.finish(), {state:'completed',result:{size:3,fields:{title:'Report',description:'Example'}}});
    assert.equal(target.abort().state, 'completed');
    const cancelled = page.inspect_file({fields:{}});
    cancelled.write(new Uint8Array([1]));
    assert.deepEqual(cancelled.abort(), {state:'unsaved'});
});
