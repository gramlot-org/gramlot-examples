/** Install the same import map before Bun resolves the test modules. */
import {GramlotFileServer, standardCollectionAssets} from '@gramlot/gramlot/server';
import {registerCollectionModules} from './register-collection-modules.mjs';
const assets = standardCollectionAssets();
await registerCollectionModules(Object.fromEntries(new GramlotFileServer('.').collections.map(({name,module}) => [
    '@gramlot/collections/'+name, assets.find(item => item.url === module).file.href])));
