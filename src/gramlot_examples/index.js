import {collections} from './gallery/collections.js';
/** Gramlot example pages, the gallery page and its catalogue. */
import {existsSync, readFileSync, readdirSync, statSync, lstatSync, realpathSync} from 'node:fs';
import {Bag} from '@gramlot/gramlot';
import {basename, dirname, extname, join, relative, sep, isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);

const PACKAGE = fileURLToPath(new URL('./', import.meta.url));
const MEDIA_TYPES = {'.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json'};
const SUFFIXES = ['.py', '.js', '.css', '.md', '.json', '_aux.js', '_data.tytx'];
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
            checkRequires(example.requires, `${catalog}: ${example.key}`);
        }
        const entry = {...family, path: join(pages, family.folder)};
        if (family.examples.some(example => Object.hasOwn(example, 'sourceFiles'))) {
            entry.sourceRoot = realpathSync(dirname(catalog));
            for (const example of family.examples) if (Object.hasOwn(example, 'sourceFiles')) {
                resolveSourceFiles(entry.sourceRoot, example.sourceFiles);
            }
        }
        return entry;
    });
}

/** Resolve supplementary code paths inside the catalogue directory. */
export function resolveSourceFiles(root, names) {
    if (!Array.isArray(names) || names.length === 0 || names.some(name => typeof name !== 'string') || new Set(names).size !== names.length) {
        throw new Error('sourceFiles must be a non-empty list of distinct paths');
    }
    return names.map(name => {
        if (!name || name.includes('\\') || isAbsolute(name) || name.split('/').includes('..')) {
            throw new Error('sourceFiles paths must be relative to the catalogue directory');
        }
        const path = realpathSync(join(root, name));
        const rel = relative(root, path);
        if (!rel || rel.startsWith(`..${sep}`) || isAbsolute(rel) || !statSync(path).isFile() || !['.py', '.js'].includes(extname(path))) {
            throw new Error(`Invalid sourceFiles path: ${name}`);
        }
        return path;
    });
}

/**
 * Split `catalogs` into the common catalogue and the environment catalogues.
 *
 * The common catalogue is the package `catalog.json` with its `pages` folder, unless one item of
 * `catalogs` declares `"common": true`: that catalogue and its pages folder replace it, as in the
 * chart gallery. Returns `[[catalog, pages], [[catalog, pages], ...]]`.
 */
export function galleryCatalogs(catalogs) {
    const common = [], environments = [];
    for (const [catalog, pages] of catalogs) {
        (JSON.parse(readFileSync(catalog, 'utf8')).common === true ? common : environments).push([catalog, pages]);
    }
    if (common.length > 1) throw new Error(`A gallery has one common catalogue: ${common.map(([catalog]) => catalog).join(', ')}`);
    return [common[0] ?? [join(PACKAGE, 'catalog.json'), join(PACKAGE, 'pages')], environments];
}

/** A lesson's `requires` is absent or a list of non-empty strings. */
function checkRequires(requires, where) {
    if (requires !== undefined && (!Array.isArray(requires) || requires.some(need => typeof need !== 'string' || !need.trim()))) {
        throw new Error(`requires must be a list of non-empty strings: ${where}`);
    }
}

const nonEmptyStrings = list => Array.isArray(list) && list.length > 0 && list.every(need => typeof need === 'string' && need.trim());

/** The root groups of the navigation, in order: `key`, `title` and `description` (`groups.json`). */
export function readGroups() {
    const groups = JSON.parse(readFileSync(join(PACKAGE, 'groups.json'), 'utf8'));
    for (const group of groups) {
        const names = Object.keys(group).sort();
        if (names.join() !== 'description,key,title' || !names.every(name => typeof group[name] === 'string' && group[name].trim())) {
            throw new Error(`A group declares a non-empty key, title and description: ${JSON.stringify(group)}`);
        }
    }
    if (new Set(groups.map(group => group.key)).size !== groups.length) throw new Error('Duplicate group key in groups.json');
    return groups;
}

/** Each family `group` is declared; families sharing a folder agree; no group key is a family key. */
function checkGroups(families, groups) {
    const keys = new Set(groups.map(group => group.key));
    const byFolder = new Map();
    for (const family of families) {
        if (family.group === undefined) continue;
        if (!keys.has(family.group)) throw new Error(`Family '${family.key}' names an unknown group: '${family.group}'`);
        if (!byFolder.has(family.folder)) byFolder.set(family.folder, family.group);
        else if (byFolder.get(family.folder) !== family.group) throw new Error(`Families of folder '${family.folder}' name different groups`);
    }
    const clashes = families.map(family => family.key).filter(key => keys.has(key)).sort();
    if (clashes.length) throw new Error(`Group keys used as family keys: ${clashes.join(', ')}`);
    return byFolder;
}

/** Read the `filters.json` beside `catalog`: declared filters, or an empty list when absent. */
export function readFilters(catalog) {
    const path = join(dirname(catalog), 'filters.json');
    if (!existsSync(path)) return [];
    const rules = JSON.parse(readFileSync(path, 'utf8'));
    if (!Array.isArray(rules)) throw new Error(`filters.json must be a list: ${path}`);
    for (const rule of rules) {
        if (rule === null || typeof rule !== 'object' || Array.isArray(rule) || typeof rule.label !== 'string' || !rule.label.trim()) {
            throw new Error(`A filter requires a non-empty label: ${path}`);
        }
        if (Object.keys(rule).some(name => !['label', 'requires', 'any'].includes(name)) ||
            (Object.hasOwn(rule, 'requires') && Object.hasOwn(rule, 'any'))) {
            throw new Error(`Filter '${rule.label}' declares only label and one of requires or any: ${path}`);
        }
        if (Object.hasOwn(rule, 'requires') && !(Array.isArray(rule.requires) && rule.requires.length === 0)) {
            throw new Error(`Filter '${rule.label}': requires must be an empty list: ${path}`);
        }
        if (Object.hasOwn(rule, 'any') && !nonEmptyStrings(rule.any)) {
            throw new Error(`Filter '${rule.label}': any must be a non-empty list of strings: ${path}`);
        }
    }
    if (new Set(rules.map(rule => rule.label)).size !== rules.length) throw new Error(`Duplicate filter label: ${path}`);
    return rules;
}

/** The filters of every catalogue, in order; a label declared twice must be identical. */
export function mergeFilters(catalogs) {
    const filters = [];
    for (const catalog of catalogs) {
        for (const rule of readFilters(catalog)) {
            const known = filters.find(item => item.label === rule.label);
            if (!known) filters.push(rule);
            else if (JSON.stringify(known) !== JSON.stringify(rule)) {
                throw new Error(`Conflicting definitions of filter '${rule.label}': ${catalog}`);
            }
        }
    }
    return filters;
}

/** Whether a lesson with `requires` belongs to the filter `rule`. */
export function filterMatches(rule, requires) {
    requires = requires ?? [];
    if (Object.hasOwn(rule, 'any')) return rule.any.some(need => requires.includes(need));
    if (Object.hasOwn(rule, 'requires')) return requires.length === 0;
    return true;
}

/** The filters of `gallery` that match at least one of its catalogued lessons. */
export function availableFilters(gallery) {
    const lessons = gallery.families.flatMap(family => family.examples.map(example => example.requires));
    return gallery.filters.filter(rule => lessons.some(requires => filterMatches(rule, requires)));
}

/**
 * Return the families, routes, static assets and filters of the common gallery plus `catalogs`.
 *
 * Each item of `catalogs` is a pair `[catalog.json, pages folder]` of one environment, or of the
 * common catalogue of a separate gallery (`"common": true`, see `galleryCatalogs`).
 * `routes` maps each key to its JavaScript page, its same-name stylesheet and its logic
 * module: `NN_name_aux.js`, else `NN_name.js`, the page module itself, whose `Logic` export
 * the server takes (the server throws when both hold a `Logic`). `assets` maps each URL to its
 * file and media type. `filters` are the declared lesson filters of the `filters.json` files beside
 * the catalogues (see `availableFilters`). Nothing is written or served here.
 */
export function buildGallery({catalogs = []} = {}) {
    const [[commonCatalog, commonPages], environments] = galleryCatalogs(catalogs);
    const families = readCatalog(commonCatalog, commonPages, true);
    for (const [catalog, pages] of environments) families.push(...readCatalog(catalog, pages, false));
    const filters = mergeFilters([commonCatalog, ...environments.map(([catalog]) => catalog)]);
    checkGroups(families, readGroups());
    const keys = ['index', ...families.flatMap(family => [family.key, ...family.examples.map(({key}) => key)])];
    const duplicates = [...new Set(keys.filter((key, index) => keys.indexOf(key) !== index))].sort();
    if (duplicates.length) throw new Error(`Duplicate gallery keys: ${duplicates.join(', ')}`);

    const gallery = join(PACKAGE, 'gallery');
    const resolve = specifier => fileURLToPath(import.meta.resolve(specifier));
    const routes = {index: {page: join(gallery, 'page.js'), stylesheet: null, logic: null}};
    const filesByUrl = [
        ['/catalog.json', commonCatalog],
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
            if (Object.hasOwn(example, 'presentation')) routes[example.key].presentation = example.presentation;
            if (Object.hasOwn(example, 'sourceFiles')) {
                for (const source of resolveSourceFiles(family.sourceRoot, example.sourceFiles)) {
                    if (extname(source) !== '.js') continue;
                    const url = '/' + relative(family.sourceRoot, source).split(sep).join('/');
                    if (assets[url] && assets[url].file !== source) throw new Error(`Duplicate sourceFiles asset: ${url}`);
                    assets[url] = {file: source, type: mediaType(source, true)};
                }
            }
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
                for (const suffix of SUFFIXES) {
                    const source=path.slice(0,-3)+suffix;
                    if(existsSync(source)) assets[`/${key}${suffix}`]={file:source,type:mediaType(source)};
                }
            }
        }
    };
    visit(commonPages,'pages');
    for(const family of families)if(!family.path.startsWith(join(commonPages)+sep))visit(family.path,`pages/${family.folder}`);
    for (const route of Object.values(routes)) {
        const data = route.page.slice(0, -3) + '_data.tytx';
        route.data = existsSync(data) ? data : null;
    }
    return {families, routes, assets, collections, filters};
}

/** Read the title from the actual page class, or the first Markdown H1. */
export function pageTitle(path) {
    const metadata = path.slice(0, -extname(path).length) + ".json";
    if (existsSync(metadata)) {
        const {title} = JSON.parse(readFileSync(metadata, "utf8"));
        if (title) return title;
    }
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

/**
 * Read one numbered filesystem level, without exposing its own index.
 *
 * `filter` is the label of a declared filter. With one, only the lessons it matches are listed and
 * a directory without a matching lesson below it is omitted. `null` lists everything. The root
 * lists the groups of `groups.json` in order, then the families without `group`; a group lists its
 * families. No directory holds a single entry: a directory whose listing has one entry is replaced
 * by that entry, at every level, after the environment and the filter.
 */
export function navigationDirectory(directory = '', catalogs = [], filter = null) {
    const [[commonCatalog, commonPages], environments] = galleryCatalogs(catalogs);
    const families = readCatalog(commonCatalog, commonPages, true);
    for (const [catalog, pages] of environments) families.push(...readCatalog(catalog, pages, false));
    let rule = null;
    if (filter !== null && filter !== undefined) {
        rule = mergeFilters([commonCatalog, ...environments.map(([catalog]) => catalog)]).find(item => item.label === filter);
        if (!rule) throw new Error(`Unknown filter: ${filter}`);
        if (!Object.hasOwn(rule, 'any') && !Object.hasOwn(rule, 'requires')) rule = null;
    }
    const groups = readGroups();
    const byFolder = checkGroups(families, groups);
    const listing = path => path === '' || groups.some(group => group.key === path)
        ? navigationRoot(path, families, rule, groups, byFolder, commonPages) : navigationLevel(path, families, rule, commonPages);
    const bag = new Bag();
    for (let node of listing(directory).getNodes()) {
        while (node.attr.directory !== undefined) {
            const children = listing(node.attr.directory).getNodes();
            if (children.length !== 1) break;
            node = children[0];
        }
        bag.setItem(node.label, null, {...node.attr});
    }
    return bag;
}

/** The root level grouped by `groups`, or the families of the group `directory`. */
function navigationRoot(directory, families, rule, groups, byFolder, pages) {
    const members = new Map(groups.map(group => [group.key, []]));
    const ungrouped = [];
    for (const node of navigationLevel('', families, rule, pages).getNodes()) {
        const group = byFolder.get(node.attr.directory);
        (group ? members.get(group) : ungrouped).push(node);
    }
    const bag = new Bag();
    for (const group of groups) {
        const nodes = members.get(group.key);
        if (directory) {
            if (group.key === directory) for (const node of nodes) bag.setItem(node.label, null, {...node.attr});
        } else if (nodes.length) bag.setItem(group.key, null, {title: group.title, category: true, directory: group.key,
            url: `groups/${group.key}`, markdown: `# ${group.title}\n\n${group.description}\n`});
    }
    if (!directory) for (const node of ungrouped) bag.setItem(node.label, null, {...node.attr});
    return bag;
}

function navigationLevel(directory, families, rule, pages) {
    // Families sharing a folder are listed under the key of the first one.
    const groups = new Map();
    for (const family of families) if (!groups.has(family.folder)) groups.set(family.folder, family);
    const parts = directory ? directory.split('/') : [];
    if (parts.some(part => !/^[A-Za-z0-9_-]+$/.test(part))) throw new Error('Invalid navigation directory');
    const roots = families.filter(family => parts.length && family.folder === parts[0]).map(family => family.path);
    const suffix = roots.length ? parts.slice(1) : parts;
    const folders = [];
    for (const boundary of roots.length ? roots : [pages]) {
        const folder = join(boundary, ...suffix);
        if (!existsSync(folder)) continue;
        const rel = relative(realpathSync(boundary), realpathSync(folder));
        if (rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) throw new Error('Navigation directory is outside its pages root');
        if (statSync(folder).isDirectory()) folders.push(folder);
    }
    if (!folders.length) throw new Error('Navigation directory does not exist');
    const files = new Map(folders.flatMap(directory => readdirSync(directory).map(name => [name, join(directory, name)])));
    if (!parts.length) for (const [name, group] of groups) files.set(name, group.path);
    const bag = new Bag();
    for (const [name, path] of [...files].sort(([a], [b]) => a.localeCompare(b))) {
        if (name.startsWith('.') || name.startsWith('_') || lstatSync(path).isSymbolicLink()) continue;
        const childPath = [...parts, name].join('/');
        if (statSync(path).isDirectory()) {
            const descriptor = join(path, '00-index.json');
            if (existsSync(descriptor) && JSON.parse(readFileSync(descriptor,'utf8')).navigation === false) continue;
            const index = directoryIndex(path);
            if (rule && navigationLevel(childPath, families, rule, pages).length === 0) continue;
            const attrs = {title: pageTitle(index), category: true, directory: childPath, url: `pages/${childPath}/00-index`};
            if (extname(index) === '.md') attrs.markdown = readFileSync(index, 'utf8');
            bag.setItem(!parts.length && groups.has(name) ? groups.get(name).key : name, null, attrs);
        } else if (extname(path) === '.js' && basename(name, '.js') !== '00-index' && !name.endsWith('_aux.js')) {
            const stem = basename(name, '.js');
            const example = families.filter(family => family.folder === parts[0]).flatMap(family => family.examples).find(item => item.folder === [...parts.slice(1), stem].join('/'));
            const metadata = path.slice(0,-3) + '.json';
            const descriptor = existsSync(metadata) ? JSON.parse(readFileSync(metadata,'utf8')) : null;
            if (descriptor?.navigation === false || descriptor?.catalogued === false) continue;
            const requires = (example ?? descriptor)?.requires;
            if (rule && !filterMatches(rule, requires)) continue;
            const title = example ? example.title : descriptor ? descriptor.title : pageTitle(path);
            const attrs = {title, url: `pages/${[...parts, stem].join('/')}`, category: false};
            for (const name of ['description','tags','component']) if (descriptor && Object.hasOwn(descriptor,name)) attrs[name] = descriptor[name];
            if (requires?.length) attrs.requires = requires;
            if (example) attrs.key = example.key;
            bag.setItem(example ? example.key : stem, null, attrs);
        }
    }
    return bag;
}
