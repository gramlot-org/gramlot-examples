/** Package the shared runner and examples for direct local-file use. */
import {mkdtemp, readFile, readdir, rm, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildDirectory} from '@gramlot/serverless/directory';
import './build-browser.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const examplesRoot = resolve(root, 'examples');
// Only the HTML / SVG family: the binding and controllers families need a host with a Source
// transport and companion logic, which this export does not provide.
const family = JSON.parse(await readFile(new URL('./catalog.json', import.meta.url), 'utf8'))
    .find(({key}) => key === 'html_svg');
const catalog = family.examples;
const temporary = await mkdtemp(resolve(examplesRoot, '.standalone-'));
try {
    const exampleContent = await Promise.all(catalog.map(async ({key, title, folder}) => ({
        key, title, folder, frameUrl: `${key}/index.html`,
        readme: await readFile(resolve(examplesRoot, 'html_svg', `${folder}.md`), 'utf8'),
        source: await readFile(resolve(examplesRoot, 'html_svg', `${folder}.js`), 'utf8'),
    })));
    const families = [{key: family.key, title: family.title,
        readme: await readFile(resolve(examplesRoot, 'html_svg/README.md'), 'utf8'), examples: exampleContent}];
    const entry = resolve(temporary, 'index.js');
    await writeFile(entry, `import {RunnerPage} from ${JSON.stringify(resolve(examplesRoot, '00-runner/runner-page.js'))};
export class Page extends RunnerPage {
    static logoUrl = 'assets/branding/gramlot-logo-dark.svg';
    static runnerScript = 'examples/00-runner/dist/runner.js';
    static families = ${JSON.stringify(families)};
}
`);
    const pages = {index: entry};
    const paths = ['themes/gramlot-base/theme.css', 'examples/00-runner/runner.css',
        'assets/branding/gramlot-logo-dark.svg', 'examples/html_svg/README.md',
        ...['runner.js', 'frame.js', 'notices.json', 'LICENSE', 'NOTICE'].map(name => `examples/00-runner/dist/${name}`)];
    const exampleFiles = await readdir(resolve(examplesRoot, 'html_svg'));
    for (const {key, folder} of catalog) {
        const page = resolve(temporary, `${key}.js`);
        // The standalone core has no companion lookup: the same-name stylesheet joins Page.css here.
        const companion = exampleFiles.includes(`${folder}.css`)
            ? `\n    static css = [...ExamplePage.css, ${JSON.stringify(`/examples/html_svg/${folder}.css`)}];` : '';
        await writeFile(page, `import {Page as ExamplePage} from ${JSON.stringify(resolve(examplesRoot, 'html_svg', `${folder}.js`))};
export class Page extends ExamplePage {${companion}
    main(root) {
        super.main(root);
        root.script({src: '../examples/00-runner/dist/frame.js'});
    }
}
`);
        pages[key] = page;
        for (const suffix of ['py', 'js', 'md', 'css']) {
            if (exampleFiles.includes(`${folder}.${suffix}`)) paths.push(`examples/html_svg/${folder}.${suffix}`);
        }
    }
    const output = resolve(process.argv[2] ?? resolve(root, 'build/examples-standalone'));
    const result = await buildDirectory({pages, output,
        assets: paths.map(target => ({source: resolve(root, target), target}))});
    console.log(`Static runner built: ${result.output}`);
} finally {
    await rm(temporary, {recursive: true, force: true});
}
