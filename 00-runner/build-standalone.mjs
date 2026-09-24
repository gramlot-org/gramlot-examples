/** Package the shared runner and examples for direct local-file use. */
import {mkdtemp, readFile, readdir, rm, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildDirectory} from '@gramlot/minimal/directory';
import './build-browser.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const examplesRoot = resolve(root, 'examples');
const catalog = JSON.parse(await readFile(new URL('./catalog.json', import.meta.url), 'utf8'));
const temporary = await mkdtemp(resolve(examplesRoot, '.standalone-'));
try {
    const exampleContent = await Promise.all(catalog.map(async ({key, title, folder}) => ({
        key, title, folder, frameUrl: `${key}/index.html`,
        readme: await readFile(resolve(examplesRoot, 'html_svg', folder, 'README.md'), 'utf8'),
        source: await readFile(resolve(examplesRoot, 'html_svg', folder, 'page.js'), 'utf8'),
    })));
    const categoryReadme = await readFile(resolve(examplesRoot, 'html_svg/README.md'), 'utf8');
    const entry = resolve(temporary, 'index.js');
    await writeFile(entry, `import {RunnerPage} from ${JSON.stringify(resolve(examplesRoot, '00-runner/runner-page.js'))};
export class Page extends RunnerPage {
    static logoUrl = 'assets/branding/gramlot-logo-dark.svg';
    static runnerScript = 'examples/00-runner/dist/runner.js';
    static categoryReadme = ${JSON.stringify(categoryReadme)};
    static exampleContent = ${JSON.stringify(exampleContent)};
}
`);
    const pages = {index: entry};
    const paths = ['themes/gramlot-base/theme.css', 'examples/00-runner/runner.css',
        'assets/branding/gramlot-logo-dark.svg', 'examples/html_svg/README.md',
        ...['runner.js', 'frame.js', 'notices.json', 'LICENSE', 'NOTICE'].map(name => `examples/00-runner/dist/${name}`)];
    for (const {key, folder} of catalog) {
        const page = resolve(temporary, `${key}.js`);
        await writeFile(page, `import {Page as ExamplePage} from ${JSON.stringify(resolve(examplesRoot, 'html_svg', folder, 'page.js'))};
export class Page extends ExamplePage {
    main(root) {
        super.main(root);
        root.script({src: '../examples/00-runner/dist/frame.js'});
    }
}
`);
        pages[key] = page;
        const directory = `examples/html_svg/${folder}`;
        for (const name of await readdir(resolve(root, directory))) {
            if (['page.py', 'page.js', 'README.md', 'style.css'].includes(name)) paths.push(`${directory}/${name}`);
        }
    }
    const output = resolve(process.argv[2] ?? resolve(root, 'build/examples-standalone'));
    const result = await buildDirectory({pages, output,
        assets: paths.map(target => ({source: resolve(root, target), target}))});
    console.log(`Static runner built: ${result.output}`);
} finally {
    await rm(temporary, {recursive: true, force: true});
}
