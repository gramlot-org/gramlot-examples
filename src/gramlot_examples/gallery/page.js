import {collections} from './collections.js';
/** Node integration: provide original example text to the browser-safe gallery UI. */
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {availableFilters, buildGallery, navigationDirectory} from '../index.js';
import {GalleryPage} from './gallery-page.js';

/** An environment subclass sets `catalogs`, the pairs `[catalog.json, pages folder]` of `buildGallery`. */
export class Page extends GalleryPage {
    static gramlots = collections;
    static logoUrl = '/assets/branding/svg/gramlot-horizontal-primary.svg';
    static catalogs = [];
    /** The filters that match at least one lesson of this host, the first one being the default. */
    static get filters() { return availableFilters(buildGallery({catalogs: this.catalogs})); }
    static get navigation() { return this.navigationRoot(); }
    static navigationRoot(filter = null) {
        const navigation = navigationDirectory('', this.catalogs, filter);
        navigation.setItem('features', null, {title:'Features', key:'features', category:false});
        return navigation;
    }
    navigation_section({directory, filter = null}) {
        const {catalogs} = this.constructor;
        return directory === '' ? this.constructor.navigationRoot(filter) : navigationDirectory(directory, catalogs, filter);
    }

    static get families() {
        const {families, routes} = buildGallery({catalogs: this.catalogs});
        return families.map(({key, title, path, examples}) => {
            const read = name => readFileSync(join(path, name), 'utf8');
            return {
                key, title, get readme() { return read('README.md'); },
                examples: examples.map(example => ({
                    key: example.key, presentation: example.presentation, title: example.title, description: example.description, folder: example.folder, frameUrl: routes[example.key].url,
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
