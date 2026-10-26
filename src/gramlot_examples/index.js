import {collections} from './gallery/collections.js';
/** Gramlot example pages, the gallery page and its catalogue. */
import {existsSync, readFileSync, readdirSync, statSync, lstatSync, realpathSync} from 'node:fs';
import {Bag} from '@gramlot/gramlot';
import {basename, extname, join, relative, sep, isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);

const PACKAGE = fileURLToPath(new URL('./', import.meta.url));
const MEDIA_TYPES = {'.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json'};
const SUFFIXES = ['.py', '.js', '.css', '.md', '_aux.js', '_data.tytx'];
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
        return {...family, path: join(pages, family.folder)};
    });
}

/**
 * Return the families, routes and static assets of the common gallery plus `catalogs`.
 *
 * Each item of `catalogs` is a pair `[catalog.json, pages folder]` of one environment.
 * `routes` maps each key to its JavaScript page, its same-name stylesheet and its logic
 * module: `NN_name_aux.js`, else `NN_name.js`, the page module itself, whose `Logic` export
 * the server takes (the server throws when both hold a `Logic`). `assets` maps each URL to its
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
        ['/catalog.json', join(PACKAGE, 'catalog.json')],
        ['/themes/gramlot-base/theme.css', resolve('@gramlot/gramlot/themes/gramlot-base/theme.css')],
        ...['gramlot-horizontal-primary', 'gramlot-horizontal-inverse'].map(name =>
            [`/assets/branding/svg/${name}.svg`, resolve(`@gramlot/gramlot/assets/branding/svg/${name}.svg`)]),
        ['/assets/branding/app-icon.png', resolve('@gramlot/gramlot/assets/branding/app-icon.png')],
        ['/gallery/gallery.css', join(gallery, 'gallery.css')],
        ...['page.py', 'page.js'].filter(name => existsSync(join(gallery, name)))
            .map(name => [`/gallery/${name}`, join(gallery, name)]),
    ];
    const assets = Object.fromEntries(filesByUrl.map(([url, path]) => [url, {file: path, type: mediaType(path)}]));
    assets['/trials/menu/theme_preview.js'] = {file:join(PACKAGE,'trials/menu/theme_preview.js'),type:'text/javascript'};
    for (const name of DIST) {
        const path = join(gallery, 'dist', name);
        assets[`/gallery/dist/${name}`] = {file: path, type: mediaType(path, extname(path) === '.js')};
    }
    for (const collection of collections) {
        assets[`/gallery/dist/${collection.name}/descriptor.js`] = {file:join(gallery,'dist',collection.name,'descriptor.js'),type:'text/javascript'};
        const folder = join(gallery,'dist',collection.name,'assets');
        for (const file of readdirSync(folder,{recursive:true})) {
            const absolute = join(folder,file);
            if (statSync(absolute).isFile()) assets[collection.module.slice(0, -'index.js'.length) + file] =
                {file:absolute,type:mediaType(absolute,extname(file)==='.js')};
        }
    }
    for (const family of families) {
        const folder = family.path;
        for (const example of family.examples) {
            const page = join(folder, `${example.folder}.js`);
            if (!existsSync(page)) throw new Error(`Missing page: ${page}`);
            const stylesheet = join(folder, `${example.folder}.css`);
            const logic = [join(folder, `${example.folder}_aux.js`), page].find(path => existsSync(path));
            routes[example.key] = {page, stylesheet: existsSync(stylesheet) ? stylesheet : null, logic, url: `pages/${family.folder}/${example.folder}`};
            for (const suffix of SUFFIXES) {
                const source = join(folder, `${example.folder}${suffix}`);
                if (existsSync(source)) assets[`/pages/${family.folder}/${relative(folder,source).split(sep).join('/')}`] = {file: source, type: mediaType(source)};
            }
        }
    }
    const known=new Set(Object.values(routes).map(route=>realpathSync(route.page)));
    const visit=(base,prefix)=>{
        for(const name of readdirSync(base).sort()) {
            const path=join(base,name);
            if(name.startsWith('.')||name.startsWith('_')||lstatSync(path).isSymbolicLink())continue;
            if(statSync(path).isDirectory())visit(path,`${prefix}/${name}`);
            else if(name.endsWith('.js')&&!name.endsWith('_aux.js')&&!known.has(realpathSync(path))) {
                const key=`${prefix}/${basename(name,'.js')}`;
                const stylesheet=path.slice(0,-3)+'.css';
                routes[key]={page:path,stylesheet:existsSync(stylesheet)?stylesheet:null,logic:null,url:key};
            }
        }
    };
    visit(join(PACKAGE,'pages'),'pages');
    for(const family of families)if(!family.path.startsWith(join(PACKAGE,'pages')+sep))visit(family.path,`pages/${family.folder}`);
    for (const route of Object.values(routes)) {
        const data = route.page.slice(0, -3) + '_data.tytx';
        route.data = existsSync(data) ? data : null;
    }
    return {families, routes, assets, collections};
}

/** Read the title from the actual page class, or the first Markdown H1. */
export function pageTitle(path) {
    if (extname(path) === '.md') {
        const match = readFileSync(path, 'utf8').match(/^# +(.+?)\s*#*\s*$/m);
        if (!match) throw new Error(`Markdown index requires a level-one heading: ${path}`);
        return match[1];
    }
    return require(path).Page.title;
}

export function directoryIndex(folder) {
    const indexes = ['00-index.js', '00-index.md'].map(name => join(folder, name)).filter(existsSync);
    if (indexes.length !== 1) throw new Error(`Directory requires exactly one executable or Markdown index: ${folder}`);
    return indexes[0];
}

/** Read one numbered filesystem level, without exposing its own index. */
export function navigationDirectory(directory = '', catalogs = []) {
    const families = readCatalog(join(PACKAGE, 'catalog.json'), join(PACKAGE, 'pages'), true);
    for (const [catalog, pages] of catalogs) families.push(...readCatalog(catalog, pages, false));
    const groups = new Map(families.map(group => [group.folder, group]));
    const parts = directory ? directory.split('/') : [];
    if (parts.some(part => !/^[A-Za-z0-9_-]+$/.test(part))) throw new Error('Invalid navigation directory');
    const boundary = parts.length && groups.has(parts[0]) ? groups.get(parts[0]).path : join(PACKAGE, 'pages');
    const folder = join(boundary, ...(parts.length && groups.has(parts[0]) ? parts.slice(1) : parts));
    const rel = relative(realpathSync(boundary), realpathSync(folder));
    if (rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) throw new Error('Navigation directory is outside its pages root');
    const folders = parts.length ? families.filter(family => family.folder === parts[0]).map(family => join(family.path, ...parts.slice(1))) : [folder];
    const files = new Map(folders.flatMap(directory => readdirSync(directory).map(name => [name, join(directory, name)])));
    if (!parts.length) for (const [name, group] of groups) files.set(name, group.path);
    const bag = new Bag();
    for (const [name, path] of [...files].sort(([a], [b]) => a.localeCompare(b))) {
        if (name.startsWith('.') || name.startsWith('_') || lstatSync(path).isSymbolicLink()) continue;
        const childPath = [...parts, name].join('/');
        if (statSync(path).isDirectory()) {
            const index = directoryIndex(path);
            const attrs = {title: pageTitle(index), category: true, directory: childPath, url: `pages/${childPath}/00-index`};
            if (extname(index) === '.md') attrs.markdown = readFileSync(index, 'utf8');
            bag.setItem(!parts.length && groups.has(name) ? groups.get(name).key : name, null, attrs);
        } else if (extname(path) === '.js' && basename(name, '.js') !== '00-index' && !name.endsWith('_aux.js')) {
            const stem = basename(name, '.js');
            const example = families.filter(family => family.folder === parts[0]).flatMap(family => family.examples).find(item => item.folder === [...parts.slice(1), stem].join('/'));
            const attrs = {title: pageTitle(path), url: `pages/${[...parts, stem].join('/')}`, category: false};
            if (example) attrs.key = example.key;
            bag.setItem(example ? example.key : stem, null, attrs);
        }
    }
    return bag;
}
