/**
 * Serve the hosted Node site on one port: the main gallery under /gallery/, the chart gallery
 * under /chart_gallery/ and the tab page at / (one tab per gallery, each an iframe on its mount).
 *
 * Each gallery is a startGallery server of @gramlot/gramlot-js-server, the tab page a startServer
 * server; all three listen on loopback ports. The server on --port forwards a request to the
 * gallery whose mount is the first path segment, and every other request to the tab page.
 *
 * Usage: node serve-node.mjs [--host HOST] [--port PORT] [--serverless-download URL]
 */
import {request as forward, createServer} from 'node:http';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'node:util';
import {startServer} from '@gramlot/gramlot-js-server/node';

// startGallery is the module of `gramlot node gallery`; the package exports only ./node and ./bun.
const {startGallery} = await import(new URL('./gallery.mjs', import.meta.resolve('@gramlot/gramlot-js-server/node')));
const examples = join(dirname(fileURLToPath(import.meta.resolve('@gramlot/gramlot-examples'))));
const TAB_PAGE = fileURLToPath(new URL('./tab_page/', import.meta.url));

const {values} = parseArgs({options: {
    host: {type: 'string', default: '127.0.0.1'},
    port: {type: 'string', default: '8080'},
    'serverless-download': {type: 'string'},
}});

// The chart types family (base/pages/86-chart-types) has Python pages only: the Node chart gallery
// lists the families of its common catalogue.
const galleries = {
    gallery: await startGallery({mountPath: '/gallery', serverlessDownloadUrl: values['serverless-download'] ?? null}),
    chart_gallery: await startGallery({mountPath: '/chart_gallery',
        catalogs: [[join(examples, 'chart_gallery', 'catalog.json'), join(examples, 'chart_gallery', 'pages')]]}),
    documentation_gallery: await startGallery({mountPath: '/documentation_gallery',
        catalogs: [[join(examples, 'documentation_gallery', 'catalog.json'), join(examples, 'documentation_gallery', 'pages')]]}),
};
const tabPage = await startServer({pages: TAB_PAGE});

const server = createServer((incoming, outgoing) => {
    const segment = new URL(incoming.url, 'http://localhost').pathname.split('/')[1];
    const target = new URL(Object.hasOwn(galleries, segment) ? galleries[segment].url : tabPage.url);
    const proxied = forward({hostname: target.hostname, port: target.port, method: incoming.method,
        path: incoming.url, headers: incoming.headers}, answer => {
        outgoing.writeHead(answer.statusCode, answer.headers);
        answer.pipe(outgoing);
    });
    proxied.on('error', error => {
        console.error(error);
        if (!outgoing.headersSent) outgoing.writeHead(502, {'Content-Type': 'text/plain'});
        outgoing.end('Bad gateway');
    });
    incoming.pipe(proxied);
});
await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(Number(values.port), values.host, resolve);
});
console.log(`Gramlot galleries (node): http://${values.host}:${server.address().port}/`);
for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, async () => {
        server.close();
        await Promise.all([...Object.values(galleries), tabPage].map(app => app.close()));
        process.exit(0);
    });
}
