/** Gramlot example pages, the gallery page and its catalogue. */
import {existsSync, readFileSync} from 'node:fs';
import {basename, extname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const PACKAGE = fileURLToPath(new URL('./', import.meta.url));
const MEDIA_TYPES = {'.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json'};
const SUFFIXES = ['.py', '.js', '.css', '.md', '_aux.js'];
const DIST = ['gallery.js', 'frame.js', 'notices.json', 'LICENSE', 'NOTICE'];

/** Media type of a gallery asset; only the built gallery scripts are served as JavaScript. */
function mediaType(path, script = false) {
    if (script) return 'application/javascript';
    return MEDIA_TYPES[extname(path)] ?? 'text/plain';
}

/** Load one `catalog.json` and check its `environment` against the key rule. */
function readCatalog(catalog, pages, common) {
    const data = JSON.parse(readFileSync(catalog, 'utf8'));
    const {environment} = data;
    if (common && environment !== undefined) throw new Error(`The common catalogue declares an environment: ${catalog}`);
    if (!common && !environment) throw new Error(`An environment catalogue has no environment: ${catalog}`);
    const pattern = common ? null : new RegExp(`^${environment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-\\d{2}$`);
    return data.families.map(family => {
        for (const example of family.examples) {
            if (pattern && !pattern.test(example.key)) {
                throw new Error(`Example key '${example.key}' does not match ${environment}-NN: ${catalog}`);
            }
        }
        return {...family, path: join(pages, family.key)};
    });
}

/**
 * Return the families, routes and static assets of the common gallery plus `catalogs`.
 *
 * Each item of `catalogs` is a pair `[catalog.json, pages folder]` of one environment.
 * `routes` maps each key to its JavaScript page, its same-name stylesheet and its logic
 * module: `NN_name_aux.js`, else `NN_name.js`, the page module itself, whose `Logic` export
 * the host takes (the host throws when both hold a `Logic`). `assets` maps each URL to its
 * file and media type. Nothing is written or served here.
 */
export function buildGallery({catalogs = []} = {}) {
    const families = readCatalog(join(PACKAGE, 'catalog.json'), join(PACKAGE, 'pages'), true);
    for (const [catalog, pages] of catalogs) families.push(...readCatalog(catalog, pages, false));
    const keys = ['index', ...families.flatMap(family => [family.key, ...family.examples.map(({key}) => key)])];
    const duplicates = [...new Set(keys.filter((key, index) => keys.indexOf(key) !== index))].sort();
    if (duplicates.length) throw new Error(`Duplicate gallery keys: ${duplicates.join(', ')}`);

    const gallery = join(PACKAGE, 'gallery');
    const resolve = specifier => fileURLToPath(import.meta.resolve(specifier));
    const routes = {index: {page: join(gallery, 'page.js'), stylesheet: null, logic: null}};
    const filesByUrl = [
        ['/themes/gramlot-base/theme.css', resolve('@gramlot/gramlot/themes/gramlot-base/theme.css')],
        ['/assets/branding/gramlot-logo-dark.svg', resolve('@gramlot/gramlot/assets/branding/gramlot-logo-dark.svg')],
        ['/gallery/gallery.css', join(gallery, 'gallery.css')],
        ...['page.py', 'page.js'].filter(name => existsSync(join(gallery, name)))
            .map(name => [`/gallery/${name}`, join(gallery, name)]),
    ];
    const assets = Object.fromEntries(filesByUrl.map(([url, path]) => [url, {file: path, type: mediaType(path)}]));
    for (const name of DIST) {
        const path = join(gallery, 'dist', name);
        assets[`/gallery/dist/${name}`] = {file: path, type: mediaType(path, extname(path) === '.js')};
    }
    for (const family of families) {
        const folder = family.path;
        for (const example of family.examples) {
            const page = join(folder, `${example.folder}.js`);
            if (!existsSync(page)) throw new Error(`Missing page: ${page}`);
            const stylesheet = join(folder, `${example.folder}.css`);
            const logic = [join(folder, `${example.folder}_aux.js`), page].find(path => existsSync(path));
            routes[example.key] = {page, stylesheet: existsSync(stylesheet) ? stylesheet : null, logic};
            for (const suffix of SUFFIXES) {
                const source = join(folder, `${example.folder}${suffix}`);
                if (existsSync(source)) assets[`/pages/${family.key}/${basename(source)}`] = {file: source, type: mediaType(source)};
            }
        }
    }
    return {families, routes, assets};
}
