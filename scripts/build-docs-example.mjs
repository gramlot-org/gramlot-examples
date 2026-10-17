/** Build every manual lesson as a standalone example with the standard exporter. */
import {copyFile, mkdir, rm, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {buildDirectory} from '@gramlot/gramlot-serverless/directory';
import {buildGallery} from '../src/gramlot_examples/index.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const stage = join(root, 'build/docs-example');
await rm(stage, {recursive: true, force: true});
const {families, routes, assets, collections} = buildGallery();
const copied = Object.entries(assets)
    .filter(([url]) => /\/(LICENSE|NOTICE|notices.json)$/.test(url) || collections.some(item => item.module === url))
    .map(([url, {file}]) => ({source: file, target: url.slice(1)}));
copied.push({source: join(root, 'src/gramlot_examples/gallery/dist/inspector.js'),
    target: 'gallery/dist/inspector.js'});
for (const {key} of families.flatMap(family => family.examples)) {
    const route = routes[key];
    const folder = join(stage, key);
    await mkdir(folder, {recursive: true});
    await writeFile(join(folder, 'index.js'), `import {Page as Example} from ${JSON.stringify(route.page)};
export class Page extends Example {
    async main(root) {
        const inspector = root.div({style: 'padding: .25rem .5rem; text-align: right'})
            .button({type: 'button', id: 'gallery-inspector', title: 'Open inspector',
                aria_label: 'Inspector', aria_pressed: 'false', disabled: true,
                style: 'display: inline-flex; align-items: center; justify-content: center; padding: 0; inline-size: 28px; block-size: 28px; min-block-size: 28px; border: 0; background: transparent; box-shadow: none; font-size: 16px; line-height: 1'});
        inspector.span('🔍', {aria_hidden: 'true'});
        await super.main(root);
        root.script({src: 'gallery/dist/inspector.js'});
    }
}
`);
    await writeFile(join(folder, 'index_aux.js'), `export {Logic} from ${JSON.stringify(route.logic)};\n`);
    if (route.stylesheet) await copyFile(route.stylesheet, join(folder, 'index.css'));
    await buildDirectory({pages: {index: join(folder, 'index.js')},
        output: join(root, 'build/docs-source/_extra/playgrounds', key), assets: copied, collections});
}
console.log(`Built ${families.reduce((count, family) => count + family.examples.length, 0)} manual playgrounds.`);
