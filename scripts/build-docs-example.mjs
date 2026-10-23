/** Build every manual lesson as a standalone example with the standard exporter. */
import {copyFile, mkdir, rm, writeFile} from 'node:fs/promises';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {join} from 'node:path';
import {buildDirectory} from '@gramlot/gramlot-serverless/directory';
import {buildGallery} from '../src/gramlot_examples/index.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const stage = join(root, 'build/docs-example');
await rm(stage, {recursive: true, force: true});
const {families, routes, assets, collections} = buildGallery();
const pages = {};
const copied = Object.entries(assets)
    .filter(([url]) => /\/(LICENSE|NOTICE|notices.json)$/.test(url) || collections.some(item => url.startsWith(item.module.slice(0,-'index.js'.length))))
    .map(([url, {file}]) => ({source: file, target: url.slice(1)}));
copied.push({source: join(root, 'src/gramlot_examples/gallery/dist/inspector.js'),
    target: 'gallery/dist/inspector.js'});
for (const {key} of families.flatMap(family => family.examples)) {
    const route = routes[key];
    const folder = join(stage, key);
    await mkdir(folder, {recursive: true});
    await writeFile(join(folder, 'index.js'), `import {Page as Example} from ${JSON.stringify(route.page)};
export class Page extends Example {
    static galleryUrls = ${JSON.stringify(Object.fromEntries(families.flatMap(f => f.examples).map(e => [e.key, `../${e.key}/index.html`])))};
    async main(root) {
        const inspector = root.div({style: 'padding: .25rem .5rem; text-align: right'})
            .button({type: 'button', id: 'gallery-inspector', title: 'Open inspector',
                aria_label: 'Inspector', aria_pressed: 'false', disabled: true,
                style: 'display: inline-flex; align-items: center; justify-content: center; padding: 0; inline-size: 28px; block-size: 28px; min-block-size: 28px; border: 0; background: transparent; box-shadow: none; font-size: 16px; line-height: 1'});
        inspector.span('🔍', {aria_hidden: 'true'});
        await super.main(root);
        root.script({src: ${JSON.stringify(key === 'typst_editor' ? 'gallery/dist/inspector.js' : '../gallery/dist/inspector.js')}});
    }
}
`);
    // A lesson module that names no client method exports no Logic and needs no companion.
    if ((await import(pathToFileURL(route.logic))).Logic) await writeFile(join(folder, 'index_aux.js'), `export {Logic} from ${JSON.stringify(route.logic)};\n`);
    if (route.stylesheet) await copyFile(route.stylesheet, join(folder, 'index.css'));
    pages[key] = join(folder, 'index.js');
}
// Export ordinary lessons together: one shared runtime and collection set.
// Keep the optional Typst compiler in its own export rather than loading it in every lesson.
const indexPage = join(stage, 'index.js');
await writeFile(indexPage, `import {Page as BasePage} from '@gramlot/gramlot/page';
export class Page extends BasePage {
    static title = 'Gramlot documentation playgrounds';
    main(root) {
        root.h1('Gramlot documentation playgrounds');
        const list = root.ul();
        for (const item of ${JSON.stringify(families.flatMap(f => f.examples))}) {
            list.li().a(item.title, {href: item.key + '/index.html'});
        }
    }
}`);
const {typst_editor: typstPage, ...ordinaryPages} = pages;
const output = join(root, 'build/docs-source/_extra/playgrounds');
await buildDirectory({pages: {index: indexPage, ...ordinaryPages}, output,
    assets: copied, collections: collections.filter(item => item.grammar.grammar.name !== 'typst')});
await buildDirectory({pages: {index: typstPage}, output: join(output, 'typst_editor'),
    assets: copied, collections});

console.log(`Built ${families.reduce((count, family) => count + family.examples.length, 0)} manual playgrounds.`);
