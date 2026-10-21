/** Build the provisional gallery's scripts separately from Gramlot's runtime. */
import {build} from 'esbuild';
import {copyFile, mkdir, readFile, readdir, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {createRequire} from 'node:module';

const directory = new URL('../src/gramlot_examples/gallery/', import.meta.url);
const output = new URL('dist/', directory);
await mkdir(output, {recursive: true});
// Embed the canonical density stylesheet so hosted and file galleries share it
// without extra runtime requests or a second authored copy of the theme rules.
const require = createRequire(import.meta.url);
const compactStyle = await readFile(require.resolve('@gramlot/gramlot/themes/gramlot-compact/theme.css'), 'utf8');
const appearanceStyles = {base:'', compact:compactStyle};
for (const name of ['mimi', 'joanna']) {
    appearanceStyles[name] = compactStyle + '\n' + await readFile(require.resolve(`@gramlot/gramlot/themes/${name}/theme.css`), 'utf8');
}
await writeFile(new URL('theme-styles.js', output),
    `// Generated from canonical Gramlot themes.\nexport const appearanceStyles = ${JSON.stringify(appearanceStyles)};\n`);
const result = await build({
    entryPoints: {
        inspector: fileURLToPath(new URL('browser/inspector-entry.js', directory)),
        frame: fileURLToPath(new URL('browser/frame-entry.js', directory)),
    },
    outdir: fileURLToPath(output), bundle: true, format: 'iife',
    platform: 'browser', target: 'es2022', legalComments: 'inline', metafile: true,
    // The optional tool runs in the example frame and uses that frame's actual classes.
    // Its core import must never create a second Gramlot runtime in this bundle.
    plugins: [{name: 'inspector-runtime', setup(plugin) {
        plugin.onResolve({filter: /^@gramlot\/gramlot$/}, () => ({path: 'runtime', namespace: 'inspector-runtime'}));
        plugin.onLoad({filter: /.*/, namespace: 'inspector-runtime'}, () => ({loader: 'js', contents: `
            export const Gramlot = window.gramlot.constructor;
            export const Bag = window.gramlot.data.constructor;
            export const GramlotBuilder = window.gramlot.src.builder.constructor;
        `}));
    }}],
});
const galleryResult = await build({entryPoints: [fileURLToPath(new URL('browser/entry.js', directory))],
    outfile:fileURLToPath(new URL('gallery.js',output)), bundle:true, format:'esm', platform:'browser',
    target:'es2022', legalComments:'inline', metafile:true, plugins:[{name:'shared-runtime',setup(plugin){
        plugin.onResolve({filter:/^@gramlot\/gramlot$/},args=>({path:args.path,external:true}));
    }}]});
Object.assign(result.metafile.inputs,galleryResult.metafile.inputs);
// Keep notices for every bundled dependency, including transitive Bag dependencies.
const packages = new Set();
for (const input of Object.keys(result.metafile.inputs)) {
    const matches = [...input.matchAll(/(?:^|\/)node_modules\/((?:@[^/]+\/)?[^/]+)/g)];
    if (!matches.length) continue; // Our own gallery files use the root LICENSE/NOTICE.
    const match = matches.at(-1);
    packages.add(resolve(input.slice(0, match.index + match[0].length)));
}
const notices = [];
for (const directory of [...packages].sort()) {
    const metadata = JSON.parse(await readFile(resolve(directory, 'package.json'), 'utf8'));
    const files = (await readdir(directory)).filter(name => /^(licen[cs]e|notice|copying)([.-].*)?$/i.test(name));
    if (!files.length) throw new Error(`Missing bundled license for ${metadata.name}`);
    const text = (await Promise.all(files.sort().map(name => readFile(resolve(directory, name), 'utf8')))).join('\n\n');
    notices.push({name: metadata.name, text});
}
await writeFile(new URL('notices.json', output), JSON.stringify(notices, null, 2) + '\n');
for (const name of ['LICENSE', 'NOTICE']) {
    await copyFile(new URL(`../${name}`, import.meta.url), new URL(name, output));
}
console.log('Gallery browser scripts built.');

// Independent collection module: no second runtime, only descriptors and controls.
for (const name of ['inputs', 'layout', 'tree']) await build({entryPoints: [require.resolve(`@gramlot/gramlot/components/${name}`)],
    outfile: fileURLToPath(new URL(`${name}.js`, output)), bundle: true, format: 'esm',
    platform: 'browser', target: 'es2022', legalComments: 'inline', external: ['@gramlot/gramlot']});
