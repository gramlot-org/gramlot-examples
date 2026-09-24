import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {FileHost} from '@gramlot/native-html/server';
import {Gramlot} from '@gramlot/native-html';
import {JSDOM} from 'jsdom';

const pages = fileURLToPath(new URL('../pages/', import.meta.url));

test('JS host loads the Hello World page and returns one typed heading', async () => {
    const host = new FileHost(pages);
    const opened = await host.openPage('/');
    assert.match(opened.html, /<title>Hello World<\/title>/);
    assert.match(opened.html, /gramlot-root/);
    const wire = await host.main(opened.pageId);
    const document = new JSDOM('<div id="gramlot-root"></div>').window.document;
    const app = new Gramlot({document, pageId: opened.pageId, transport: {main: async () => wire}});
    await app.start();
    const tree = app.source.getItem('main');
    assert.equal(tree.constructor.tytxSuffix, 'SOURCE');
    assert.equal(tree.getNodes().length, 1);
    const heading = tree.getNodes()[0];
    assert.equal(heading.nodeTag, 'h1');
    assert.equal(heading.value, 'Hello World');
    assert.equal(document.querySelector('#gramlot-root h1').textContent, 'Hello World');
    app.dispose();
    assert.equal(document.querySelector('#gramlot-root').childNodes.length, 0);
    host.closePage(opened.pageId);
});
