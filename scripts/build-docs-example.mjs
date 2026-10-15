/** Build the manual's standalone inspector example with the standard exporter. */
import {mkdir, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {buildDirectory} from '@gramlot/gramlot-serverless/directory';
import {buildGallery} from '../src/gramlot_examples/index.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const stage = join(root, 'build/docs-example');
await mkdir(stage, {recursive: true});
const {routes, assets} = buildGallery();
await writeFile(join(stage, 'index.js'), `import {Page as Example} from ${JSON.stringify(routes.b01.page)};
export class Page extends Example {
    async main(root) {
        root.div({style: 'padding: .5rem 1rem; text-align: right'})
            .button('Inspector', {type: 'button', id: 'gallery-inspector',
                aria_label: 'Inspector', aria_pressed: 'false', disabled: true});
        await super.main(root);
        root.script({src: 'gallery/dist/inspector.js'});
    }
}
`);
await writeFile(join(stage, 'index_aux.js'), `export {Logic} from ${JSON.stringify(routes.b01.logic)};\n`);
const copied = Object.entries(assets)
    .filter(([url]) => /\/(LICENSE|NOTICE|notices.json)$/.test(url))
    .map(([url, {file}]) => ({source: file, target: url.slice(1)}));
copied.push({source: join(root, 'src/gramlot_examples/gallery/dist/inspector.js'),
    target: 'gallery/dist/inspector.js'});
await buildDirectory({pages: {index: join(stage, 'index.js')},
    output: join(root, 'build/docs-source/_extra/inspector'), assets: copied});
console.log('Built the Pointers inspector playground for the manual.');
