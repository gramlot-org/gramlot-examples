/** Node integration: provide original example text to the browser-safe gallery UI. */
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {buildGallery} from '../index.js';
import {GalleryPage} from './gallery-page.js';

/** An environment subclass sets `catalogs`, the pairs `[catalog.json, pages folder]` of `buildGallery`. */
export class Page extends GalleryPage {
    static logoUrl = '/assets/branding/gramlot-logo-dark.svg';
    static catalogs = [];

    static get families() {
        const {families, routes} = buildGallery({catalogs: this.catalogs});
        return families.map(({key, title, path, examples}) => {
            const read = name => readFileSync(join(path, name), 'utf8');
            return {
                key, title, readme: read('README.md'),
                examples: examples.map(example => ({
                    key: example.key, title: example.title, folder: example.folder, frameUrl: example.key,
                    readme: read(`${example.folder}.md`),
                    source: read(`${example.folder}.js`),
                    // The page module shows its own Logic; only a companion NN_name_aux.js is shown apart.
                    logic: routes[example.key].logic === routes[example.key].page
                        ? null : readFileSync(routes[example.key].logic, 'utf8'),
                })),
            };
        });
    }
}
