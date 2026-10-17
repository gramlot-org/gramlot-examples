// Collections selected by the gallery application.
import inputs from '@gramlot/gramlot/components/inputs';
import layout from '@gramlot/gramlot/components/layout';
export const collections = [inputs, layout].map(collection => ({grammar: collection.toDocument(), module: `/gallery/dist/${collection.name}.js`}));
