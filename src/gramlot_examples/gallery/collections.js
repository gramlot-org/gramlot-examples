// Collections selected by the gallery application.
import inputs from '@gramlot/gramlot/components/inputs';
import layout from '@gramlot/gramlot/components/layout';
import tree from '@gramlot/gramlot/components/tree';
export const collections = [inputs, layout, tree].map(collection => ({grammar: collection.toDocument(), module: `/gallery/dist/${collection.name}.js`}));
