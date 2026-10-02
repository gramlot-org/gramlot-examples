/** Node integration: provide original example text to the browser-safe runner UI. */
import {existsSync, readFileSync} from 'node:fs';
import catalog from './catalog.json' with {type: 'json'};
import {RunnerPage} from './runner-page.js';

export class Page extends RunnerPage {
    static logoUrl = '/assets/branding/gramlot-logo-dark.svg';
    static families = catalog.map(({key, title, examples}) => {
        const folder = new URL(`../${key}/`, import.meta.url);
        const read = name => readFileSync(new URL(name, folder), 'utf8');
        return {
            key, title, readme: read('README.md'),
            examples: examples.map(example => ({
                key: example.key, title: example.title, folder: example.folder, frameUrl: example.key,
                readme: read(`${example.folder}.md`),
                source: read(`${example.folder}.js`),
                logic: existsSync(new URL(`${example.folder}_aux.js`, folder)) ? read(`${example.folder}_aux.js`) : null,
            })),
        };
    });
}
