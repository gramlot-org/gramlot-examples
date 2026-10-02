/** Package the shared runner and examples for direct local-file use. */
import {mkdtemp, readFile, readdir, rm, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildDirectory} from '@gramlot/gramlot-browser/directory';
import './build-browser.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const pagesRoot = resolve(root, 'pages');
// Theme and logo come from the installed core package.
const core = resolve(root, 'node_modules/@gramlot/gramlot');
// Only the HTML / SVG family: the binding and controllers families need a host with a Source
// transport and companion logic, which this export does not provide.
const family = JSON.parse(await readFile(new URL('./catalog.json', import.meta.url), 'utf8'))
    .find(({key}) => key === 'html_svg');
const catalog = family.examples;
const temporary = await mkdtemp(resolve(root, '.standalone-'));
try {
    const exampleContent = await Promise.all(catalog.map(async ({key, title, folder}) => ({
        key, title, folder, frameUrl: `${key}/index.html`,
        readme: await readFile(resolve(pagesRoot, 'html_svg', `${folder}.md`), 'utf8'),
        source: await readFile(resolve(pagesRoot, 'html_svg', `${folder}.js`), 'utf8'),
    })));
    const families = [{key: family.key, title: family.title,
        readme: await readFile(resolve(pagesRoot, 'html_svg/README.md'), 'utf8'), examples: exampleContent}];
    const entry = resolve(temporary, 'index.js');
    await writeFile(entry, `import {RunnerPage} from ${JSON.stringify(resolve(root, 'runner/runner-page.js'))};
export class Page extends RunnerPage {
    static logoUrl = 'assets/branding/gramlot-logo-dark.svg';
    static runnerScript = 'runner/dist/runner.js';
    static families = ${JSON.stringify(families)};
}
`);
    const pages = {index: entry};
    const assets = [
        ...['themes/gramlot-base/theme.css', 'assets/branding/gramlot-logo-dark.svg']
            .map(target => ({source: resolve(core, target), target})),
        ...['runner/runner.css', 'pages/html_svg/README.md',
            ...['runner.js', 'frame.js', 'notices.json', 'LICENSE', 'NOTICE'].map(name => `runner/dist/${name}`)]
            .map(target => ({source: resolve(root, target), target})),
    ];
    const exampleFiles = await readdir(resolve(pagesRoot, 'html_svg'));
    for (const {key, folder} of catalog) {
        const page = resolve(temporary, `${key}.js`);
        // The standalone core has no companion lookup: the same-name stylesheet joins Page.css here.
        const companion = exampleFiles.includes(`${folder}.css`)
            ? `\n    static css = [...ExamplePage.css, ${JSON.stringify(`/pages/html_svg/${folder}.css`)}];` : '';
        await writeFile(page, `import {Page as ExamplePage} from ${JSON.stringify(resolve(pagesRoot, 'html_svg', `${folder}.js`))};
export class Page extends ExamplePage {${companion}
    main(root) {
        super.main(root);
        root.script({src: '../runner/dist/frame.js'});
    }
}
`);
        pages[key] = page;
        for (const suffix of ['py', 'js', 'md', 'css']) {
            const target = `pages/html_svg/${folder}.${suffix}`;
            if (exampleFiles.includes(`${folder}.${suffix}`)) assets.push({source: resolve(root, target), target});
        }
    }
    const output = resolve(process.argv[2] ?? resolve(root, 'build/examples-standalone'));
    const result = await buildDirectory({pages, output, assets});
    console.log(`Static runner built: ${result.output}`);
} finally {
    await rm(temporary, {recursive: true, force: true});
}
