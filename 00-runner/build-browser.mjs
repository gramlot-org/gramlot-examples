/** Build the provisional runner's scripts separately from Gramlot's runtime. */
import {build} from 'esbuild';
import {copyFile, mkdir, readFile, readdir, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

const directory = new URL('./', import.meta.url);
const output = new URL('dist/', directory);
await mkdir(output, {recursive: true});
const result = await build({
    entryPoints: {
        runner: fileURLToPath(new URL('browser/entry.js', directory)),
        frame: fileURLToPath(new URL('browser/frame-entry.js', directory)),
    },
    outdir: fileURLToPath(output), bundle: true, format: 'iife',
    platform: 'browser', target: 'es2022', legalComments: 'inline', metafile: true,
});
// Keep notices for every bundled dependency, including transitive Bag dependencies.
const packages = new Set();
for (const input of Object.keys(result.metafile.inputs)) {
    const matches = [...input.matchAll(/(?:^|\/)node_modules\/((?:@[^/]+\/)?[^/]+)/g)];
    if (!matches.length) continue; // Our own runner files use the root LICENSE/NOTICE.
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
    await copyFile(new URL(`../../${name}`, directory), new URL(name, output));
}
console.log('Runner browser scripts built.');
