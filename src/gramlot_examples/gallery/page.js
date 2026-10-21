/** Node integration: provide original example text to the browser-safe gallery UI. */
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {buildGallery, navigationDirectory} from '../index.js';
import {GalleryPage} from './gallery-page.js';

/** An environment subclass sets `catalogs`, the pairs `[catalog.json, pages folder]` of `buildGallery`. */
export class Page extends GalleryPage {
    static logoUrl = '/assets/branding/gramlot-logo-dark.svg';
    static catalogs = [];
    static get navigation() { return navigationDirectory('', this.catalogs); }
    navigation_section({directory}) { return navigationDirectory(directory, this.constructor.catalogs); }

    static get families() {
        const {families, routes} = buildGallery({catalogs: this.catalogs});
        return families.map(({key, title, path, examples}) => {
            const read = name => readFileSync(join(path, name), 'utf8');
            return {
                key, title, get readme() { return read('README.md'); },
                examples: examples.map(example => ({
                    key: example.key, title: example.title, description: example.description, folder: example.folder, frameUrl: routes[example.key].url,
                    get readme() { return read(`${example.folder}.md`); },
                    get source() { return read(`${example.folder}.js`); },
                    // The page module shows its own Logic; only a companion NN_name_aux.js is shown apart.
                    get logic() { return routes[example.key].logic === routes[example.key].page
                        ? null : readFileSync(routes[example.key].logic, 'utf8'); },
                })),
            };
        });
    }
}

Page.registerEndpoint('navigation_section');
