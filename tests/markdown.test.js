import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag} from '@genrojs/bag';
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
test('relative lesson links become gallery routes; navigation lessons open in the gallery', async t=>{
    const node=fixture(t,'[Lists](03-lists.md) [Binding](../../02-binding/01-paths_and_updates/01-pointers.md#start) '+
        '[Hidden](../04-page_composition/03-complete_page.md) [Folder](../README.md) [Guide](https://gramlot.readthedocs.io/x.html) [Top](#top)');
    const lessons=new Bag();
    lessons.setItem('e03',null,{family:'html_svg',url:'pages/00-html_svg/01-html_basics/03-lists'});
    lessons.setItem('b01',null,{family:'binding',url:'pages/02-binding/01-paths_and_updates/01-pointers'});
    await renderReadme(node,{base:'pages/00-html_svg/01-html_basics/01-hello_world',lessons});
    const links=[...node.querySelectorAll('a')].map(a=>[a.getAttribute('href'),a.dataset.galleryLesson??null,a.getAttribute('target')]);
    assert.deepEqual(links,[
        ['pages/00-html_svg/01-html_basics/03-lists','e03',null],
        ['pages/02-binding/01-paths_and_updates/01-pointers','b01',null],
        ['pages/00-html_svg/04-page_composition/03-complete_page',null,'_blank'],
        ['pages/00-html_svg/00-index',null,'_blank'],
        ['https://gramlot.readthedocs.io/x.html',null,null],
        ['#top',null,null],
    ]);
});
test('without a base the links stay as written', async t=>{
    const node=fixture(t,'[Lists](03-lists.md)');
    await renderReadme(node);
    assert.equal(node.querySelector('a').getAttribute('href'),'03-lists.md');
});
