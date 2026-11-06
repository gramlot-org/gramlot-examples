// Generate gallery catalogues from metadata stored beside lessons and families.
import {existsSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, join, relative, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const pkg = fileURLToPath(new URL('../src/gramlot_examples/', import.meta.url));
const targets = [
    {catalog:'catalog.json', pages:'pages'},
    ...['catalog.json', 'asqueel-catalog.json', 'cached-trial-catalog.json', 'selection-trial-catalog.json', 'chart-reports-catalog.json']
        .map(catalog => ({catalog:`base/${catalog}`, pages:'base/pages'})),
    ...['page_store', 'chat_base', 'kajenn_db'].map(name => ({catalog:`trials/${name}/catalog.json`, pages:`trials/${name}/pages`})),
];
const environments = new Map([
    ['base/chart-reports-catalog.json','chart-reports'], ['base/catalog.json','base'], ['base/asqueel-catalog.json','base-asqueel'],
    ['base/cached-trial-catalog.json','asqueel-only'], ['base/selection-trial-catalog.json','selection-trial'],
    ['trials/page_store/catalog.json','pagestore'], ['trials/chat_base/catalog.json','chat'], ['trials/kajenn_db/catalog.json','kajenn-db'],
]);
const read = p => JSON.parse(readFileSync(p, 'utf8'));
function walk(dir) {
    return readdirSync(dir, {withFileTypes:true}).flatMap(entry => {
        const p = join(dir, entry.name);
        return entry.isDirectory() ? walk(p) : entry.isFile() && entry.name.endsWith('.json') && entry.name !== '_family.json' && entry.name !== '00-index.json' ? [p] : [];
    });
}
function validate(item, p) {
    if (typeof item.key !== 'string' || !item.key || typeof item.title !== 'string' || !item.title ||
        typeof item.description !== 'string' || !item.description || !Array.isArray(item.tags) ||
        item.tags.some(tag => typeof tag !== 'string' || !tag.trim()) || !Number.isInteger(item.order) || item.order < 0 ||
        (Object.hasOwn(item, 'requires') && (!Array.isArray(item.requires) || item.requires.some(need => typeof need !== 'string' || !need.trim()))) ||
        Object.hasOwn(item, 'explanation') || Object.hasOwn(item, 'folder')) throw new Error(`Invalid lesson metadata: ${p}`);
    const stem = p.slice(0, -5);
    for (const ext of ['.py','.md']) if (!existsSync(stem + ext)) throw new Error(`Missing ${ext} for ${p}`);
}
function unique(values, message) { if(new Set(values).size !== values.length) throw new Error(message); }
for (const {catalog,pages} of targets) {
    const root=resolve(pkg,pages), name=catalog.split('/').at(-1), families=[];
    for (const entry of readdirSync(root,{withFileTypes:true})) {
        if(!entry.isDirectory()) continue;
        const folder=join(root,entry.name), config=join(folder,'_family.json');
        if(!existsSync(config)) continue;
        const family=read(config); if(family.catalog !== name) continue;
        if(typeof family.key!=='string' || !family.key || typeof family.title!=='string' || !family.title || !Number.isInteger(family.order)) throw new Error(`Invalid family metadata: ${config}`);
        const examples=walk(folder).map(p=>{
            const item=read(p);validate(item,p);
            const {order,catalogued,navigation,...metadata}=item;
            return {order, catalogued:catalogued !== false, metadata:{...metadata,folder:relative(folder,p.slice(0,-5)).split(sep).join('/')}};
        });
        const catalogued = examples.filter(e=>e.catalogued);
        unique(catalogued.map(e=>e.order),`Duplicate lesson order in ${folder}`);
        catalogued.sort((a,b)=>a.order-b.order);
        families.push({order:family.order, metadata:{key:family.key,title:family.title,folder:entry.name,examples:catalogued.map(e=>e.metadata)}});
    }
    if(!families.length) throw new Error(`No families for ${catalog}`);
    unique(families.map(f=>f.order),`Duplicate family order in ${catalog}`);
    families.sort((a,b)=>a.order-b.order);
    unique(families.flatMap(f=>[f.metadata.key,...f.metadata.examples.map(e=>e.key)]),`Duplicate key in ${catalog}`);
    const environment=environments.get(catalog), data={...(environment ? {environment}:{}),families:families.map(f=>f.metadata)};
    const dest=resolve(pkg,catalog), generated=JSON.stringify(data,null,2)+'\n';
    if(process.argv.includes('--check')) {
        if(!existsSync(dest) || readFileSync(dest,'utf8')!==generated) throw new Error(`Catalogue out of date: ${catalog}`);
    } else writeFileSync(dest,generated);
}
