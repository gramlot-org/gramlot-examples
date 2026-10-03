/** Serve one folder of JavaScript pages with gramlot-js-server: `node scripts/serve_pages.mjs <folder> <port>`. */
import {resolve} from 'node:path';
import {startServer} from '@gramlot/gramlot-js-server/node';

const [folder, port] = process.argv.slice(2);
const app = await startServer({pages: resolve(folder), port: Number(port)});
console.log(app.url);
