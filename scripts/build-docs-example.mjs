/** Build the manual's one-example inspector gallery with the standard exporter. */
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {buildDirectory} from '@gramlot/gramlot-serverless/directory';
import {buildGallery} from '../src/gramlot_examples/index.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const stage = join(root, 'build/docs-example');
await mkdir(stage, {recursive: true});
const {families, routes, assets} = buildGallery();
const family = families.find(item => item.key === 'binding');
const example = family.examples.find(item => item.key === 'b01');
const read = file => readFile(file, 'utf8');
const content = [{key: family.key, title: family.title, readme: await read(join(family.path, 'README.md')),
    examples: [{...example, frameUrl: 'b01/index.html',
        readme: await read(join(family.path, `${example.folder}.md`)),
        source: await read(routes.b01.page), logic: null}]}];
const galleryPage = join(root, 'src/gramlot_examples/gallery/gallery-page.js');
await writeFile(join(stage, 'index.js'), `import {GalleryPage} from ${JSON.stringify(galleryPage)};
export class Page extends GalleryPage {
    static title = 'Inspector playground';
    static installable = false;
    static logoUrl = 'assets/branding/gramlot-logo-dark.svg';
    static galleryScript = 'gallery/dist/gallery.js';
    static families = ${JSON.stringify(content)};
}
`);
await writeFile(join(stage, 'b01.js'), `import {Page as Example} from ${JSON.stringify(routes.b01.page)};
export class Page extends Example {
    async main(root) {
        await super.main(root);
        root.script({src: '../gallery/dist/frame.js'});
    }
}
`);
await writeFile(join(stage, 'b01_aux.js'), `export {Logic} from ${JSON.stringify(routes.b01.logic)};\n`);
const copied = Object.entries(assets)
    .filter(([url]) => url === '/gallery/gallery.css' || url.startsWith('/gallery/dist/') || url.startsWith('/assets/branding/'))
    .map(([url, {file}]) => ({source: file, target: url.slice(1)}));
await buildDirectory({pages: {index: join(stage, 'index.js'), b01: join(stage, 'b01.js')},
    output: join(root, 'build/docs-source/_extra/inspector'), assets: copied});
console.log('Built the Pointers inspector playground for the manual.');
