import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {renderReadme} from '../src/gramlot_examples/gallery/browser/markdown.js';

function fixture(t, text) {
    const dom=new JSDOM('<article></article>');t.after(()=>dom.window.close());
    const node=dom.window.document.querySelector('article');node.textContent=text;return node;
}
test('gallery prose renders headings, tables, code and safe HTML with the shared parser', async t=>{
    const node=fixture(t,'# Guide\n\n**Bold** and ~~old~~.\n\n| A | B |\n| - | - |\n| 1 | 2 |\n\n```python\nroot.div()\n```\n\n<details><summary>More</summary>Details</details>\n\n<img src="x" onerror="bad()"><script>bad()</script>\n\n[bad](javascript:alert(1))');
    await renderReadme(node);
    assert.equal(node.querySelector('h1').textContent,'Guide');
    assert.equal(node.querySelector('strong').textContent,'Bold');
    assert.equal(node.querySelector('s').textContent,'old');
    assert.equal(node.querySelectorAll('td').length,2);
    assert.equal(node.querySelector('code.language-python').textContent,'root.div()\n');
    assert.equal(node.querySelector('summary').textContent,'More');
    assert.equal(node.querySelector('script,[onerror],[href^="javascript:"]'),null);
});
test('a deferred render never replaces a newer description or a removed node', async t=>{
    const node=fixture(t,'# Original');const pending=renderReadme(node);node.textContent='# New';await pending;
    assert.equal(node.textContent,'# New');assert.equal(node.querySelector('h1'),null);
    const next=renderReadme(node);node.remove();await next;
    assert.equal(node.textContent,'# New');
});
