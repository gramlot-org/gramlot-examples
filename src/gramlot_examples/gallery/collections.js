// Prepared artifacts shared with Python; never rebuild them in the gallery.
import inputs, {buildId as inputsBuildId} from './dist/inputs/assets/index.js';
import layout, {buildId as layoutBuildId} from './dist/layout/assets/index.js';
import tree, {buildId as treeBuildId} from './dist/tree/assets/index.js';
import editors, {buildId as editorsBuildId} from './dist/editors/assets/index.js';
import typst, {buildId as typstBuildId} from './dist/typst/assets/index.js';

export const collections = [[inputs,inputsBuildId],[layout,layoutBuildId],[tree,treeBuildId],
    [editors,editorsBuildId],[typst,typstBuildId]].map(([collection,buildId])=>{
    const root = new URL(`./dist/${collection.name}/`,import.meta.url);
    const hostRoot = `/gramlot/collections/${encodeURIComponent(collection.name)}/${buildId.slice(7)}/`;
    return {name:collection.name,grammar:collection.toDocument(),buildId,
        module:hostRoot+'assets/index.js',dependencies:collection.dependencies.map(item=>item.name),
        css:collection.css.map(url=>{
            if (!url.href.startsWith(root.href)) throw new Error('Collection stylesheet escapes its package');
            return hostRoot+url.href.slice(root.href.length);
        })};
});
