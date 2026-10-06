/**
 * Serve one folder of JavaScript pages with the core FileHost: `node scripts/serve_pages.mjs <folder> <port>`.
 *
 * The counterpart of `serve_pages.py` on the same page protocol: the runtime at `runtimeUrl`, the
 * core themes under `/themes/`, the `.js` and `.css` files below the pages folder (the page
 * modules, whose `Logic` the browser imports), the pages, and `main` and `close` as POST.
 * No Content-Security-Policy, as with the default of the adapters: e13 puts an inline
 * `script` in its Source, and the inline expressions of the pages need eval.
 */
import {readFile, realpath} from 'node:fs/promises';
import {createServer} from 'node:http';
import {dirname, extname, join, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {FileHost, PageExpired, PageNotFound} from '@gramlot/gramlot/server';

const MEDIA_TYPES = {'.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8'};
const RUNTIME = fileURLToPath(import.meta.resolve('@gramlot/gramlot/runtime'));
const THEMES = dirname(dirname(fileURLToPath(import.meta.resolve('@gramlot/gramlot/themes/gramlot-base/theme.css'))));

/** The file `relative` below `root` when its real path stays there and its type is served, else null. */
async function servedFile(root, relative) {
    try {
        const real = await realpath(join(root, ...relative.split('/').filter(Boolean)));
        return real.startsWith((await realpath(root)) + sep) && MEDIA_TYPES[extname(real)] ? real : null;
    } catch {
        return null;
    }
}

export function servePages(folder, port) {
    const pages = resolve(folder);
    const host = new FileHost(pages);
    return createServer(async (request, response) => {
        const reply = (status, body, type) => {
            response.writeHead(status, {'Content-Type': type});
            response.end(body);
        };
        const path = request.url.split('?')[0];
        try {
            if (request.method === 'GET') {
                if (path === host.runtimeUrl) return reply(200, await readFile(RUNTIME), MEDIA_TYPES['.js']);
                if (path.startsWith('/themes/') || /\.(js|css)$/.test(path)) {
                    const file = path.startsWith('/themes/')
                        ? await servedFile(THEMES, path.slice('/themes/'.length)) : await servedFile(pages, path);
                    return file ? reply(200, await readFile(file), MEDIA_TYPES[extname(file)]) : reply(404, 'Not found', 'text/plain');
                }
                const opened = await host.openPage(path);
                return reply(200, opened.html, 'text/html; charset=utf-8');
            }
            const chunks = [];
            for await (const chunk of request) chunks.push(chunk);
            const payload = JSON.parse(Buffer.concat(chunks).toString());
            if (path === host.closeUrl) {
                host.closePage(payload.pageId);
                return reply(200, '{}', 'application/json');
            }
            if (path === host.mainUrl) return reply(200, await host.main(payload.pageId), 'application/json');
            return reply(404, 'Not found', 'text/plain');
        } catch (error) {
            if (error instanceof PageNotFound || error instanceof PageExpired) {
                return reply(404, 'Not found', 'text/plain');
            }
            throw error;
        }
    }).listen(port, '127.0.0.1');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const [folder, port] = process.argv.slice(2);
    const server = servePages(folder, Number(port));
    server.on('listening', () => console.log(`http://127.0.0.1:${server.address().port}`));
}
