import test from 'node:test';
import assert from 'node:assert/strict';
import {Page} from '../src/gramlot_examples/pages/07-tools/02-advanced/03-attachment_manager.js';

test('attachment demonstration requires a saved record and isolates page sessions', () => {
    const first = new Page(); first.pageId = 'first';
    const other = new Page(); other.pageId = 'other';
    const metadata = {name:'notes.txt',mediaType:'text/plain',context:{recordId:null},fields:{title:'Notes'}};
    assert.throws(() => first.attach_file(metadata), /Save the record/);
    const id = first.save_record(); assert.equal(first.save_record(), id);
    metadata.context.recordId = id;
    const target = first.attach_file(metadata);
    target.write(new TextEncoder().encode('<b>literal</b>'));
    const attachment = target.finish().result.attachmentId;
    const context = {recordId:id};
    assert.equal(first.list_attachments({context}).getNodes().length, 1);
    assert.equal(first.preview_attachment({context,selected:attachment}).getItem('text'), '<b>literal</b>');
    assert.throws(() => other.list_attachments({context}), /Record does not match/);
    assert.throws(() => other.remove_attachment({context,selected:attachment}), /Record does not match/);
    assert.equal(first.remove_attachment({context,selected:attachment}), true);
    assert.equal(first.remove_attachment({context,selected:attachment}), false);
    assert.equal(first.list_attachments({context}).getNodes().length, 0);
});

test('attachment demonstration cancellation does not add a file', () => {
    const page = new Page(); page.pageId = 'cancel'; const recordId = page.save_record();
    const target = page.attach_file({name:'x',mediaType:'text/plain',context:{recordId},fields:{}});
    target.write(new Uint8Array([1,2]));
    assert.deepEqual(target.abort(), {state:'unsaved'});
    assert.equal(page.list_attachments({context:{recordId}}).getNodes().length, 0);
});


test('preview accepts raster images and refuses SVG', () => {
    const page = new Page(); page.pageId = 'image'; const recordId = page.save_record();
    for (const [mediaType, kind] of [['image/png','image'], ['image/svg+xml','message']]) {
        const target = page.attach_file({name:'sample',mediaType,context:{recordId},fields:{}});
        target.write(new Uint8Array([1,2,3]));
        const selected = target.finish().result.attachmentId;
        const preview = page.preview_attachment({context:{recordId},selected});
        assert.equal(preview.getItem('kind'), kind);
        if (kind === 'image') assert.match(preview.getItem('src'), /^data:image\/png;base64,/);
    }
});

test('attachment demonstration checks the shared record context', () => {
    const page = new Page(); page.pageId = 'wrong-context'; page.save_record();
    assert.throws(() => page.attach_file({name:'x',mediaType:'text/plain',fields:{},context:{recordId:'other'}}), /Record does not match/);
});
