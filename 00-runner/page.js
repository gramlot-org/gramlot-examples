/** Node integration: provide original example text to the browser-safe runner UI. */
import {readFileSync} from 'node:fs';
import examples from './catalog.json' with {type: 'json'};
import {RunnerPage} from './runner-page.js';

export class Page extends RunnerPage {
    static logoUrl = '/assets/branding/gramlot-logo-dark.svg';
    static categoryReadme = readFileSync(new URL('../html_svg/README.md', import.meta.url), 'utf8');
    static exampleContent = examples.map(({key, title, folder}) => {
        const directory = new URL(`../html_svg/${folder}/`, import.meta.url);
        return {
            key, title, folder, frameUrl: key,
            readme: readFileSync(new URL('README.md', directory), 'utf8'),
            source: readFileSync(new URL('page.js', directory), 'utf8'),
        };
    });
}
