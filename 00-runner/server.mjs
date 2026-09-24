/** Node host for the local runner; the Python launcher owns the public port. */
import {fileURLToPath} from 'node:url';
import {startNativeServer} from 'gramlot-js-server/native';

const pages = fileURLToPath(new URL(process.env.GRAMLOT_RUNNER_PAGES));
const app = await startNativeServer({
    pages,
    port: 0,
    runtimeUrl: '/js/assets/gramlot.js',
    mainUrl: '/js/gramlot/main',
    sourceUrl: '/js/gramlot/source',
    closeUrl: '/js/gramlot/close',
});
console.log(app.url);
for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, async () => { await app.close(); process.exit(0); });
}
